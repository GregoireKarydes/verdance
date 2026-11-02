// =============================================================
// panels.js — menus : inventaire, journal, carte, codex, bilan, options,
// mode enseignant, borne d'arcade Eco-Slash, graphiques des fresques
// =============================================================
import { esc, md, fmtDuration, clamp, TILE } from './util.js';
import { modal, toast, confirmBox, alertBox } from './ui.js';
import { audio } from './audio.js';
import { icon, creature } from './gfx.js';
import { CONTENT } from '../content/index.js';
import { REGIONS, GRID } from '../content/world.js';
import { CONFIG } from '../content/config.js';
import { RW, RH, regionOrigin } from './world.js';
import { buildReport, reportPdf, downloadBlob, reportFileName } from './report.js';
import { listReports, storeReport, saveSettings, deleteReport } from './state.js';
import { input } from './input.js';

const TABS = [['inventory', '🎒 Inventaire'], ['journal', '📜 Journal'], ['map', '🗺 Carte'], ['codex', '📖 Codex'], ['report', '📄 Mon bilan'], ['options', '⚙ Options']];
const REG_ORDER = ['village', 'steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge', 'sanctuaire'];

export function openMenu(game, tab = 'pause', app) {
  if (tab === 'pause') tab = 'inventory';
  audio.sfx('select');
  const tabs = [...TABS]; if (game.teacher) tabs.push(['teacher', '🧑‍🏫 Enseignant']);
  const m = modal(`<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab" role="tab" data-t="${k}">${l}</button>`).join('')}</div><div class="tabbody"></div>`, { title: 'Menu — ' + (game.state.identity.prenom || ''), icon: '🌿', wide: true, full: true, cls: 'menu' });
  const tb = m.body.querySelector('.tabbody');
  const show = k => {
    m.body.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.t === k));
    tb.innerHTML = ''; tb.scrollTop = 0;
    ({ inventory: tabInventory, journal: tabJournal, map: tabMap, codex: tabCodex, report: tabReport, options: tabOptions, teacher: tabTeacher })[k](game, tb, m, app, show);
  };
  m.body.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => { audio.sfx('select'); show(b.dataset.t); }));
  // navigation clavier entre onglets : Q/E ou ←/→ avec Ctrl
  const keyH = e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    const i = tabs.findIndex(t => m.body.querySelector('.tab.on') && t[0] === m.body.querySelector('.tab.on').dataset.t);
    if (e.code === 'PageDown' || (e.code === 'ArrowRight' && e.ctrlKey)) { show(tabs[(i + 1) % tabs.length][0]); }
    if (e.code === 'PageUp' || (e.code === 'ArrowLeft' && e.ctrlKey)) { show(tabs[(i - 1 + tabs.length) % tabs.length][0]); }
  };
  addEventListener('keydown', keyH);
  m.done.then(() => { removeEventListener('keydown', keyH); game.save(); });
  show(tab);
  return m;
}

function iconImg(name, size = 32) { const c = icon(name); return `<img class="pix" src="${c.toDataURL()}" width="${size}" height="${size}" alt="">`; }

// ---------------------------------------------------------------- Collection
function collection(g) {
  const S = g.state;
  const hearts = (JSON.stringify([CONTENT.CHESTS, CONTENT.SCRIPTS, CONTENT.NPCS, CONTENT.ON_EVENT]).match(/"heart"/g) || []).length + CONTENT.QUESTS_LIST.filter(q => q.reward && q.reward.heart).length;
  const chests = Object.values(g.world.maps).flatMap(m => m.landmarks.filter(l => l.t === 'chest'));
  const opened = chests.filter(l => S.chests[l.id]).length;
  const sec = Object.keys(CONTENT.SECRETS_LIST).length, secF = Object.keys(S.tracker.secrets).length;
  const bar = (n, t) => `<div class="cbar"><div style="width:${Math.round(100 * n / Math.max(1, t))}%"></div></div>`;
  return `<div class="collect"><div><b>💚 Fragments de feuille</b> ${S.heartPieces} / ${hearts}${bar(S.heartPieces, hearts)}</div>
    <div><b>🧰 Coffres</b> ${opened} / ${chests.length}${bar(opened, chests.length)}</div>
    <div><b>✨ Secrets</b> ${secF} / ${sec}${bar(secF, sec)}</div>
    <div class="muted small">Un coffre avec un 🔒 s’ouvrira avec un objet trouvé plus loin : reviens plus tard !</div></div>`;
}

// ---------------------------------------------------------------- Inventaire
function tabInventory(g, el) {
  const S = g.state; const I = CONTENT.ITEMS;
  const keys = ['bouclier', 'sceau', 'lanterne', 'grappin', 'lentille', 'pinces', 'cristal', 'plan'];
  el.innerHTML = `
    <div class="inv-top">
      <div class="stat">${iconImg('leaf_full', 24)} <b>${S.hp / 2}</b> / ${S.maxHp / 2} feuilles</div>
      <div class="stat">${iconImg('coin', 24)} <b>${S.graines}</b> graines</div>
      <div class="stat">${iconImg('heart', 24)} Fragments : <b>${S.heartPieces % 4}</b> / 4</div>
      <div class="stat">🏅 ${esc(S.title)}</div>
    </div>
    ${collection(g)}
    <h3>Objets clés</h3>
    <div class="items">${keys.map(k => S.items[k] ? `<div class="item" title="${esc(I[k].desc)}">${iconImg(I[k].icon, 40)}<b>${esc(I[k].name)}</b><small>${md(I[k].short || '')}</small></div>` : `<div class="item locked">${'<div class="q">?</div>'}<b>???</b><small>Pas encore trouvé</small></div>`).join('')}</div>
    <h3>Consommables et équipement</h3>
    <div class="items">
      <div class="item">${iconImg('baton', 40)}<b>Bâton de Sève</b><small>Usure : ${S.weapon} %</small></div>
      <div class="item">${iconImg('fruit', 40)}<b>Fruits ×${S.fruits}</b><button class="btn small use-fruit" ${S.fruits && S.hp < S.maxHp ? '' : 'disabled'}>Manger (+2 feuilles)</button></div>
      <div class="item">${iconImg('kit', 40)}<b>Kits ×${S.kits}</b><button class="btn small use-kit" ${S.kits && S.weapon < 100 ? '' : 'disabled'}>Réparer le bâton</button></div>
    </div>
    <h3>Graines-Mères (${Object.keys(S.seeds).length} / 8)</h3>
    <div class="seeds">${['steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge'].map(r => `<div class="seed ${S.seeds[r] ? 'on' : ''}" title="${esc(REGIONS[r].name)}">${S.seeds[r] ? `<img class="pix" src="${creature('seed').toDataURL()}" width="28" height="28" alt="">` : '·'}<small>${esc(REGIONS[r].name.split(' ').slice(-1)[0])}</small></div>`).join('')}</div>
    <p class="muted">Commandes : déplacement ZQSD / WASD / flèches · attaque Espace · interagir E · bouclier Maj · roulade Ctrl · menu Échap · carte M · codex C · journal O.</p>`;
  const f = el.querySelector('.use-fruit'); if (f) f.addEventListener('click', () => { if (g.useFruit()) tabInventory(g, el); });
  const k = el.querySelector('.use-kit'); if (k) k.addEventListener('click', () => { if (g.useKit()) { toast('🔧 Bâton réparé ! Réparer plutôt que remplacer : c’est le premier geste Green IT.', 'good'); tabInventory(g, el); } });
}

// ---------------------------------------------------------------- Journal
function tabJournal(g, el, m) {
  const S = g.state;
  const byReg = REG_ORDER.map(r => ({ r, qs: CONTENT.QUESTS_LIST.filter(q => q.region === r && S.quests[q.id]) })).filter(x => x.qs.length);
  const obj = g.currentObjective();
  el.innerHTML = `
    ${obj ? `<div class="objective">🎯 Objectif suivi : <b>${esc(obj.quest.title)}</b> — ${esc(obj.text)}</div>` : ''}
    ${byReg.map(({ r, qs }) => `<h3>${esc(REGIONS[r].name)}</h3><ul class="quests">${qs.map(q => { const st = S.quests[q.id]; const done = st.status === 'done';
      return `<li class="${done ? 'done' : ''} ${q.main ? 'main' : ''}"><span>${q.main ? '★' : '•'} <b>${esc(q.title)}</b></span><span class="qstep">${done ? '✔ Terminée' : esc(g.stepText(q.id))}</span></li>`; }).join('')}</ul>`).join('') || '<p>Aucune quête pour l’instant. Parle à Sylve, près de l’Arbre-Mère.</p>'}
    <h3>Mes réponses aux questions de réflexion</h3>
    <ul class="opens">${Object.entries(CONTENT.QUESTIONS).filter(([id]) => S.tracker.open[id]).map(([id, q]) => `<li><b>${esc(q.title)}</b> — ${S.tracker.open[id].words} mots <button class="btn small edit-open" data-id="${id}">Modifier</button></li>`).join('') || '<li class="muted">Aucune réponse rédigée pour l’instant.</li>'}</ul>
    <h3>Missions terrain</h3>
    <ul class="opens">${Object.entries(CONTENT.MISSIONS).filter(([id]) => S.tracker.missions[id]).map(([id, ms]) => `<li><b>${esc(ms.title)}</b> <button class="btn small edit-mission" data-id="${id}">Revoir</button></li>`).join('') || '<li class="muted">Aucune mission terrain réalisée pour l’instant.</li>'}</ul>`;
  el.querySelectorAll('.edit-open').forEach(b => b.addEventListener('click', async () => { await g.showOpen(b.dataset.id); tabJournal(g, el, m); }));
  el.querySelectorAll('.edit-mission').forEach(b => b.addEventListener('click', async () => { await g.showMission(b.dataset.id); tabJournal(g, el, m); }));
}

// ---------------------------------------------------------------- Carte
function tabMap(g, el) {
  const ow = g.world.overworld;
  const SC = 3;
  el.innerHTML = `<div class="mapwrap"><canvas class="worldmap" width="${ow.w * SC}" height="${ow.h * SC}"></canvas></div>
    <div class="legend"><span><i style="background:#fff"></i> Toi</span><span><i style="background:#ffe27a"></i> Objectif</span><span><i style="background:#7fffb0"></i> Racine éveillée</span><span><i style="background:#9aff7a"></i> Région reverdie</span></div>`;
  const c = el.querySelector('canvas'), x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.scale(SC, SC);
  x.drawImage(g.minimap, 0, 0);
  const ch = g.state.tracker.chunks;
  x.fillStyle = 'rgba(8,8,16,0.88)';
  for (let cy = 0; cy < ow.h / 8; cy++) for (let cx = 0; cx < ow.w / 8; cx++) if (!ch[`${cx}_${cy}`]) x.fillRect(cx * 8, cy * 8, 8, 8);
  // noms des régions
  x.setTransform(1, 0, 0, 1, 0, 0); x.font = 'bold 15px system-ui, sans-serif'; x.textAlign = 'center';
  for (let r = 0; r < GRID.length; r++) for (let cc = 0; cc < GRID[r].length; cc++) {
    const id = GRID[r][cc]; if (!id) continue;
    const visited = g.state.flags['visite_' + id];
    const nm = visited ? REGIONS[id].name : '???';
    x.fillStyle = 'rgba(0,0,0,0.65)'; x.fillRect((cc * RW + 3) * SC, (r * RH + 3) * SC, (RW - 6) * SC, 22);
    x.fillStyle = g.isGreen(id) ? '#9aff7a' : visited ? '#fff' : '#888';
    x.fillText(nm.length > 24 ? nm.slice(0, 23) + '…' : nm, (cc * RW + RW / 2) * SC, (r * RH + 3) * SC + 16);
    x.strokeStyle = 'rgba(255,255,255,0.18)'; x.strokeRect(cc * RW * SC + 0.5, r * RH * SC + 0.5, RW * SC - 1, RH * SC - 1);
  }
  x.scale(SC, SC);
  for (const l of ow.landmarks) if (l.t === 'warp' && g.state.warps[l.id]) { x.fillStyle = '#7fffb0'; x.fillRect(l.tx - 1, l.ty - 1, 3, 3); }
  const obj = g.currentObjective();
  if (obj && obj.at && !g.map.interior) { const tp = g.targetPos(obj.at); if (tp) { x.fillStyle = '#ffe27a'; x.fillRect(tp.x / TILE - 2, tp.y / TILE - 2, 4, 4); } }
  let px, py;
  if (g.map.interior) { const rp = g.state.returnPos || { x: 0, y: 0 }; px = rp.x / TILE; py = rp.y / TILE; } else { px = g.player.x / TILE; py = g.player.y / TILE; }
  x.fillStyle = '#fff'; x.fillRect(px - 2, py - 2, 4, 4); x.strokeStyle = '#000'; x.strokeRect(px - 2.5, py - 2.5, 5, 5);
}

// ---------------------------------------------------------------- Codex
function tabCodex(g, el) {
  const S = g.state; const C = CONTENT.CODEX;
  const ids = Object.keys(C); const got = ids.filter(i => S.codex[i]).length;
  el.innerHTML = `<p>Fragments de savoir : <b>${got} / ${ids.length}</b>. Le Codex rassemble tout ce que tu as appris (avec les sources).</p>
    <div class="codex"><div class="clist">${REG_ORDER.map(r => { const es = ids.filter(i => C[i].region === r); if (!es.length) return '';
      return `<h4>${esc(REGIONS[r].name)}</h4>${es.map(i => S.codex[i] ? `<button class="centry" data-id="${i}">${esc(C[i].title)}</button>` : `<button class="centry locked" disabled>???</button>`).join('')}`; }).join('')}</div>
    <div class="cview prose"><p class="muted">Choisis un fragment.</p></div></div>`;
  const v = el.querySelector('.cview');
  el.querySelectorAll('.centry[data-id]').forEach(b => b.addEventListener('click', () => {
    el.querySelectorAll('.centry').forEach(x => x.classList.remove('on')); b.classList.add('on');
    const e = C[b.dataset.id]; audio.sfx('select');
    v.innerHTML = `<h3>${esc(e.title)}</h3>${md(e.text)}${e.source ? `<div class="source">Source : ${md(e.source)}</div>` : ''}`;
  }));
}

// ---------------------------------------------------------------- Bilan
function tabReport(g, el, m, app) {
  const rep = buildReport(g.state, g);
  const reps = listReports();
  el.innerHTML = `
    <div class="report-prev">
      <div class="rp-score"><div class="big">${rep.score.auto.toFixed(1)} <small>/ ${rep.score.maxAuto}</small></div><div class="muted">note indicative automatique<br>+ ${CONFIG.grading.open} pts de questions ouvertes notées par ton enseignant·e</div></div>
      <ul>${rep.score.blocks.map(b => `<li><b>${esc(b.label)}</b> : ${b.score === null ? '— ' : b.score.toFixed(2)} / ${b.max}<br><small>${esc(b.detail)}</small></li>`).join('')}</ul>
    </div>
    <p>Temps de jeu : <b>${fmtDuration(rep.time.totalMs)}</b> · Verdance ${rep.verdance} % · ${rep.open.filter(o => o.text).length} / ${rep.open.length} questions de réflexion rédigées.</p>
    <div class="row"><button class="btn big gen-pdf">📄 Générer et télécharger mon bilan (PDF)</button>
    ${CONFIG.allowJsonExport ? '<button class="btn ghost gen-json">⬇ Export de secours (JSON)</button>' : ''}</div>
    <p class="muted">Le bilan est un PDF protégé contre la modification, avec un code d’intégrité. <b>Envoie-le à ton enseignant·e</b> (e-mail, ENT…). Il reste aussi enregistré dans ce navigateur : tu peux le retélécharger ici ou depuis l’écran-titre (« Mes bilans »).</p>
    <h3>Mes bilans enregistrés</h3>
    <div class="reports">${reports(reps)}</div>`;
  el.querySelector('.gen-pdf').addEventListener('click', () => { const r = buildReport(g.state, g); storeReport(r); downloadBlob(reportPdf(r), reportFileName(r, 'pdf'), 'application/pdf'); g.track('report', { id: r.reportId }); toast('📄 Bilan téléchargé. N’oublie pas de l’envoyer !', 'good', 5000); audio.sfx('quest'); tabReport(g, el, m, app); });
  const j = el.querySelector('.gen-json'); if (j) j.addEventListener('click', () => { const r = buildReport(g.state, g); storeReport(r); downloadBlob(new TextEncoder().encode(JSON.stringify(r, null, 1)), reportFileName(r, 'json'), 'application/json'); tabReport(g, el, m, app); });
  bindReports(el, () => tabReport(g, el, m, app));
}
export function reports(reps) {
  if (!reps.length) return '<p class="muted">Aucun bilan généré pour l’instant.</p>';
  return `<table class="tbl"><tr><th>Date</th><th>Élève</th><th>Note auto</th><th>Verdance</th><th></th></tr>${reps.map(r => `<tr><td>${new Date(r.generatedAt).toLocaleString('fr-FR')}</td><td>${esc((r.identity.prenom || '') + ' ' + (r.identity.nom || ''))}</td><td>${r.score.auto.toFixed(1)} / ${r.score.maxAuto}</td><td>${r.verdance} %</td>
    <td><button class="btn small dl-pdf" data-id="${r.reportId}">PDF</button> ${CONFIG.allowJsonExport ? `<button class="btn small ghost dl-json" data-id="${r.reportId}">JSON</button>` : ''} <button class="btn small ghost del-rep" data-id="${r.reportId}" title="Supprimer">🗑</button></td></tr>`).join('')}</table>`;
}
export function bindReports(el, refresh) {
  const find = id => listReports().find(r => r.reportId === id);
  el.querySelectorAll('.dl-pdf').forEach(b => b.addEventListener('click', () => { const r = find(b.dataset.id); downloadBlob(reportPdf(r), reportFileName(r, 'pdf'), 'application/pdf'); }));
  el.querySelectorAll('.dl-json').forEach(b => b.addEventListener('click', () => { const r = find(b.dataset.id); downloadBlob(new TextEncoder().encode(JSON.stringify(r, null, 1)), reportFileName(r, 'json'), 'application/json'); }));
  el.querySelectorAll('.del-rep').forEach(b => b.addEventListener('click', async () => { if (await confirmBox('Supprimer ce bilan de ce navigateur ? (Les fichiers déjà téléchargés ne sont pas affectés.)', 'Supprimer')) { deleteReport(b.dataset.id); refresh(); } }));
}

// ---------------------------------------------------------------- Options
export function tabOptions(g, el, m, app) {
  const st = g ? g.settings : app.settings;
  el.innerHTML = `
    <div class="opts">
      <label>Volume général <input type="range" min="0" max="1" step="0.05" data-k="master" value="${st.master}"></label>
      <label>Musique <input type="range" min="0" max="1" step="0.05" data-k="music" value="${st.music}"></label>
      <label>Effets sonores <input type="range" min="0" max="1" step="0.05" data-k="sfx" value="${st.sfx}"></label>
      <label>Taille du texte <select data-k="textSize"><option value="0.9">Normale</option><option value="1">Grande</option><option value="1.2">Très grande</option></select></label>
      <label>Vitesse du texte <select data-k="textSpeed"><option value="0.6">Lente</option><option value="1">Normale</option><option value="2">Rapide</option><option value="3">Instantanée</option></select></label>
      <label>Difficulté <select data-k="difficulty"><option value="apprentissage">Apprentissage (conseillé : dégâts réduits, pas de chrono)</option><option value="exploration">Exploration (aucun dégât)</option><option value="normal">Normale</option><option value="heroique">Héroïque</option></select></label>
      <label class="chk"><input type="checkbox" data-k="reduceMotion" ${st.reduceMotion ? 'checked' : ''}> Réduire les animations (pas de secousses ni particules)</label>
      <label class="chk"><input type="checkbox" data-k="colorblind" ${st.colorblind ? 'checked' : ''}> Contraste renforcé</label>
      <label class="chk"><input type="checkbox" data-k="minimap" ${st.minimap ? 'checked' : ''}> Afficher la mini-carte</label>
    </div>
    <p class="muted">La difficulté choisie est indiquée dans le bilan.</p>
    ${g ? `<div class="row"><button class="btn ghost save-quit">💾 Sauvegarder et revenir à l’écran-titre</button></div>` : ''}
    <h3>Mode enseignant</h3>
    <div class="row"><input type="password" class="tcode" placeholder="Code enseignant" autocomplete="off"><button class="btn ghost tbtn">${g && g.teacher ? 'Désactiver' : 'Activer'}</button></div>`;
  el.querySelectorAll('[data-k]').forEach(i => {
    const k = i.dataset.k;
    if (i.tagName === 'SELECT') i.value = String(st[k]);
    i.addEventListener(i.type === 'range' ? 'input' : 'change', () => {
      st[k] = i.type === 'checkbox' ? i.checked : i.type === 'range' ? +i.value : (k === 'difficulty' ? i.value : +i.value);
      saveSettings(st); app.applySettings(st);
    });
  });
  const sq = el.querySelector('.save-quit'); if (sq) sq.addEventListener('click', () => { g.save(); m.close(); app.toTitle(); });
  el.querySelector('.tbtn').addEventListener('click', () => {
    if (g && g.teacher) { g.teacher = null; toast('Mode enseignant désactivé.', 'info'); m.close(); return; }
    if (el.querySelector('.tcode').value === CONFIG.teacherCode) {
      if (g) { g.teacher = { god: true, fast: false }; g.state.flags.teacher_used = true; toast('🧑‍🏫 Mode enseignant activé. Onglet « Enseignant » disponible.', 'good', 4500); m.close(); }
      else { app.teacherPending = true; toast('Mode enseignant activé pour la prochaine partie.', 'good'); }
    } else { toast('Code incorrect.', 'bad'); audio.sfx('wrong'); }
  });
}

// ---------------------------------------------------------------- Enseignant
function tabTeacher(g, el, m, app) {
  const S = g.state;
  el.innerHTML = `
    <p>Outils de test. L’utilisation du mode enseignant est signalée dans le bilan.</p>
    <h3>Téléportation</h3><div class="row wrap">${REG_ORDER.map(r => `<button class="btn small tp" data-r="${r}">${esc(REGIONS[r].name)}</button>`).join('')}</div>
    <h3>Raccourcis</h3>
    <div class="row wrap">
      <button class="btn small t-items">Tous les objets clés</button>
      <button class="btn small t-gates">Ouvrir tous les passages</button>
      <button class="btn small t-heal">Soigner + 50 graines</button>
      <button class="btn small t-god">${g.teacher.god ? 'Invincible : OUI' : 'Invincible : NON'}</button>
      <button class="btn small t-fast">${g.teacher.fast ? 'Rapide : OUI' : 'Rapide : NON'}</button>
      <button class="btn small t-seed">Replanter la graine de la région actuelle</button>
      <button class="btn small t-all-seeds">8 graines (accès boss)</button>
    </div>
    <h3>Contenu</h3>
    <div class="row wrap"><button class="btn small t-cover">Couverture de l’inventaire (IDs)</button> <a class="btn small ghost" href="correction.html" target="_blank">Ouvrir correction.html ↗</a></div>
    <div class="t-out"></div>`;
  el.querySelectorAll('.tp').forEach(b => b.addEventListener('click', () => {
    const R = REGIONS[b.dataset.r], o = regionOrigin(b.dataset.r);
    m.close(); g.enterMap('overworld', (o.x + R.hub[0]) * TILE + 8, (o.y + R.hub[1]) * TILE + 12); g.region = null;
  }));
  el.querySelector('.t-items').addEventListener('click', () => { for (const k of ['bouclier', 'sceau', 'lanterne', 'grappin', 'lentille', 'pinces', 'cristal', 'plan']) S.items[k] = true; S.flags.tuto_fini = true; toast('Objets ajoutés.', 'good'); });
  el.querySelector('.t-gates').addEventListener('click', () => { for (const gt of CONTENT.GATES) S.gates[gt.id] = true; S.flags.tuto_fini = true; toast('Passages ouverts.', 'good'); });
  el.querySelector('.t-heal').addEventListener('click', () => { S.hp = S.maxHp; S.graines += 50; toast('OK', 'good'); });
  el.querySelector('.t-god').addEventListener('click', () => { g.teacher.god = !g.teacher.god; tabTeacher(g, el, m, app); });
  el.querySelector('.t-fast').addEventListener('click', () => { g.teacher.fast = !g.teacher.fast; tabTeacher(g, el, m, app); });
  el.querySelector('.t-seed').addEventListener('click', async () => { const r = g.region || g.map.region; if (r && r !== 'village' && r !== 'sanctuaire') { m.close(); await g.plantSeed(r); } else toast('Pas de graine pour cette région.', 'info'); });
  el.querySelector('.t-all-seeds').addEventListener('click', () => { for (const r of ['steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge']) { S.seeds[r] = S.seeds[r] || Date.now(); g.greenVis[r] = 1; } g.greenVis.village = 1; g._buildMinimap(); toast('8 graines.', 'good'); });
  el.querySelector('.t-cover').addEventListener('click', () => {
    const cov = CONTENT.coverage();
    el.querySelector('.t-out').innerHTML = `<p><b>${cov.covered.length} / ${cov.all.length}</b> éléments de l’inventaire sont rattachés à du contenu du jeu.${cov.missing.length ? ' Manquants : ' + cov.missing.join(', ') : ' ✔ Aucun manquant.'}</p>
      <table class="tbl small"><tr><th>ID</th><th>Où dans le jeu</th></tr>${cov.all.map(id => `<tr><td>${id}</td><td>${esc((cov.where[id] || []).slice(0, 4).join(' · ') || '—')}</td></tr>`).join('')}</table>`;
  });
}

// ---------------------------------------------------------------- Graphiques des fresques (redessinés)
export function drawChart(cv, ch) {
  const x = cv.getContext('2d'); const W = cv.width, H = cv.height;
  x.fillStyle = '#f7f1e3'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#3a2a1a'; x.font = 'bold 15px system-ui, sans-serif'; x.textAlign = 'left'; x.fillText(ch.title || '', 14, ch.note ? 22 : 24);
  if (ch.note) { x.font = 'bold 15px system-ui'; }
  const pal = ch.colors || ['#2f8a3e', '#c0392b', '#2f6ab0', '#d68a1a', '#7a4aaa', '#1a9a8a', '#aa3a6a', '#6a6a6a'];
  const L = 60, T = 42, R = W - 20, B = H - 44;
  x.font = '12px system-ui, sans-serif';
  if (ch.type === 'bars' || ch.type === 'hbars') {
    const vals = ch.values, max = ch.max || Math.max(...vals) * 1.15;
    if (ch.type === 'bars') {
      const bw = (R - L) / vals.length;
      x.strokeStyle = '#bba'; x.beginPath(); x.moveTo(L, B); x.lineTo(R, B); x.stroke();
      vals.forEach((v, i) => {
        const h = (B - T) * v / max; x.fillStyle = (ch.highlight === i) ? '#c0392b' : pal[i % pal.length];
        x.fillRect(L + i * bw + bw * 0.18, B - h, bw * 0.64, h);
        x.fillStyle = '#222'; x.textAlign = 'center'; x.fillText(fmtNum(v) + (ch.unit || ''), L + i * bw + bw / 2, B - h - 6);
        wrapText(x, ch.labels[i], L + i * bw + bw / 2, B + 16, bw - 4, 13);
      });
    } else {
      const bh = (B - T) / vals.length; const LL = 190;
      vals.forEach((v, i) => {
        const w = (R - LL - 60) * v / max; x.fillStyle = (ch.highlight === i) ? '#c0392b' : pal[i % pal.length];
        x.fillRect(LL, T + i * bh + bh * 0.15, w, bh * 0.7);
        x.fillStyle = '#222'; x.textAlign = 'right'; x.fillText(ch.labels[i], LL - 8, T + i * bh + bh * 0.62);
        x.textAlign = 'left'; x.fillText(fmtNum(v) + (ch.unit || ''), LL + w + 6, T + i * bh + bh * 0.62);
      });
    }
  } else if (ch.type === 'line') {
    const pts = ch.points; const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = ch.ymin ?? Math.min(...ys), y1 = ch.ymax ?? Math.max(...ys);
    const X = v => L + (R - L) * (v - x0) / (x1 - x0), Y = v => B - (B - T) * (v - y0) / (y1 - y0);
    x.strokeStyle = '#bba'; x.beginPath(); x.moveTo(L, T); x.lineTo(L, B); x.lineTo(R, B); x.stroke();
    if (ch.band) { x.fillStyle = 'rgba(47,138,62,0.15)'; x.fillRect(X(ch.band[0]), T, X(ch.band[1]) - X(ch.band[0]), B - T); x.fillStyle = '#2f8a3e'; x.textAlign = 'center'; x.fillText(ch.bandLabel || '', (X(ch.band[0]) + X(ch.band[1])) / 2, T + 14); }
    x.strokeStyle = ch.color || '#2f6ab0'; x.lineWidth = 2; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(X(p[0]), Y(p[1])) : x.moveTo(X(p[0]), Y(p[1]))); x.stroke(); x.lineWidth = 1;
    x.fillStyle = '#333'; x.textAlign = 'center';
    (ch.xticks || [x0, x1]).forEach(t => x.fillText(ch.xfmt ? ch.xfmt(t) : t, X(t), B + 16));
    x.textAlign = 'right'; (ch.yticks || [y0, y1]).forEach(t => x.fillText(ch.yfmt ? ch.yfmt(t) : t, L - 6, Y(t) + 4));
    (ch.markers || []).forEach(mk => { x.strokeStyle = '#c0392b'; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(X(mk.x), T); x.lineTo(X(mk.x), B); x.stroke(); x.setLineDash([]); x.fillStyle = '#c0392b'; x.textAlign = 'center'; wrapText(x, mk.label, X(mk.x), T + 12 + (mk.dy || 0), 120, 13); });
    if (ch.xlabel) { x.fillStyle = '#555'; x.textAlign = 'center'; x.fillText(ch.xlabel, (L + R) / 2, H - 8); }
    if (ch.ylabel) { x.save(); x.translate(14, (T + B) / 2); x.rotate(-Math.PI / 2); x.fillStyle = '#555'; x.textAlign = 'center'; x.fillText(ch.ylabel, 0, 0); x.restore(); }
  } else if (ch.type === 'donut') {
    const tot = ch.values.reduce((a, b) => a + b, 0); let a = -Math.PI / 2; const cx = 170, cy = (T + B) / 2 + 6, r = Math.min(110, (B - T) / 2 + 10);
    ch.values.forEach((v, i) => { const da = v / tot * Math.PI * 2; x.fillStyle = pal[i % pal.length]; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, r, a, a + da); x.fill(); a += da; });
    x.fillStyle = '#f7f1e3'; x.beginPath(); x.arc(cx, cy, r * 0.55, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#222'; x.textAlign = 'center'; x.font = 'bold 14px system-ui'; x.fillText(ch.center || '', cx, cy + 5); x.font = '12px system-ui';
    ch.labels.forEach((l, i) => { x.fillStyle = pal[i % pal.length]; x.fillRect(330, T + 10 + i * 24, 14, 14); x.fillStyle = '#222'; x.textAlign = 'left'; x.fillText(`${l} — ${fmtNum(ch.values[i])}${ch.unit || ''}`, 350, T + 22 + i * 24); });
  } else if (ch.type === 'grid') { // tableau périodique simplifié / matrice
    const cols = ch.cols || 18, cells = ch.cells; const cw = (R - 20) / cols, chh = 26;
    cells.forEach((c, i) => { const cx = 20 + (c.c ?? i % cols) * cw, cy = T + (c.r ?? Math.floor(i / cols)) * chh; x.fillStyle = c.col || '#ddd'; x.fillRect(cx + 1, cy + 1, cw - 2, chh - 2); x.fillStyle = '#111'; x.textAlign = 'center'; x.font = 'bold 11px system-ui'; x.fillText(c.s, cx + cw / 2, cy + 17); });
    x.font = '11px system-ui'; (ch.legend || []).forEach((l, i) => { x.fillStyle = l.col; x.fillRect(20 + i * 170, B + 8, 12, 12); x.fillStyle = '#222'; x.textAlign = 'left'; x.fillText(l.t, 36 + i * 170, B + 18); });
  }
  if (ch.note) { x.fillStyle = '#6a5a4a'; x.font = 'italic 11px system-ui'; x.textAlign = 'right'; x.fillText(ch.note, W - 12, 24); }
}
function fmtNum(v) { return typeof v === 'number' ? v.toLocaleString('fr-FR') : v; }
function wrapText(x, s, cx, y, w, lh) { const words = String(s).split(' '); let line = ''; let yy = y; for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (x.measureText(t).width > w && line) { x.fillText(line, cx, yy); line = wd; yy += lh; } else line = t; } x.fillText(line, cx, yy); }

// ---------------------------------------------------------------- Borne d'arcade : Eco-Slash
export function arcadeEcoSlash(game) {
  return new Promise(resolve => {
    const m = modal(`<div class="arcade"><div class="arc-hud"><span>Score : <b class="sc">0</b> / 20</span><span class="best"></span></div>
      <canvas width="560" height="320" class="arc-cv" tabindex="0"></canvas>
      <p class="muted">Tranche les <b style="color:#2f8a3e">bonnes pratiques</b>, évite les <b style="color:#c0392b">pièges</b>. Souris / doigt : glisse pour trancher. Clavier : flèches pour viser, Espace pour trancher.</p>
      <div class="row end"><button class="btn arc-start">▶ Commencer</button></div></div>`, { title: 'Eco-Slash', icon: '🕹', wide: true });
    const cv = m.body.querySelector('canvas'), x = cv.getContext('2d');
    const good = CONTENT.ECO_SLASH.good, bad = CONTENT.ECO_SLASH.bad;
    let objs = [], score = 0, state = 'idle', trail = [], down = false, cur = { x: 280, y: 160 }, raf, spawnT = 0, lastT = 0, best = 0, tries = 0;
    const tr = game.state.tracker.puzzles.eco_slash || (game.state.tracker.puzzles.eco_slash = { title: 'Eco-Slash (arcade)', region: 'forge', kind: 'arcade', main: false, attempts: 0, hints: 0, success: false, abandoned: 0, timeMs: 0, firstTry: null, opens: 0 });
    tr.opens++;
    const t0 = performance.now();
    const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    cv.addEventListener('pointerdown', e => { down = true; trail = [pos(e)]; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointerup', () => { down = false; trail = []; });
    cv.addEventListener('pointermove', e => { if (!down || state !== 'play') return; const p = pos(e); trail.push(p); if (trail.length > 10) trail.shift(); slice(p); });
    const keys = new Set();
    const kd = e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) { e.preventDefault(); keys.add(e.code); if (e.code === 'Space' && state === 'play') { slice(cur); trail = [{ x: cur.x - 20, y: cur.y - 20 }, { x: cur.x + 20, y: cur.y + 20 }]; setTimeout(() => trail = [], 120); } } };
    const ku = e => keys.delete(e.code);
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    function slice(p) {
      for (const o of objs) if (o.alive && Math.hypot(o.x - p.x, o.y - p.y) < 34) {
        o.alive = false;
        if (o.bad) { audio.sfx('explode'); state = 'over'; tries++; game.trackQcm('ecoslash_' + o.t, false, o.t, tries, 'eco_slash', 'Eco-Slash : « ' + o.t + ' » est-elle une bonne pratique ?', { kind: 'side', region: 'forge' }); }
        else { score++; audio.sfx('coin'); m.body.querySelector('.sc').textContent = score; if (score >= 20) { state = 'win'; } }
      }
    }
    function spawn() { const isBad = Math.random() < 0.3; const pool = isBad ? bad : good; const it = pool[Math.floor(Math.random() * pool.length)]; objs.push({ x: 60 + Math.random() * 440, y: 340, vx: (Math.random() - 0.5) * 120, vy: -(300 + Math.random() * 110), t: it, bad: isBad, alive: true, rot: 0 }); }
    function loop(ts) {
      const dt = Math.min(0.05, (ts - (lastT || ts)) / 1000); lastT = ts;
      if (keys.has('ArrowLeft')) cur.x -= 320 * dt; if (keys.has('ArrowRight')) cur.x += 320 * dt; if (keys.has('ArrowUp')) cur.y -= 320 * dt; if (keys.has('ArrowDown')) cur.y += 320 * dt;
      cur.x = clamp(cur.x, 0, 560); cur.y = clamp(cur.y, 0, 320);
      if (state === 'play') { spawnT -= dt; if (spawnT <= 0) { spawn(); spawnT = Math.max(0.55, 1.3 - score * 0.03); } }
      for (const o of objs) { o.vy += 300 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rot += dt; }
      objs = objs.filter(o => o.y < 380 && (o.alive || false));
      x.fillStyle = '#0d1a12'; x.fillRect(0, 0, 560, 320);
      for (let i = 0; i < 30; i++) { x.fillStyle = 'rgba(80,200,120,0.05)'; x.fillRect((i * 37 + ts / 30) % 560, (i * 53) % 320, 2, 2); }
      for (const o of objs) {
        x.save(); x.translate(o.x, o.y);
        x.fillStyle = o.bad ? 'rgba(192,57,43,0.9)' : 'rgba(47,138,62,0.9)'; x.beginPath(); x.arc(0, 0, 32, 0, Math.PI * 2); x.fill();
        x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();
        x.fillStyle = '#fff'; x.font = 'bold 10px system-ui'; x.textAlign = 'center';
        const w = o.t.split(' '); const l1 = w.slice(0, Math.ceil(w.length / 2)).join(' '), l2 = w.slice(Math.ceil(w.length / 2)).join(' ');
        x.fillText(l1, 0, l2 ? -2 : 4); if (l2) x.fillText(l2, 0, 11);
        x.restore();
      }
      if (trail.length > 1) { x.strokeStyle = '#9aff7a'; x.lineWidth = 3; x.beginPath(); trail.forEach((p, i) => i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y)); x.stroke(); }
      if (input.lastDevice !== 'touch') { x.strokeStyle = 'rgba(255,255,255,0.6)'; x.lineWidth = 1; x.beginPath(); x.arc(cur.x, cur.y, 10, 0, Math.PI * 2); x.stroke(); }
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = 'bold 22px system-ui';
      if (state === 'idle') x.fillText('Prêt·e ?', 280, 160);
      if (state === 'over') { x.fillText('Piège tranché ! Système compromis.', 280, 150); x.font = '14px system-ui'; x.fillText('Score remis à zéro — relance la partie.', 280, 180); }
      if (state === 'win') { x.fillStyle = '#9aff7a'; x.fillText('MISSION ACCOMPLIE !', 280, 160); }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    const btn = m.body.querySelector('.arc-start');
    btn.addEventListener('click', () => { if (state === 'win') { m.close(true); return; } score = 0; objs = []; state = 'play'; tr.attempts++; m.body.querySelector('.sc').textContent = '0'; btn.textContent = '↺ Recommencer'; cv.focus(); });
    const watch = setInterval(() => { if (state === 'win' && btn.textContent !== 'Terminer ✔') { btn.textContent = 'Terminer ✔'; audio.sfx('quest'); } }, 200);
    m.done.then(async () => {
      cancelAnimationFrame(raf); clearInterval(watch); removeEventListener('keydown', kd); removeEventListener('keyup', ku);
      tr.timeMs += performance.now() - t0;
      if (state === 'win' && !tr.success) { tr.success = true; tr.firstTry = tr.attempts <= 1; if (CONTENT.ON_EVENT.ecoslash) await game.runActions(CONTENT.ON_EVENT.ecoslash, {}); }
      game.save(); resolve(state === 'win');
    });
  });
}
