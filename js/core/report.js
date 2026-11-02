// =============================================================
// report.js — calcul du bilan, de la note indicative et génération du PDF
// =============================================================
import { CONFIG } from '../content/config.js';
import { CONTENT } from '../content/index.js';
import { REGIONS } from '../content/world.js';
import { PDFDoc } from './pdf.js';
import { hmac, fmtDuration } from './util.js';

const REG_ORDER = ['village', 'steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge', 'sanctuaire'];

/** Construit l'objet bilan (données brutes + score), signé. */
export function buildReport(S, game) {
  const T = S.tracker;
  const quests = CONTENT.QUESTS_LIST.map(q => {
    const st = S.quests[q.id];
    const regionDone = q.region === 'village' ? Object.keys(S.seeds).length >= 8 : !!S.seeds[q.region];
    const status = st ? (st.status === 'done' ? 'faite' : 'en cours') : (regionDone || S.ended ? 'ignorée' : 'non commencée');
    return { id: q.id, title: q.title, region: q.region, main: !!q.main, status };
  });
  const puzzles = Object.entries(T.puzzles).map(([id, p]) => ({ id, title: p.title, region: p.region, main: p.main, kind: CONTENT.PUZZLES[id] ? CONTENT.PUZZLES[id].type : '?', success: p.success, attempts: p.attempts, hints: p.hints, abandoned: p.abandoned, timeMs: Math.round(p.timeMs), firstTry: p.firstTry, teacher: !!p.teacher }));
  const qcm = Object.entries(T.qcm).map(([id, q]) => ({ id, set: q.set, q: q.q, kind: q.kind, attempts: q.attempts, firstOk: q.firstOk, ok: q.ok, answers: q.answers }));
  const dlg = Object.values(T.dialogues).reduce((a, d) => ({ bubbles: a.bubbles + d.bubbles, read: a.read + d.read, skimmed: a.skimmed + d.skimmed, npcs: a.npcs + 1 }), { bubbles: 0, read: 0, skimmed: 0, npcs: 0 });
  const allNpcs = Object.keys(CONTENT.NPCS);
  const npcIgnored = allNpcs.filter(n => !T.dialogues[n]).map(n => CONTENT.NPCS[n].name);
  const videos = Object.entries(CONTENT.VIDEOS).map(([id, v]) => ({ id, title: v.title, required: v.required !== false, opened: T.videos[id] ? T.videos[id].opened : 0, done: !!(T.videos[id] && T.videos[id].done) }));
  const missions = Object.entries(CONTENT.MISSIONS).map(([id, m]) => ({ id, title: m.title, done: !!T.missions[id], values: T.missions[id] ? T.missions[id].values : null, labels: m.fields.map(f => f.q) }));
  const open = Object.entries(CONTENT.QUESTIONS).map(([id, q]) => ({ id, title: q.title, q: q.q, text: T.open[id] ? T.open[id].text : '', words: T.open[id] ? T.open[id].words : 0, timeMs: T.open[id] ? Math.round(T.open[id].timeMs) : 0 }));
  const secretsTot = Object.keys(CONTENT.SECRETS_LIST).length;
  const rep = {
    format: 'verdance-bilan-v1',
    reportId: 'B' + Date.now().toString(36).toUpperCase(),
    saveId: S.id,
    generatedAt: new Date().toISOString(),
    course: CONFIG.courseName, school: CONFIG.schoolName,
    identity: S.identity,
    title: S.title, ended: !!S.ended, teacherModeUsed: !!S.flags.teacher_used,
    difficulty: game ? game.settings.difficulty : 'normal',
    verdance: game ? game.verdance() : 0,
    seeds: Object.keys(S.seeds), items: Object.keys(S.items),
    time: { totalMs: Math.round(T.totalTime), idleMs: Math.round(T.idleTime), regions: REG_ORDER.map(r => ({ id: r, name: REGIONS[r].name, ms: Math.round(T.regionTime[r] || 0), green: !!S.seeds[r] || (r === 'village' && Object.keys(S.seeds).length >= 8) })), firstPlay: T.firstPlay, lastPlay: Date.now() },
    quests, puzzles, qcm, open, missions, videos,
    dialogues: { ...dlg, npcTotal: allNpcs.length, npcIgnored },
    combat: T.combat,
    exploration: { rate: game ? Math.round(game.explorationRate() * 100) : 0, secrets: Object.keys(T.secrets).length, secretsTotal: secretsTot, codex: Object.keys(S.codex).length, codexTotal: Object.keys(CONTENT.CODEX).length },
    hints: T.hintsUsed,
    fresque: T.puzzles.fresque_verdance ? { done: !!T.puzzles.fresque_verdance.success, errors: (T.puzzles.fresque_verdance.details || {}).errors || 0, reflection: (T.puzzles.fresque_verdance.details || {}).reflection || '' } : null,
    commitment: T.commitment || null,
  };
  rep.score = computeScore(rep);
  rep.signature = sign(rep);
  return rep;
}

export function canonical(rep) { const c = {}; for (const [k, v] of Object.entries(rep)) if (k !== 'signature' && k[0] !== '_') c[k] = v; return JSON.stringify(c); }
export function sign(rep) { return hmac(CONFIG.integritySecret, canonical(rep)).slice(0, 32); }
export function verify(rep) { return rep && rep.signature === sign(rep); }

/** Note indicative (voir README, « Notation »). */
export function computeScore(rep) {
  const G = CONFIG.grading, W = G.weights;
  // --- Bloc QCM / énigmes
  let num = 0, den = 0;
  const qcmById = Object.fromEntries(rep.qcm.map(q => [q.id, q]));
  for (const [pid, def] of Object.entries(CONTENT.PUZZLES)) {
    const main = def.main !== false;
    const p = rep.puzzles.find(x => x.id === pid);
    if (!main && !p) continue; // les énigmes secondaires non tentées ne pénalisent pas
    const w = main ? W.main : W.side;
    if (def.type === 'qcm' || def.type === 'choice') {
      const qs = def.type === 'qcm' ? def.questions.map((q, i) => q.id || `${pid}_${i}`) : def.nodes.map((n, i) => `${pid}_n${i}`);
      for (const qid of qs) { den += w; const r = qcmById[qid]; if (r && r.firstOk) num += w; else if (r && r.ok) num += w * 0.3; }
    } else {
      den += w * 2; // une énigme vaut deux questions
      if (p && p.success) num += w * 2 * (p.firstTry === true ? 1 : p.attempts <= 2 ? 0.8 : 0.6);
    }
  }
  for (const q of rep.qcm) if (q.kind === 'combat') { den += W.combat; if (q.firstOk) num += W.combat; }
  const hintPen = Math.min(G.maxHintPenalty, rep.hints * G.hintPenalty);
  const teacherSolved = rep.puzzles.filter(p => p.teacher).length;
  const qcmScore = Math.max(0, (den ? (num / den) * G.qcm : 0) - hintPen);
  // --- Progression
  const mains = rep.quests.filter(q => q.main), sides = rep.quests.filter(q => !q.main);
  const mainR = mains.filter(q => q.status === 'faite').length / (mains.length || 1);
  const sideR = sides.filter(q => q.status === 'faite').length / (sides.length || 1);
  const expR = ((rep.exploration.rate / 100) + (rep.exploration.secrets / (rep.exploration.secretsTotal || 1))) / 2;
  const prog = G.progression * (mainR * 0.625 + Math.min(1, sideR * 1.25) * 0.25 + expR * 0.125);
  // --- Engagement
  const d = rep.dialogues; const readR = d.bubbles ? d.read / d.bubbles : 0;
  const req = rep.videos.filter(v => v.required); const vidR = req.filter(v => v.done).length / (req.length || 1);
  const misR = rep.missions.filter(m => m.done).length / (rep.missions.length || 1);
  const eng = G.engagement * (readR * 0.4 + vidR * 0.3 + misR * 0.3);
  const auto = qcmScore + prog + eng;
  const maxAuto = G.qcm + G.progression + G.engagement;
  return {
    blocks: [
      { id: 'qcm', label: 'QCM et énigmes', score: round(qcmScore), max: G.qcm, detail: `${Math.round(den ? num / den * 100 : 0)} % de réussite pondérée au 1er essai ; pénalité indices −${round(hintPen)}${teacherSolved ? ` ; ${teacherSolved} énigme(s) résolue(s) en mode enseignant` : ''}` },
      { id: 'progression', label: 'Progression et exploration', score: round(prog), max: G.progression, detail: `Quêtes principales ${Math.round(mainR * 100)} % · secondaires ${Math.round(sideR * 100)} % · exploration ${rep.exploration.rate} % · secrets ${rep.exploration.secrets}/${rep.exploration.secretsTotal}` },
      { id: 'engagement', label: 'Engagement', score: round(eng), max: G.engagement, detail: `Dialogues lus ${Math.round(readR * 100)} % · vidéos obligatoires ${Math.round(vidR * 100)} % · missions terrain ${Math.round(misR * 100)} %` },
      { id: 'open', label: 'Questions ouvertes (enseignant)', score: null, max: G.open, detail: `${rep.open.filter(o => o.text).length} / ${rep.open.length} réponses rédigées` },
    ],
    auto: round(auto), maxAuto, total: 20,
  };
}
const round = v => Math.round(v * 100) / 100;

// ---------------------------------------------------------------- PDF
export function reportPdf(rep) {
  const doc = new PDFDoc();
  const M = 42, W = doc.W - 2 * M;
  let y = 0;
  const G = '#2f8a3e', D = '#1b1420', MUT = '#6a6470', RED = '#c0392b';
  const newPage = () => { doc.page(); y = M; footer(); };
  const footer = () => { doc.text(M, doc.H - 28, `Verdance — Bilan ${rep.reportId} — ${rep.identity.prenom || ''} ${rep.identity.nom || ''} — code d'intégrité ${rep.signature}`, { size: 7, color: MUT }); };
  const need = h => { if (y + h > doc.H - 50) newPage(); };
  const h1 = t => { need(70); doc.rect(M, y, W, 22, G); doc.text(M + 8, y + 5, t, { size: 13, bold: true, color: '#ffffff' }); y += 30; };
  const h2 = t => { need(22); doc.text(M, y, t, { size: 11, bold: true, color: G }); y += 15; doc.line(M, y, M + W, y, '#cfe3d2', 0.8); y += 6; };
  const para = (t, o = {}) => { const size = o.size || 9; for (const l of doc.wrap(t, W - (o.indent || 0), size, o.bold)) { need(size + 3); doc.text(M + (o.indent || 0), y, l, { size, bold: o.bold, color: o.color || D }); y += size + 3; } };
  const row = (cells, widths, o = {}) => {
    const size = o.size || 8;
    const wrapped = cells.map((c, i) => doc.wrap(String(c ?? ''), widths[i] - 6, size, o.bold));
    const h = Math.max(...wrapped.map(w => w.length)) * (size + 2) + 5;
    need(h);
    if (o.fill) doc.rect(M, y, W, h, o.fill);
    let x = M;
    wrapped.forEach((lines, i) => { lines.forEach((l, k) => doc.text(x + 3, y + 3 + k * (size + 2), l, { size, bold: o.bold, color: o.colors ? o.colors[i] : D })); x += widths[i]; });
    y += h; doc.line(M, y, M + W, y, '#e6e6e6', 0.4);
  };

  // ---- Page 1 : synthèse
  newPage();
  doc.rect(0, 0, doc.W, 96, '#16301c');
  doc.text(M, 24, 'VERDANCE', { size: 22, bold: true, color: '#9aff7a' });
  doc.text(M, 52, `Bilan de jeu — ${rep.course}`, { size: 11, color: '#ffffff' });
  if (rep.school) doc.text(M, 68, rep.school, { size: 9, color: '#cfe3d2' });
  doc.text(doc.W - M, 26, new Date(rep.generatedAt).toLocaleString('fr-FR'), { size: 9, color: '#cfe3d2', align: 'right' });
  doc.text(doc.W - M, 42, `Bilan n° ${rep.reportId}`, { size: 9, color: '#cfe3d2', align: 'right' });
  y = 112;
  const id = rep.identity;
  doc.text(M, y, `${id.prenom || ''} ${id.nom || ''}`.trim() || '(sans nom)', { size: 16, bold: true }); y += 22;
  doc.text(M, y, `Groupe : ${id.groupe || '—'}   ·   Titre en jeu : ${rep.title}   ·   Difficulté : ${rep.difficulty}${rep.ended ? '   ·   JEU TERMINÉ' : ''}`, { size: 9, color: MUT }); y += 18;
  if (rep.teacherModeUsed) { doc.text(M, y, '⚠ Le mode enseignant a été activé sur cette partie.', { size: 9, bold: true, color: RED }); y += 14; }
  // Note
  const sc = rep.score;
  doc.rect(M, y, W, 64, '#f2f8f2', '#cfe3d2');
  doc.text(M + 12, y + 10, 'Note indicative', { size: 10, bold: true, color: G });
  doc.text(M + 12, y + 28, `${sc.auto.toFixed(2)} / ${sc.maxAuto}`, { size: 22, bold: true, color: D });
  doc.text(M + 140, y + 32, `+  ____ / ${CONFIG.grading.open}  (questions ouvertes, enseignant)   =   ____ / 20`, { size: 11, color: D });
  y += 76;
  row(['Bloc', 'Points', 'Détail'], [150, 60, W - 210], { bold: true, fill: '#e8f3ea' });
  for (const b of sc.blocks) row([b.label, b.score === null ? `__ / ${b.max}` : `${b.score.toFixed(2)} / ${b.max}`, b.detail], [150, 60, W - 210]);
  y += 10;
  h2('Vue d’ensemble');
  const t = rep.time;
  para(`Temps de jeu total : ${fmtDuration(t.totalMs)} (dont inactivité > 2 min : ${fmtDuration(t.idleMs)}). Verdance : ${rep.verdance} %. Graines-Mères : ${rep.seeds.length} / 8. Exploration : ${rep.exploration.rate} %. Secrets : ${rep.exploration.secrets} / ${rep.exploration.secretsTotal}. Codex : ${rep.exploration.codex} / ${rep.exploration.codexTotal} fragments.`);
  para(`Combat : ${rep.combat.kills} créatures vaincues · parades de vérité ${rep.combat.parryOk} réussies / ${rep.combat.parryKo} ratées · défis d’élite ${rep.combat.eliteOk} / ${rep.combat.eliteOk + rep.combat.eliteKo} · évanouissements ${rep.combat.deaths}. Indices utilisés : ${rep.hints}.`);
  const d = rep.dialogues;
  para(`Dialogues : ${d.bubbles} bulles, dont ${d.read} lues et ${d.skimmed} passées rapidement. PNJ rencontrés : ${d.npcs} / ${d.npcTotal}.`);
  y += 4;
  h2('Temps par région');
  row(['Région', 'Temps actif', 'État'], [220, 120, W - 340], { bold: true, fill: '#e8f3ea' });
  for (const r of t.regions) row([r.name, fmtDuration(r.ms), r.green ? 'Reverdie' : '—'], [220, 120, W - 340]);

  // ---- Quêtes
  h1('Quêtes');
  row(['Quête', 'Type', 'Région', 'Statut'], [250, 70, 120, W - 440], { bold: true, fill: '#e8f3ea' });
  for (const q of rep.quests) row([q.title, q.main ? 'Principale' : 'Secondaire', REGIONS[q.region] ? REGIONS[q.region].name : q.region, q.status], [250, 70, 120, W - 440], { colors: [D, D, D, q.status === 'faite' ? G : q.status === 'ignorée' ? RED : MUT] });

  // ---- Énigmes
  h1('Escape games et énigmes');
  row(['Énigme', 'Résultat', 'Essais', 'Indices', 'Durée'], [230, 90, 50, 50, W - 420], { bold: true, fill: '#e8f3ea' });
  for (const p of rep.puzzles) row([p.title + (p.main === false ? ' (secondaire)' : ''), p.success ? (p.firstTry === true ? 'Réussi 1er essai' : 'Réussi') + (p.teacher ? ' [prof]' : '') : (p.abandoned ? `Abandonné ×${p.abandoned}` : 'En cours'), p.attempts, p.hints, fmtDuration(p.timeMs)], [230, 90, 50, 50, W - 420], { colors: [D, p.success ? G : RED, D, D, D] });

  // ---- QCM
  h1('Réponses aux QCM');
  const qs = rep.qcm.filter(q => q.kind !== 'combat');
  row(['Question', '1er essai', 'Essais', 'Réponses données'], [250, 55, 45, W - 350], { bold: true, fill: '#e8f3ea' });
  for (const q of qs) row([q.q, q.firstOk ? 'Juste' : 'Faux', q.attempts, q.answers.map(a => (a.ok ? '✔ ' : '✗ ') + a.a).join(' | ')], [250, 55, 45, W - 350], { size: 7, colors: [D, q.firstOk ? G : RED, D, MUT] });
  const cb = rep.qcm.filter(q => q.kind === 'combat');
  if (cb.length) {
    y += 6; h2(`Parades et défis en combat (${cb.filter(q => q.firstOk).length} / ${cb.length} justes au 1er essai)`);
    for (const q of cb) row([q.q, q.firstOk ? 'Juste' : 'Faux', q.attempts, q.answers.map(a => a.a).join(' | ')], [250, 55, 45, W - 350], { size: 7, colors: [D, q.firstOk ? G : RED, D, MUT] });
  }

  // ---- Questions ouvertes
  h1('Questions ouvertes (à noter)');
  for (const o of rep.open) {
    need(40);
    doc.text(M, y, o.title, { size: 10, bold: true, color: G }); doc.text(M + W, y, 'Note : ____', { size: 9, align: 'right', color: MUT }); y += 14;
    para(o.q, { size: 8, color: MUT });
    if (o.text) { para(o.text, { size: 9, indent: 8 }); para(`${o.words} mots · rédaction ${fmtDuration(o.timeMs)}`, { size: 7, color: MUT, indent: 8 }); }
    else para('(pas de réponse)', { size: 9, color: RED, indent: 8 });
    y += 8;
  }

  // ---- Fresque et engagement
  h1('Prise de conscience et engagement');
  h2('La Grande Fresque');
  if (rep.fresque && rep.fresque.done) {
    para(`Fresque reconstituée (${rep.fresque.errors} vérification(s) erronée(s)).`, { size: 9 });
    para('Réflexion de l’élève : ' + (rep.fresque.reflection || '(pas de réflexion écrite)'), { size: 9, indent: 8, color: rep.fresque.reflection ? D : MUT });
  } else para('(fresque non faite)', { size: 9, color: RED });
  y += 4; h2('Mon engagement');
  if (rep.commitment) {
    rep.commitment.choices.forEach(c => para('• ' + c, { size: 9, indent: 8 }));
    para('Avec ses mots : ' + rep.commitment.text, { size: 9, indent: 8, bold: true });
    para(`Quand : ${rep.commitment.when}${rep.commitment.measure ? ' · Indicateur : ' + rep.commitment.measure : ''}`, { size: 8, indent: 8, color: MUT });
  } else para('(pas encore d’engagement : il est demandé à la fin du jeu)', { size: 9, color: MUT });
  y += 6;

  // ---- Missions & vidéos
  h1('Missions terrain et vidéos');
  for (const m of rep.missions) {
    para(`${m.done ? '✔' : '✗'} ${m.title}`, { bold: true, size: 9, color: m.done ? G : RED });
    if (m.values) m.values.forEach((v, i) => para(`${m.labels[i].replace(/\*\*/g, '')} → ${v}`, { size: 8, indent: 10 }));
  }
  y += 6;
  for (const v of rep.videos) para(`${v.done ? '✔' : '✗'} ${v.title}${v.required ? ' (obligatoire)' : ''} — ouverte ${v.opened} fois`, { size: 8, color: v.done ? D : MUT });
  if (rep.dialogues.npcIgnored.length) { y += 6; para('PNJ jamais abordés : ' + rep.dialogues.npcIgnored.join(', '), { size: 8, color: MUT }); }

  // ---- Grille
  h1('Grille de notation');
  para(`QCM et énigmes (${CONFIG.grading.qcm} pts) : réussite au premier essai, pondérée (principal ×${CONFIG.grading.weights.main}, secondaire ×${CONFIG.grading.weights.side}, combat ×${CONFIG.grading.weights.combat}) ; une énigme vaut 2 questions (100 % au 1er essai, 80 % en 2 essais, 60 % au-delà) ; −${CONFIG.grading.hintPenalty} pt par indice (max −${CONFIG.grading.maxHintPenalty}).`, { size: 8 });
  para(`Progression (${CONFIG.grading.progression} pts) : quêtes principales 62,5 %, secondaires 25 % (80 % des quêtes secondaires suffisent pour le maximum), exploration et secrets 12,5 %.`, { size: 8 });
  para(`Engagement (${CONFIG.grading.engagement} pts) : dialogues réellement lus 40 %, vidéos obligatoires 30 %, missions terrain 30 %.`, { size: 8 });
  para(`Questions ouvertes (${CONFIG.grading.open} pts) : à l’appréciation de l’enseignant·e (pertinence, justification, lien avec le cours).`, { size: 8 });
  y += 6;
  para(`Code d’intégrité : ${rep.signature}. Vérifiable avec la page correction.html de l’enseignant (toute modification des données rend le code invalide).`, { size: 8, color: MUT });

  return doc.build({ ownerPassword: CONFIG.pdfOwnerPassword, userPassword: CONFIG.pdfUserPassword || '', data: JSON.stringify(rep), title: `Bilan Verdance — ${id.prenom || ''} ${id.nom || ''}`, author: `${id.prenom || ''} ${id.nom || ''}` });
}

export function downloadBlob(bytes, name, type) {
  const blob = new Blob([bytes], { type });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
export function reportFileName(rep, ext) {
  const clean = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `Verdance_${clean(rep.identity.groupe) || 'groupe'}_${clean(rep.identity.nom) || 'nom'}_${clean(rep.identity.prenom) || 'prenom'}_${rep.reportId}.${ext}`;
}
