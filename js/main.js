// =============================================================
// main.js — démarrage, écran-titre, création de personnage, fin du jeu
// =============================================================
import { Game, VW, VH } from './core/game.js';
import { input } from './core/input.js';
import { audio } from './core/audio.js';
import { initUI, modal, toast, confirmBox, setSettings, dialogue, alertBox } from './core/ui.js';
import { openMenu, tabOptions, drawChart, arcadeEcoSlash, reports, bindReports } from './core/panels.js';
import { newState, loadState, saveState, clearState, loadSettings, saveSettings, listReports, storeReport } from './core/state.js';
import { buildReport, reportPdf, downloadBlob, reportFileName } from './core/report.js';
import { esc, md, sleep, fmtDuration } from './core/util.js';
import { creature, humanoid, playerSprite, icon, prop } from './core/gfx.js';
import { CONFIG } from './content/config.js';
import { CONTENT } from './content/index.js';

const app = {
  settings: loadSettings(),
  game: null,
  teacherPending: false,
};

const cv = document.getElementById('game');
const uiRoot = document.getElementById('ui');

function fit() {
  const s = Math.max(1, Math.min(Math.floor(innerWidth / VW), Math.floor(innerHeight / VH)) || 1);
  const scale = Math.min(innerWidth / VW, innerHeight / VH);
  const use = scale >= 2 ? Math.floor(scale) : scale; // pixels nets si possible
  cv.style.width = Math.floor(VW * use) + 'px'; cv.style.height = Math.floor(VH * use) + 'px';
}
addEventListener('resize', fit); fit();

app.applySettings = st => {
  audio.setVolumes({ master: st.master, music: st.music, sfx: st.sfx });
  document.documentElement.style.setProperty('--fs', st.textSize);
  document.body.classList.toggle('contrast', !!st.colorblind);
  document.body.classList.toggle('reduce-motion', !!st.reduceMotion);
  setSettings(st);
};
initUI(uiRoot, app.settings);
input.setupTouch(document.body);
app.applySettings(app.settings);

// ---------------------------------------------------------------- Boucle
let last = performance.now();
function loop(t) {
  const dt = (t - last) / 1000; last = t;
  if (app.game) app.game.frame(dt);
  else drawTitleBg(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Fond animé de l'écran-titre (arbre qui respire + braises)
let tt = 0; const embers = [];
function drawTitleBg(dt) {
  tt += dt;
  const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
  const g = x.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#2a0f08'); g.addColorStop(0.6, '#5a2010'); g.addColorStop(1, '#1a0a06');
  x.fillStyle = g; x.fillRect(0, 0, VW, VH);
  // sol
  x.fillStyle = '#2a1e1a'; x.fillRect(0, VH - 40, VW, 40);
  for (let i = 0; i < VW; i += 8) { x.fillStyle = i % 16 ? '#3a2a24' : '#33241f'; x.fillRect(i, VH - 40 + ((i * 7) % 5), 8, 3); }
  // arbre-mère : stade qui pulse entre 0 et 2
  const st = Math.floor((Math.sin(tt * 0.6) + 1) * 1.2);
  x.drawImage(prop('tree', 1, st), VW / 2 - 32, VH - 40 - 76);
  if (Math.random() < dt * 20) embers.push({ x: Math.random() * VW, y: VH, vy: -10 - Math.random() * 20, l: 6 });
  for (const e of embers) { e.y += e.vy * dt; e.l -= dt; e.x += Math.sin(e.y * 0.05) * 0.3; x.fillStyle = e.l > 3 ? '#ff7a2a' : '#8a6a5a'; x.fillRect(e.x, e.y, 1, 1); }
  while (embers.length && embers[0].l <= 0) embers.shift();
}

// ---------------------------------------------------------------- Écran-titre
function showTitle() {
  document.body.classList.add('on-title');
  const saved = loadState();
  const reps = listReports();
  const t = document.createElement('div'); t.className = 'title-screen'; t.id = 'title';
  t.innerHTML = `
    <div class="logo">VERDANCE</div>
    <div class="subtitle">Un monde à reverdir · ${esc(CONFIG.courseName)}</div>
    <div class="tbtns">
      ${saved ? `<button class="btn big t-continue">▶ Continuer <small>${esc(saved.identity.prenom || '')} — ${fmtDuration(saved.tracker.totalTime)} · ${Object.keys(saved.seeds).length}/8 graines</small></button>` : ''}
      <button class="btn big ${saved ? 'ghost' : ''} t-new">✦ Nouvelle partie</button>
      <button class="btn ghost t-reports">📄 Mes bilans ${reps.length ? `(${reps.length})` : ''}</button>
      <button class="btn ghost t-options">⚙ Options</button>
      <button class="btn ghost t-about">ℹ À propos</button>
    </div>
    <div class="tfoot">Clavier, manette ou écran tactile · Sauvegarde automatique dans ce navigateur</div>`;
  uiRoot.prepend(t);
  const unlock = () => audio.init();
  t.addEventListener('pointerdown', unlock, { once: true }); addEventListener('keydown', unlock, { once: true });
  const c = t.querySelector('.t-continue'); if (c) c.addEventListener('click', () => { audio.init(); t.remove(); startGame(saved, false); });
  t.querySelector('.t-new').addEventListener('click', async () => {
    audio.init();
    if (saved && !(await confirmBox('Une partie existe déjà dans ce navigateur. **La remplacer** par une nouvelle partie ? (Pense à générer ton bilan avant.)', 'Nouvelle partie', 'Annuler'))) return;
    const id = await identityForm(); if (!id) return;
    clearState(); t.remove();
    const S = newState(id);
    await intro();
    startGame(S, true);
  });
  t.querySelector('.t-reports').addEventListener('click', () => {
    const m = modal(`<p>Les bilans générés sur ce navigateur. Télécharge le PDF et envoie-le à ton enseignant·e.</p><div class="reports">${reports(listReports())}</div>
      ${saved ? '<div class="row"><button class="btn gen-now">📄 Générer un bilan maintenant (partie en cours)</button></div>' : ''}`, { title: 'Mes bilans', icon: '📄', wide: true });
    const refresh = () => { m.body.querySelector('.reports').innerHTML = reports(listReports()); bindReports(m.body, refresh); };
    bindReports(m.body, refresh);
    const gn = m.body.querySelector('.gen-now'); if (gn) gn.addEventListener('click', () => { const r = buildReport(saved, null); storeReport(r); downloadBlob(reportPdf(r), reportFileName(r, 'pdf'), 'application/pdf'); refresh(); });
  });
  t.querySelector('.t-options').addEventListener('click', () => { const m = modal('<div class="tb"></div>', { title: 'Options', icon: '⚙', wide: true }); tabOptions(null, m.body.querySelector('.tb'), m, app); });
  t.querySelector('.t-about').addEventListener('click', () => alertBox('À propos de Verdance', md(CONTENT.ABOUT)));
  audio.play('title', 0);
}

app.toTitle = () => { if (app.game) { app.game.running = false; app.game = null; } document.querySelectorAll('.modal-wrap').forEach(m => m.remove()); audio.stopMusic(); showTitle(); };

function identityForm() {
  const m = modal(`
    <p>Ces informations apparaissent uniquement sur ton bilan (rien n’est envoyé sur Internet).</p>
    <div class="inputs">
      <label class="ifield"><span>Prénom</span><input type="text" class="f-prenom" maxlength="40" autocomplete="given-name" autofocus></label>
      <label class="ifield"><span>Nom</span><input type="text" class="f-nom" maxlength="40" autocomplete="family-name"></label>
      <label class="ifield"><span>Classe / groupe</span><input type="text" class="f-groupe" maxlength="40" placeholder="ex. M2 Groupe B"></label>
    </div>
    <div class="row"><label>Difficulté <select class="f-diff"><option value="exploration">Exploration (pas de dégâts)</option><option value="normal" selected>Normale</option><option value="heroique">Héroïque</option></select></label></div>
    <div class="err"></div>
    <div class="row end"><button class="btn ghost f-cancel">Annuler</button><button class="btn f-ok">Commencer l’aventure ➜</button></div>`, { title: 'Qui es-tu, Gardien·ne ?', icon: '🌱' });
  m.body.querySelector('.f-cancel').addEventListener('click', () => m.close(null));
  const ok = () => {
    const prenom = m.body.querySelector('.f-prenom').value.trim(), nom = m.body.querySelector('.f-nom').value.trim(), groupe = m.body.querySelector('.f-groupe').value.trim();
    if (!prenom || !nom) { m.body.querySelector('.err').textContent = 'Indique au moins ton prénom et ton nom.'; return; }
    app.settings.difficulty = m.body.querySelector('.f-diff').value; saveSettings(app.settings);
    m.close({ prenom, nom, groupe });
  };
  m.body.querySelector('.f-ok').addEventListener('click', ok);
  m.body.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); }));
  return m.done;
}

async function intro() {
  audio.play('title', 0);
  const pages = CONTENT.INTRO;
  const m = modal(`<div class="intro"><div class="intro-text"></div><div class="row end"><button class="btn ghost i-skip">Passer</button><button class="btn i-next">Suite ➜</button></div></div>`, { title: '', cls: 'intro-modal', closable: false });
  const el = m.body.querySelector('.intro-text'); let i = 0;
  const show = () => { el.classList.remove('in'); void el.offsetWidth; el.innerHTML = md(pages[i]); el.classList.add('in'); };
  show();
  m.body.querySelector('.i-next').addEventListener('click', () => { i++; if (i >= pages.length) m.close(); else { audio.sfx('blip'); show(); } });
  m.body.querySelector('.i-skip').addEventListener('click', () => m.close());
  await m.done;
}

function startGame(S, isNew) {
  document.body.classList.remove('on-title');
  const g = new Game(cv, app.settings, {
    openMenu: tab => openMenu(g, tab, app),
    arcade: game => arcadeEcoSlash(game),
    drawChart,
    ending: game => ending(game),
  });
  app.game = g; window.__verdance = { game: g, app };
  if (app.teacherPending) { g.teacher = { god: true, fast: false }; S.flags.teacher_used = true; }
  S.tracker.sessions = (S.tracker.sessions || 0) + (isNew ? 0 : 1);
  g.start(S);
  saveState(S);
  if (isNew) setTimeout(() => g.runScript('intro_reveil', {}), 600);
}

// ---------------------------------------------------------------- Fin
async function ending(g) {
  const S = g.state; S.ended = true; g.save();
  if (globalThis.__AUTO) return;
  audio.play('ending', 1);
  const T = S.tracker;
  const m = modal(`<div class="ending">
    <div class="end-title">Verdance est reverdie</div>
    <div class="prose">${md(CONTENT.EPILOGUE)}</div>
    <div class="end-stats">
      <div><b>${fmtDuration(T.totalTime)}</b><small>de jeu</small></div>
      <div><b>${T.combat.kills}</b><small>créatures dissipées</small></div>
      <div><b>${T.combat.parryOk}</b><small>idées reçues parées</small></div>
      <div><b>${Object.keys(S.codex).length}</b><small>fragments de Codex</small></div>
      <div><b>${Object.keys(T.secrets).length}</b><small>secrets</small></div>
    </div>
    <p><b>Dernière étape : génère ton bilan et envoie-le à ton enseignant·e.</b></p>
    <div class="row center"><button class="btn big e-pdf">📄 Générer mon bilan (PDF)</button><button class="btn ghost e-cont">Continuer à explorer</button></div></div>`, { title: 'Fin', icon: '🌳', wide: true, closable: false });
  m.body.querySelector('.e-pdf').addEventListener('click', () => { const r = buildReport(S, g); storeReport(r); downloadBlob(reportPdf(r), reportFileName(r, 'pdf'), 'application/pdf'); toast('📄 Bilan téléchargé et enregistré dans « Mes bilans ».', 'good', 6000); m.body.querySelector('.e-cont').textContent = 'Continuer à explorer ➜'; });
  m.body.querySelector('.e-cont').addEventListener('click', () => m.close());
  await m.done;
}

// ---------------------------------------------------------------- Lancement
if (new URLSearchParams(location.search).has('prof')) {
  setTimeout(async () => {
    const m = modal('<div class="row"><input type="password" class="tc" placeholder="Code enseignant" autofocus><button class="btn ok">Valider</button></div>', { title: 'Mode enseignant', icon: '🧑‍🏫', cls: 'small' });
    const go = () => { if (m.body.querySelector('.tc').value === CONFIG.teacherCode) { app.teacherPending = true; toast('🧑‍🏫 Mode enseignant activé pour la partie.', 'good'); m.close(); } else toast('Code incorrect.', 'bad'); };
    m.body.querySelector('.ok').addEventListener('click', go); m.body.querySelector('.tc').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  }, 300);
}
showTitle();
// Sauvegarde à la fermeture
addEventListener('visibilitychange', () => { if (document.hidden && app.game) app.game.save(); });
addEventListener('beforeunload', () => { if (app.game) app.game.save(); });
