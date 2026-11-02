// =============================================================
// ui.js — couches d'interface DOM : dialogues, fenêtres, notifications
// Le texte est rendu en HTML (lisible, redimensionnable), le jeu en canvas.
// =============================================================
import { esc, md, sleep } from './util.js';
import { audio } from './audio.js';
import { input } from './input.js';

let root, dlg, toasts, banner, modalLayer;
let settingsRef = { textSpeed: 1 };
export const uiState = { open: 0 };

export function initUI(el, settings) {
  root = el; settingsRef = settings;
  root.innerHTML = `
    <div id="banner" class="banner" aria-live="polite"></div>
    <div id="toasts" class="toasts" aria-live="polite"></div>
    <div id="dialog" class="dialog hidden" role="dialog" aria-live="polite">
      <canvas class="portrait" width="16" height="16"></canvas>
      <div class="dbody"><div class="dname"></div><div class="dtext"></div><div class="dchoices"></div></div>
      <div class="dnext">▼</div>
    </div>
    <div id="modals"></div>`;
  dlg = root.querySelector('#dialog'); toasts = root.querySelector('#toasts'); banner = root.querySelector('#banner'); modalLayer = root.querySelector('#modals');
}
export function setSettings(s) { settingsRef = s; }

// ---------------------------------------------------------------- Notifications
export function toast(html, kind = 'info', ms = 3200) {
  const t = document.createElement('div'); t.className = 'toast ' + kind; t.innerHTML = html;
  toasts.appendChild(t);
  while (toasts.children.length > 4) toasts.firstChild.remove();
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, ms);
}
export function showBanner(title, sub = '') {
  banner.innerHTML = `<div class="btitle">${esc(title)}</div>${sub ? `<div class="bsub">${esc(sub)}</div>` : ''}`;
  banner.classList.remove('show'); void banner.offsetWidth; banner.classList.add('show');
}

// ---------------------------------------------------------------- Dialogue
/**
 * Affiche une suite de bulles. lines = [{ who, t, portrait }]. choices optionnels à la fin.
 * Retourne { choice, stats: [{ chars, ms }] }.
 */
export async function dialogue(lines, choices = null) {
  if (globalThis.__AUTO) { globalThis.__AUTO.lines = (globalThis.__AUTO.lines || 0) + lines.length; return { choice: choices ? (globalThis.__AUTO.pick ? globalThis.__AUTO.pick(choices) : 0) : null, stats: lines.map(l => ({ chars: l.t.length, ms: 99999 })) }; }
  uiState.open++;
  dlg.classList.remove('hidden');
  const nameEl = dlg.querySelector('.dname'), textEl = dlg.querySelector('.dtext'), chEl = dlg.querySelector('.dchoices'), pc = dlg.querySelector('.portrait');
  const pctx = pc.getContext('2d'); pctx.imageSmoothingEnabled = false;
  const stats = [];
  let choice = null;
  try {
    for (let i = 0; i < lines.length; i++) {
      const L = lines[i];
      nameEl.textContent = L.who || '';
      pctx.clearRect(0, 0, 16, 16); if (L.portrait) { pc.style.visibility = 'visible'; pctx.drawImage(L.portrait, 0, 0, 16, 16); } else pc.style.visibility = 'hidden';
      chEl.innerHTML = '';
      const start = performance.now();
      await typewrite(textEl, L.t);
      const isLast = i === lines.length - 1;
      if (isLast && choices && choices.length) {
        choice = await askChoices(chEl, choices);
      } else {
        dlg.classList.add('wait');
        await waitAdvance();
        dlg.classList.remove('wait');
      }
      stats.push({ chars: L.t.length, ms: performance.now() - start });
    }
  } finally {
    dlg.classList.add('hidden'); chEl.innerHTML = '';
    uiState.open--;
    input.clear();
  }
  return { choice, stats };
}

async function typewrite(el, txt) {
  const html = md(txt);
  const speed = settingsRef.textSpeed || 1;
  if (speed >= 3) { el.innerHTML = html; return; }
  // On révèle progressivement le texte brut, puis on remplace par le HTML final
  const plain = txt.replace(/\*\*|\*/g, '');
  el.textContent = '';
  let skip = false;
  const onSkip = () => { skip = true; };
  const keyH = e => { if (['Space', 'Enter', 'KeyE', 'KeyK', 'KeyJ'].includes(e.code)) onSkip(); };
  addEventListener('keydown', keyH); dlg.addEventListener('pointerdown', onSkip);
  const step = Math.max(1, Math.round(speed));
  for (let i = 0; i < plain.length && !skip; i += step) {
    el.textContent = plain.slice(0, i + step);
    if (i % 3 === 0) audio.sfx('type');
    await sleep(18 / speed);
  }
  removeEventListener('keydown', keyH); dlg.removeEventListener('pointerdown', onSkip);
  el.innerHTML = html;
  await sleep(60);
}

function waitAdvance() {
  return new Promise(res => {
    const done = () => { cleanup(); audio.sfx('blip'); res(); };
    const keyH = e => { if (['Space', 'Enter', 'KeyE', 'KeyK', 'KeyJ', 'Escape'].includes(e.code)) { e.preventDefault(); done(); } };
    const padT = setInterval(() => { input.update(); if (input.pressed('attack') || input.pressed('interact')) done(); }, 50);
    const clickH = () => done();
    function cleanup() { removeEventListener('keydown', keyH); dlg.removeEventListener('click', clickH); clearInterval(padT); }
    setTimeout(() => { addEventListener('keydown', keyH); dlg.addEventListener('click', clickH); }, 120);
  });
}

function askChoices(el, choices) {
  return new Promise(res => {
    el.innerHTML = choices.map((c, i) => `<button class="choice" data-i="${i}">${md(c)}</button>`).join('');
    const btns = [...el.querySelectorAll('button')];
    let idx = 0; btns[0].focus();
    const pick = i => { cleanup(); audio.sfx('confirm'); res(i); };
    btns.forEach((b, i) => b.addEventListener('click', e => { e.stopPropagation(); pick(i); }));
    const keyH = e => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { idx = (idx + 1) % btns.length; btns[idx].focus(); audio.sfx('select'); e.preventDefault(); }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyZ') { idx = (idx - 1 + btns.length) % btns.length; btns[idx].focus(); audio.sfx('select'); e.preventDefault(); }
      if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyE') { e.preventDefault(); pick(btns.indexOf(document.activeElement) >= 0 ? btns.indexOf(document.activeElement) : idx); }
    };
    function cleanup() { removeEventListener('keydown', keyH); }
    setTimeout(() => addEventListener('keydown', keyH), 150);
  });
}

// ---------------------------------------------------------------- Fenêtres modales
/**
 * Ouvre une fenêtre. opts = { title, cls, closable, onClose, wide }
 * Retourne { el, body, close(result), done: Promise }.
 */
export function modal(html, opts = {}) {
  uiState.open++;
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap ' + (opts.cls || '');
  wrap.innerHTML = `<div class="modal ${opts.wide ? 'wide' : ''} ${opts.full ? 'full' : ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.title || '')}">
      ${opts.title ? `<div class="mhead"><div class="mtitle">${opts.icon ? opts.icon + ' ' : ''}${esc(opts.title)}</div>${opts.closable !== false ? '<button class="mclose" aria-label="Fermer">✕</button>' : ''}</div>` : ''}
      <div class="mbody">${html}</div></div>`;
  modalLayer.appendChild(wrap);
  const body = wrap.querySelector('.mbody');
  let resolve; const done = new Promise(r => resolve = r);
  let closed = false;
  const close = (result) => {
    if (closed) return; closed = true;
    removeEventListener('keydown', keyH);
    wrap.classList.add('out'); setTimeout(() => wrap.remove(), 180);
    uiState.open--; input.clear();
    if (opts.onClose) opts.onClose(result);
    resolve(result);
  };
  const keyH = e => {
    if (e.code === 'Escape' && opts.closable !== false) { e.preventDefault(); e.stopPropagation(); audio.sfx('back'); close(null); }
  };
  setTimeout(() => addEventListener('keydown', keyH), 100);
  const cb = wrap.querySelector('.mclose'); if (cb) cb.addEventListener('click', () => { audio.sfx('back'); close(null); });
  // focus premier élément interactif
  if (!opts.noFocus) setTimeout(() => { const f = body.querySelector('[autofocus], input, textarea, button, select, a'); if (f) f.focus({ preventScroll: true }); }, 60);
  return { el: wrap, body, close, done };
}

export async function confirmBox(text, yes = 'Oui', no = 'Annuler') {
  if (globalThis.__AUTO) return true;
  const m = modal(`<p>${md(text)}</p><div class="row end"><button class="btn ghost" data-r="0">${esc(no)}</button><button class="btn" data-r="1">${esc(yes)}</button></div>`, { title: 'Confirmation', cls: 'small' });
  m.body.querySelectorAll('button').forEach(b => b.addEventListener('click', () => m.close(b.dataset.r === '1')));
  return !!(await m.done);
}

export async function alertBox(title, html, btn = 'Continuer') {
  if (globalThis.__AUTO) return true;
  const m = modal(`<div class="prose">${html}</div><div class="row end"><button class="btn" autofocus>${esc(btn)}</button></div>`, { title, cls: 'small' });
  m.body.querySelector('.btn').addEventListener('click', () => m.close(true));
  return m.done;
}

/** Grand titre animé (obtention d'objet, reverdissement...). */
export function fanfare(iconCanvas, title, sub) {
  if (globalThis.__AUTO) return Promise.resolve();
  return new Promise(res => {
    uiState.open++;
    const w = document.createElement('div'); w.className = 'fanfare';
    w.innerHTML = `<div class="fan-in"><div class="fan-icon"></div><div class="fan-title">${esc(title)}</div><div class="fan-sub">${md(sub || '')}</div><div class="fan-hint">Appuie sur une touche</div></div>`;
    if (iconCanvas) { const c = document.createElement('canvas'); c.width = 16; c.height = 16; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(iconCanvas, 0, 0, 16, 16); w.querySelector('.fan-icon').appendChild(c); }
    modalLayer.appendChild(w);
    const end = () => { removeEventListener('keydown', k); w.removeEventListener('click', end); w.classList.add('out'); setTimeout(() => w.remove(), 300); uiState.open--; input.clear(); res(); };
    const k = e => { e.preventDefault(); end(); };
    setTimeout(() => { addEventListener('keydown', k); w.addEventListener('click', end); }, 900);
  });
}

export function isBlocking() { return uiState.open > 0; }
