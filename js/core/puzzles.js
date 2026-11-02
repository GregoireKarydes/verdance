// =============================================================
// puzzles.js — moteur générique d'énigmes / escape games / QCM
// Types : qcm, fill, order, match, input, sliders, budget, choice, lock
// Chaque énigme est décrite dans content/puzzles/*.js (données seules).
// =============================================================
import { esc, md, norm, shuffle } from './util.js';
import { modal } from './ui.js';
import { audio } from './audio.js';

/**
 * Ouvre une énigme. ctx = { teacher, onQcm(qid, ok, answer, attemptNo, setId) }
 * Résout { success, abandoned, attempts, hints, firstTry, timeMs, details }
 */
export function openPuzzle(def, ctx = {}) {
  if (globalThis.__AUTO) {
    if (def.type === 'qcm') def.questions.forEach((q, i) => ctx.onQcm && ctx.onQcm(q.id || `${def.id}_${i}`, true, q.options[q.a], 1, def.id, q.q));
    if (def.type === 'choice') def.nodes.forEach((n, i) => ctx.onQcm && ctx.onQcm(`${def.id}_n${i}`, true, 'auto', 1, def.id, n.text));
    globalThis.__AUTO.puzzles = (globalThis.__AUTO.puzzles || []).concat(def.id);
    const sol = globalThis.__AUTO.solve ? globalThis.__AUTO.solve(def) : true;
    return Promise.resolve({ success: sol, abandoned: !sol, attempts: 1, hints: 0, firstTry: sol, timeMs: 1000, details: {} });
  }
  const t0 = performance.now();
  let attempts = 0, hints = 0, details = {};
  const head = `
    ${def.intro ? `<div class="pz-intro prose">${md(def.intro)}</div>` : ''}
    <div class="pz-body"></div>
    <div class="pz-feedback" aria-live="polite"></div>
    <div class="pz-foot">
      ${def.hints && def.hints.length ? `<button class="btn ghost pz-hint">💡 Indice (${def.hints.length})</button>` : ''}
      <button class="btn ghost pz-giveup">Abandonner</button>
      ${ctx.teacher ? '<button class="btn ghost pz-teacher">🧑‍🏫 Résoudre</button>' : ''}
      <span class="grow"></span>
      <button class="btn pz-validate">Valider</button>
    </div>`;
  const m = modal(head, { title: def.title, icon: def.icon || '🧩', wide: true, cls: 'puzzle', closable: true });
  const body = m.body.querySelector('.pz-body'), fb = m.body.querySelector('.pz-feedback');
  const validateBtn = m.body.querySelector('.pz-validate');
  const say = (html, kind = '') => { fb.className = 'pz-feedback ' + kind; fb.innerHTML = html; };
  let finished = false;
  const finish = (success, extra = {}) => {
    if (finished) return; finished = true;
    const res = { success, abandoned: !success, attempts, hints, firstTry: success && attempts <= 1 && hints === 0, timeMs: performance.now() - t0, details, ...extra };
    if (success) {
      audio.sfx('right');
      const ex = def.explain ? `<div class="prose">${md(def.explain)}</div>` : '';
      body.innerHTML = `<div class="pz-win"><div class="pz-win-t">✔ ${esc(def.winText || 'Réussi !')}</div>${ex}</div>`;
      m.body.querySelector('.pz-foot').innerHTML = '<span class="grow"></span><button class="btn pz-cont" autofocus>Continuer ➜</button>';
      say('');
      const b = m.body.querySelector('.pz-cont'); b.focus();
      b.addEventListener('click', () => m.close(res));
    } else m.close(res);
  };
  // Indices
  const hb = m.body.querySelector('.pz-hint');
  if (hb) hb.addEventListener('click', () => {
    if (hints >= def.hints.length) return;
    say('💡 ' + md(def.hints[hints]), 'hint'); hints++; audio.sfx('select');
    hb.textContent = hints >= def.hints.length ? '💡 Plus d’indice' : `💡 Indice (${def.hints.length - hints})`;
  });
  m.body.querySelector('.pz-giveup').addEventListener('click', () => { audio.sfx('back'); finish(false); });
  const tb = m.body.querySelector('.pz-teacher');
  // Construction selon le type
  const R = RENDERERS[def.type];
  if (!R) { body.innerHTML = `<p>Type d'énigme inconnu : ${esc(def.type)}</p>`; }
  const api = R ? R(def, body, { say, ctx, details, attemptNo: () => attempts }) : null;
  validateBtn.addEventListener('click', () => {
    if (!api) return;
    attempts++;
    const r = api.check();
    if (r === null) { attempts--; return; } // rien à valider
    if (r.ok) finish(true);
    else {
      audio.sfx('wrong'); say('✗ ' + md(r.msg || 'Pas tout à fait… Réessaie !'), 'bad'); if (r.partial) say('✗ ' + md(r.msg), 'bad');
      // Mode apprentissage : après 2 essais ratés, un indice est offert (sans pénalité)
      const free = easyMode() && def.hints && def.hints.length ? Math.min(def.hints.length, attempts - 1) : 0;
      if (free > 0 && attempts >= 2) fb.insertAdjacentHTML('beforeend', `<div class="hint-free">💡 <b>Coup de pouce :</b> ${md(def.hints[Math.min(free, def.hints.length) - 1])}</div>`);
    }
  });
  if (tb) tb.addEventListener('click', () => { details.teacherSolved = true; finish(true); });
  // Le bouton « Valider » peut être masqué par certains types (qcm : validation par question)
  if (api && api.noValidate) validateBtn.style.display = 'none';
  if (api) api.onFinish = finish;
  return m.done.then(r => r || { success: false, abandoned: true, attempts, hints, firstTry: false, timeMs: performance.now() - t0, details });
}

// ---------------------------------------------------------------- Rendus par type
const easyMode = () => { const g = globalThis.__verdance && globalThis.__verdance.game; return !!(g && g.easy && g.easy()); };

const RENDERERS = {

  /**
   * Fresque (glisser-déposer) : 1) classer les cartes dans les colonnes de la chaîne
   * causes → conséquences ; 2) remettre une chaîne personnelle dans l'ordre ;
   * 3) prise de conscience + réflexion libre. Souris, tactile et clavier (clic carte puis clic zone).
   */
  fresque(def, body, h) {
    const api = { noValidate: true, check: () => null };
    let sel = null, phase = 1, errs1 = 0, errs2 = 0, try1 = 0, try2 = 0;
    const place = {};       // carte -> colonne (phase 1)
    const slots = [];       // phase 2 : index d'item par case
    const order = shuffle(def.cards.map((c, k) => k));
    const chainOrder = shuffle(def.chain.items.map((t, k) => k));
    // --- glisser-déposer générique (pointeur)
    const dnd = (root, onDrop) => {
      root.querySelectorAll('[data-card]').forEach(el => {
        el.addEventListener('pointerdown', e => {
          if (e.button !== undefined && e.button !== 0) return;
          const startX = e.clientX, startY = e.clientY; let ghost = null, moved = false;
          const mv = ev => {
            if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
            if (!moved) { moved = true; ghost = el.cloneNode(true); ghost.classList.add('fghost'); document.body.appendChild(ghost); el.classList.add('dragging'); }
            ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
            root.querySelectorAll('.fzone').forEach(z => z.classList.remove('over'));
            const under = document.elementFromPoint(ev.clientX, ev.clientY); const z = under && under.closest('.fzone'); if (z && root.contains(z)) z.classList.add('over');
          };
          const up = ev => {
            removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
            el.classList.remove('dragging'); if (ghost) ghost.remove();
            root.querySelectorAll('.fzone').forEach(z => z.classList.remove('over'));
            if (!moved) { sel = sel === el.dataset.card ? null : el.dataset.card; audio.sfx('select'); render(); return; }
            const under = document.elementFromPoint(ev.clientX, ev.clientY); const z = under && under.closest('.fzone');
            if (z && root.contains(z)) { onDrop(el.dataset.card, z.dataset.zone); audio.sfx('blip'); }
            render();
          };
          addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
        });
      });
      root.querySelectorAll('.fzone').forEach(z => z.addEventListener('click', e => { if (e.target.closest('[data-card]')) return; if (sel !== null) { onDrop(sel, z.dataset.zone); sel = null; audio.sfx('blip'); render(); } }));
    };
    const card = (k, cls = '') => { const c = def.cards[k]; return `<button class="fcard ${cls} ${sel === String(k) ? 'sel' : ''}" data-card="${k}"><span class="fi">${c.i || ''}</span>${esc(c.t)}</button>`; };
    const render = () => {
      if (phase === 1) {
        const pool = order.filter(k => place[k] === undefined);
        body.innerHTML = `<div class="fres-step">Étape 1 / 3 · Relie les causes aux conséquences</div>
          <div class="fboard">${def.columns.map((col, ci) => `<div class="fcol fzone" data-zone="${ci}"><div class="fcol-h"><b>${esc(col.t)}</b><small>${esc(col.d)}</small></div>
            ${order.filter(k => place[k] === ci).map(k => card(k, h.details.bad && h.details.bad.includes(k) ? 'bad' : '')).join('')}</div>${ci < def.columns.length - 1 ? '<div class="farrow">➜</div>' : ''}`).join('')}</div>
          <div class="fpool fzone" data-zone="pool">${pool.map(k => card(k)).join('') || '<span class="muted small">Toutes les cartes sont posées. Vérifie !</span>'}</div>
          <div class="row end"><span class="muted small grow">${pool.length} carte(s) à placer</span><button class="btn fcheck" ${pool.length ? 'disabled' : ''}>Vérifier la fresque</button></div>`;
        dnd(body, (k, z) => { if (z === 'pool') delete place[k]; else place[k] = +z; h.details.bad = (h.details.bad || []).filter(x => String(x) !== String(k)); });
        const b = body.querySelector('.fcheck');
        b.addEventListener('click', () => {
          try1++;
          const bad = Object.keys(place).map(Number).filter(k => def.cards[k].c !== place[k]);
          if (bad.length) {
            errs1++; h.details.bad = bad; audio.sfx('wrong');
            h.say(`✗ <b>${def.cards.length - bad.length} / ${def.cards.length}</b> cartes bien placées. Les cartes en rouge sont dans la mauvaise colonne : déplace-les.` + (try1 >= 2 && def.hints ? `<div class="hint-free">💡 ${md(def.hints[Math.min(try1 - 2, def.hints.length - 1)])}</div>` : ''), 'bad');
            render(); return;
          }
          h.ctx.onQcm && h.ctx.onQcm(def.id + '_fresque', errs1 === 0, `${try1} essai(s)`, try1, def.id, 'Fresque : relier les causes aux conséquences');
          audio.sfx('right'); h.details.bad = []; phase = 2;
          h.say('✔ <b>La fresque est reconstituée !</b> Clique une carte pour relire son explication.', 'good');
          renderFull();
        });
      } else if (phase === 2) {
        const pool = chainOrder.filter(k => !slots.includes(k));
        const items = def.chain.items;
        body.innerHTML = `<div class="fres-step">Étape 2 / 3 · ${esc(def.chain.title)}</div>
          <div class="ord-label">${md(def.chain.label)}</div>
          <div class="fchain">${items.map((_, i) => `<div class="fslot fzone ${h.details.bad2 && h.details.bad2.includes(i) ? 'bad' : ''}" data-zone="${i}"><span class="fnum">${i + 1}</span>${slots[i] !== undefined ? `<button class="fcard" data-card="c${slots[i]}">${esc(items[slots[i]])}</button>` : '<span class="muted small">dépose ici</span>'}</div>${i < items.length - 1 ? '<div class="farrow">⬇</div>' : ''}`).join('')}</div>
          <div class="fpool fzone" data-zone="pool">${pool.map(k => `<button class="fcard ${sel === 'c' + k ? 'sel' : ''}" data-card="c${k}">${esc(items[k])}</button>`).join('')}</div>
          <div class="row end"><button class="btn fcheck" ${pool.length ? 'disabled' : ''}>Vérifier la chaîne</button></div>`;
        dnd(body, (ck, z) => {
          const k = +String(ck).slice(1); const cur = slots.indexOf(k); if (cur >= 0) slots[cur] = undefined;
          if (z !== 'pool') { const prev = slots[+z]; slots[+z] = k; if (prev !== undefined && cur >= 0) slots[cur] = prev; }
          h.details.bad2 = [];
        });
        body.querySelector('.fcheck').addEventListener('click', () => {
          try2++;
          const bad = items.map((_, i) => i).filter(i => slots[i] !== i);
          if (bad.length) { errs2++; h.details.bad2 = bad; audio.sfx('wrong'); h.say(`✗ ${items.length - bad.length} / ${items.length} maillons à la bonne place. Pense « cause → conséquence » : qu’est-ce qui arrive en premier ?`, 'bad'); render(); return; }
          h.ctx.onQcm && h.ctx.onQcm(def.id + '_chaine', errs2 === 0, `${try2} essai(s)`, try2, def.id, 'Fresque : ordonner la chaîne du smartphone');
          audio.sfx('right'); phase = 3; h.say(''); renderFull();
        });
      } else {
        body.innerHTML = `<div class="fres-step">Étape 3 / 3 · Prendre conscience</div>
          <div class="faware">${def.awareness.map((a, i) => `<div class="faw" style="animation-delay:${i * 0.35}s">${md(a)}</div>`).join('')}</div>
          <label class="ifield"><span><b>Et toi ?</b> ${esc(def.reflect)}</span><textarea class="frefl" rows="3" placeholder="Quelques mots suffisent… (facultatif, lu par ton enseignant·e)"></textarea></label>
          <div class="row end"><button class="btn big fdone">J’ai compris ✓</button></div>`;
        body.querySelector('.fdone').addEventListener('click', () => { h.details.reflection = body.querySelector('.frefl').value.trim(); h.details.errors = errs1 + errs2; api.onFinish(true); });
      }
      if (phase === 1 && sel !== null) { const c = def.cards[+sel]; if (c) h.say(`<b>${esc(c.t)}</b> — ${md(c.x)}<br><small>Clique maintenant une colonne pour l’y poser.</small>`, 'hint'); }
    };
    const renderFull = () => { sel = null; render(); };
    render();
    return api;
  },
  /** QCM en série : chaque question doit être réussie (réessais comptés). */
  qcm(def, body, h) {
    const qs = def.questions; let i = 0; const tries = {};
    const api = { noValidate: true, check: () => null };
    const render = () => {
      const q = qs[i];
      const opts = shuffle(q.options.map((t, k) => ({ t, k })));
      body.innerHTML = `<div class="qcm-prog">Question ${i + 1} / ${qs.length}</div>
        <div class="qcm-q">${md(q.q)}</div>
        <div class="qcm-opts">${opts.map(o => `<button class="opt" data-k="${o.k}">${md(o.t)}</button>`).join('')}</div>`;
      const btns = [...body.querySelectorAll('.opt')];
      btns[0].focus();
      btns.forEach(b => b.addEventListener('click', () => {
        const k = +b.dataset.k; tries[i] = (tries[i] || 0) + 1;
        const ok = k === q.a;
        h.ctx.onQcm && h.ctx.onQcm(q.id || `${def.id}_${i}`, ok, q.options[k], tries[i], def.id, q.q);
        if (ok) {
          b.classList.add('good'); audio.sfx('right');
          h.say('✔ ' + md(q.explain || 'Bonne réponse !'), 'good');
          btns.forEach(x => x.disabled = true);
          const nx = document.createElement('button'); nx.className = 'btn next'; nx.textContent = i < qs.length - 1 ? 'Question suivante ➜' : 'Terminer ➜';
          body.appendChild(nx); nx.focus();
          nx.addEventListener('click', () => { i++; h.say(''); if (i < qs.length) render(); else { h.details.tries = tries; api.onFinish(true); } });
        } else {
          b.classList.add('bad'); b.disabled = true; audio.sfx('wrong');
          if (easyMode() && tries[i] >= 2) {
            // Mode apprentissage : on montre la bonne réponse et on explique, puis on continue
            const good = btns.find(x => +x.dataset.k === q.a); good.classList.add('good', 'reveal');
            btns.forEach(x => x.disabled = true);
            h.say('💡 <b>La bonne réponse :</b> ' + md(q.options[q.a]) + '<br>' + md(q.explain || ''), 'hint');
            const nx = document.createElement('button'); nx.className = 'btn next'; nx.textContent = i < qs.length - 1 ? 'J’ai compris, question suivante ➜' : 'J’ai compris, terminer ➜';
            body.appendChild(nx); nx.focus();
            nx.addEventListener('click', () => { i++; h.say(''); if (i < qs.length) render(); else { h.details.tries = tries; api.onFinish(true); } });
          } else h.say('✗ ' + md(q.wrong || 'Ce n’est pas ça. Relis bien et réessaie.') + (easyMode() ? '<br><small>Encore une erreur et je te montrerai la réponse, avec l’explication.</small>' : ''), 'bad');
        }
      }));
    };
    render();
    return api;
  },

  /** Texte à trous avec banque de mots. */
  fill(def, body, h) {
    const parts = def.text.split(/\{(\d+)\}/);
    const slots = []; let sel = null;
    let html = '<div class="fill-text">';
    parts.forEach((p, k) => { if (k % 2) { slots.push(null); html += `<button class="slot" data-s="${p}">______</button>`; } else html += md(p); });
    html += '</div><div class="bank">' + shuffle(def.bank.map((w, k) => ({ w, k }))).map(o => `<button class="word" data-w="${esc(o.w)}">${esc(o.w)}</button>`).join('') + '</div>';
    body.innerHTML = html;
    const words = [...body.querySelectorAll('.word')], sl = [...body.querySelectorAll('.slot')];
    words.forEach(w => w.addEventListener('click', () => { words.forEach(x => x.classList.remove('sel')); sel = w; w.classList.add('sel'); audio.sfx('select'); }));
    sl.forEach(s => s.addEventListener('click', () => {
      const idx = +s.dataset.s;
      if (sel) { slots[idx] = sel.dataset.w; s.textContent = sel.dataset.w; s.classList.add('filled'); s.classList.remove('bad'); sel.classList.remove('sel'); sel = null; audio.sfx('confirm'); }
      else if (slots[idx]) { slots[idx] = null; s.textContent = '______'; s.classList.remove('filled'); }
    }));
    return { check() {
      if (slots.some(x => !x)) { h.say('Complète tous les trous avant de valider.', 'hint'); return null; }
      let bad = 0; sl.forEach(s => { const i = +s.dataset.s; const ok = slots[i] === def.answers[i]; s.classList.toggle('bad', !ok); s.classList.toggle('good', ok); if (!ok) bad++; });
      h.details.last = slots.slice();
      return bad ? { ok: false, msg: `${bad} trou(s) incorrect(s), surligné(s) en rouge.` } : { ok: true };
    } };
  },

  /** Remettre dans l'ordre. */
  order(def, body, h) {
    let seq = [];
    const items = shuffle(def.items.map((t, k) => ({ t, k })));
    const render = () => {
      body.innerHTML = `<div class="ord-label">${md(def.label || 'Clique les éléments dans le bon ordre :')}</div>
        <ol class="ord-seq">${seq.map(k => `<li>${md(def.items[k])}</li>`).join('') || '<li class="ph">…</li>'}</ol>
        <div class="ord-pool">${items.filter(o => !seq.includes(o.k)).map(o => `<button class="word" data-k="${o.k}">${md(o.t)}</button>`).join('')}</div>
        <button class="btn ghost small ord-reset">↺ Recommencer</button>`;
      body.querySelectorAll('.word').forEach(b => b.addEventListener('click', () => { seq.push(+b.dataset.k); audio.sfx('select'); render(); }));
      body.querySelector('.ord-reset').addEventListener('click', () => { seq = []; render(); });
      const f = body.querySelector('.word'); if (f) f.focus();
    };
    render();
    return { check() {
      if (seq.length < def.items.length) { h.say('Place tous les éléments.', 'hint'); return null; }
      const ok = seq.every((k, i) => k === i);
      h.details.last = seq.slice();
      if (!ok) { const good = seq.filter((k, i) => k === i).length; seq = []; setTimeout(render, 900); return { ok: false, msg: `${good} / ${def.items.length} à la bonne place. La séquence est réinitialisée.` }; }
      return { ok: true };
    } };
  },

  /** Associer chaque élément à une catégorie. */
  match(def, body, h) {
    const items = shuffle(def.items.map((it, k) => ({ ...it, k })));
    body.innerHTML = `<div class="match">${items.map(it => `
      <div class="mrow"><div class="mitem">${md(it.t)}</div>
      <select data-k="${it.k}" aria-label="Catégorie"><option value="">— choisir —</option>${def.cats.map((c, ci) => `<option value="${ci}">${esc(c)}</option>`).join('')}</select></div>`).join('')}</div>`;
    const sels = [...body.querySelectorAll('select')];
    sels.forEach(s => s.addEventListener('change', () => { s.classList.remove('bad', 'good'); audio.sfx('select'); }));
    return { check() {
      if (sels.some(s => s.value === '')) { h.say('Associe chaque élément.', 'hint'); return null; }
      let bad = 0;
      sels.forEach(s => { const it = def.items[+s.dataset.k]; const ok = +s.value === it.cat; s.classList.toggle('bad', !ok); s.classList.toggle('good', ok); if (!ok) bad++; });
      h.details.last = sels.map(s => +s.value);
      return bad ? { ok: false, msg: `${bad} association(s) incorrecte(s).` } : { ok: true };
    } };
  },

  /** Champs à saisir (code, nombre, mot). */
  input(def, body, h) {
    body.innerHTML = `<div class="inputs">${def.fields.map((f, i) => `
      <label class="ifield"><span>${md(f.q)}</span>
      <input type="text" data-i="${i}" autocomplete="off" placeholder="${esc(f.ph || '')}" ${i === 0 ? 'autofocus' : ''}>
      ${f.unit ? `<em>${esc(f.unit)}</em>` : ''}</label>`).join('')}</div>`;
    const ins = [...body.querySelectorAll('input')];
    ins.forEach(x => x.addEventListener('keydown', e => { if (e.key === 'Enter') body.closest('.modal').querySelector('.pz-validate').click(); }));
    return { check() {
      if (ins.some(x => !x.value.trim())) { h.say('Remplis tous les champs.', 'hint'); return null; }
      let bad = 0;
      ins.forEach((x, i) => {
        const f = def.fields[i]; let ok;
        if (f.num !== undefined) { const v = parseFloat(x.value.replace(',', '.')); ok = !isNaN(v) && Math.abs(v - f.num) <= (f.tol ?? 0); }
        else ok = f.accept.some(a => norm(a) === norm(x.value));
        x.classList.toggle('bad', !ok); x.classList.toggle('good', ok); if (!ok) bad++;
      });
      h.details.last = ins.map(x => x.value);
      return bad ? { ok: false, msg: `${bad} réponse(s) incorrecte(s).` } : { ok: true };
    } };
  },

  /** Curseurs + calcul (dosage, réglages). def.calc(values) => { display, ok, msg } */
  sliders(def, body, h) {
    body.innerHTML = `<div class="sliders">${def.sliders.map((s, i) => `
      <label class="sl"><span>${md(s.label)}</span><input type="range" min="${s.min}" max="${s.max}" step="${s.step || 1}" value="${s.init ?? s.min}" data-i="${i}">
      <output>${s.init ?? s.min}${esc(s.unit || '')}</output></label>`).join('')}</div>
      <div class="sl-result"></div>`;
    const rs = [...body.querySelectorAll('input[type=range]')], out = body.querySelector('.sl-result');
    const vals = () => rs.map(r => +r.value);
    const upd = () => { rs.forEach((r, i) => r.nextElementSibling.textContent = r.value + (def.sliders[i].unit || '')); const c = def.calc(vals()); out.innerHTML = md(c.display); out.className = 'sl-result ' + (c.ok ? 'good' : ''); };
    rs.forEach(r => r.addEventListener('input', upd)); upd();
    return { check() { const c = def.calc(vals()); h.details.last = vals(); return c.ok ? { ok: true } : { ok: false, msg: c.msg || 'Pas encore dans la cible.' }; } };
  },

  /** Cartes à sélectionner sous contrainte (budget, 3U...). def.rule(selectedIdx[]) => { ok, msg, display } */
  budget(def, body, h) {
    const sel = new Set(def.cards.map((c, i) => c.init ? i : -1).filter(i => i >= 0));
    const render = () => {
      const r = def.rule([...sel]);
      body.innerHTML = `<div class="bud-status">${md(r.display || '')}</div>
        <div class="cards">${def.cards.map((c, i) => `<button class="card ${sel.has(i) ? 'on' : ''}" data-i="${i}" aria-pressed="${sel.has(i)}">
          <div class="ct">${md(c.t)}</div>${c.desc ? `<div class="cd">${md(c.desc)}</div>` : ''}${c.cost !== undefined ? `<div class="cc">${esc(c.costLabel || (c.cost + ' ' + (def.unit || '')))}</div>` : ''}</button>`).join('')}</div>`;
      body.querySelectorAll('.card').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); audio.sfx('select'); render(); body.querySelector(`.card[data-i="${i}"]`).focus(); }));
    };
    render();
    return { check() { const r = def.rule([...sel]); h.details.last = [...sel]; return r.ok ? { ok: true } : { ok: false, msg: r.msg }; } };
  },

  /** Scénario à choix : chaque étape propose des options ; les mauvaises donnent un retour et on réessaie. */
  choice(def, body, h) {
    let i = 0; const record = [];
    const api = { noValidate: true, check: () => null };
    const render = () => {
      const n = def.nodes[i];
      body.innerHTML = `<div class="qcm-prog">${def.stepLabel || 'Étape'} ${i + 1} / ${def.nodes.length}</div>
        ${n.who ? `<div class="ch-who">${esc(n.who)}</div>` : ''}<div class="qcm-q">${md(n.text)}</div>
        <div class="qcm-opts">${n.options.map((o, k) => `<button class="opt" data-k="${k}">${md(o.t)}</button>`).join('')}</div>`;
      const btns = [...body.querySelectorAll('.opt')]; btns[0].focus();
      let tries = 0;
      btns.forEach(b => b.addEventListener('click', () => {
        const o = n.options[+b.dataset.k]; tries++;
        h.ctx.onQcm && h.ctx.onQcm(`${def.id}_n${i}`, !!o.ok, o.t, tries, def.id, n.text);
        record.push({ node: i, choice: +b.dataset.k, ok: !!o.ok });
        if (o.ok) {
          b.classList.add('good'); audio.sfx('right'); h.say('✔ ' + md(o.fb || ''), 'good'); btns.forEach(x => x.disabled = true);
          const nx = document.createElement('button'); nx.className = 'btn next'; nx.textContent = i < def.nodes.length - 1 ? 'Suite ➜' : 'Conclure ➜';
          body.appendChild(nx); nx.focus();
          nx.addEventListener('click', () => { i++; h.say(''); if (i < def.nodes.length) render(); else { h.details.choices = record; api.onFinish(true); } });
        } else { b.classList.add('bad'); b.disabled = true; audio.sfx('wrong'); h.say('✗ ' + md(o.fb || 'Mauvais choix…'), 'bad'); }
      }));
    };
    render();
    return api;
  },

  /** Cadenas à molettes. */
  lock(def, body, h) {
    const st = def.dials.map(() => 0);
    const render = () => {
      body.innerHTML = `<div class="dials">${def.dials.map((d, i) => `
        <div class="dial"><div class="dl">${md(d.label)}</div>
        <button class="dbtn" data-i="${i}" data-d="-1" aria-label="Précédent">▲</button>
        <div class="dv">${esc(d.values[st[i]])}</div>
        <button class="dbtn" data-i="${i}" data-d="1" aria-label="Suivant">▼</button></div>`).join('')}</div>`;
      body.querySelectorAll('.dbtn').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i, n = def.dials[i].values.length; st[i] = (st[i] + +b.dataset.d + n) % n; audio.sfx('select'); render(); body.querySelector(`.dbtn[data-i="${i}"][data-d="${b.dataset.d}"]`).focus(); }));
    };
    render();
    return { check() { const bad = def.dials.filter((d, i) => st[i] !== d.a).length; h.details.last = st.slice(); return bad ? { ok: false, msg: bad <= 2 ? 'Le mécanisme tremble… tu y es presque.' : 'Le mécanisme résiste.' } : { ok: true }; } };
  },
};

export const PUZZLE_TYPES = Object.keys(RENDERERS);
