// =============================================================
// input.js — clavier, manette et commandes tactiles
// =============================================================

const KEYMAP = {
  up: ['ArrowUp', 'KeyW', 'KeyZ'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA', 'KeyQ'],
  right: ['ArrowRight', 'KeyD'],
  attack: ['Space', 'KeyJ'],
  interact: ['KeyE', 'KeyK', 'Enter'],
  shield: ['ShiftLeft', 'ShiftRight', 'KeyL'],
  roll: ['ControlLeft', 'ControlRight', 'KeyU'],
  inventory: ['KeyI', 'Tab'],
  map: ['KeyM'],
  codex: ['KeyC'],
  journal: ['KeyJ_unused', 'KeyO'],
  pause: ['Escape', 'KeyP'],
};

class Input {
  constructor() {
    this.keys = new Set();
    this.tapped = new Set(); // touches pressées puis relâchées entre deux frames
    this.prev = new Set();
    this.cur = new Set();
    this.touch = { x: 0, y: 0, active: false, btn: new Set() };
    this.enabled = true;
    this.lastDevice = 'keyboard';
    this._bind();
  }

  _bind() {
    addEventListener('keydown', e => {
      // Ne pas capturer la saisie dans les champs de texte
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      this.keys.add(e.code); this.tapped.add(e.code);
      this.lastDevice = 'keyboard';
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault();
    });
    addEventListener('keyup', e => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());
  }

  /** Construit l'interface tactile (joystick + boutons). */
  setupTouch(root) {
    const wrap = document.createElement('div');
    wrap.id = 'touch';
    wrap.innerHTML = `
      <div class="stick" id="stick"><div class="knob" id="knob"></div></div>
      <div class="tpad">
        <button data-a="attack" class="tb tb-a" aria-label="Attaquer">⚔</button>
        <button data-a="interact" class="tb tb-b" aria-label="Interagir">✋</button>
        <button data-a="shield" class="tb tb-c" aria-label="Bouclier">🛡</button>
        <button data-a="roll" class="tb tb-d" aria-label="Roulade">↻</button>
      </div>
      <button data-a="pause" class="tb tb-menu" aria-label="Menu">☰</button>`;
    root.appendChild(wrap);
    const stick = wrap.querySelector('#stick'), knob = wrap.querySelector('#knob');
    let id = null, cx = 0, cy = 0;
    const R = 44;
    stick.addEventListener('pointerdown', e => {
      id = e.pointerId; try { stick.setPointerCapture(id); } catch (err) { /* pointeur synthétique */ }
      const r = stick.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      move(e);
    });
    const move = e => {
      if (e.pointerId !== id) return;
      let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy);
      if (d > R) { dx *= R / d; dy *= R / d; }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      this.touch.x = dx / R; this.touch.y = dy / R; this.touch.active = true;
      this.lastDevice = 'touch';
    };
    stick.addEventListener('pointermove', move);
    const end = e => { if (e.pointerId !== id) return; id = null; knob.style.transform = ''; this.touch.x = this.touch.y = 0; this.touch.active = false; };
    stick.addEventListener('pointerup', end); stick.addEventListener('pointercancel', end);
    wrap.querySelectorAll('.tb').forEach(b => {
      const a = b.dataset.a;
      b.addEventListener('pointerdown', e => { e.preventDefault(); this.touch.btn.add(a); this.touch.tap = (this.touch.tap || new Set()).add(a); this.lastDevice = 'touch'; });
      const up = () => this.touch.btn.delete(a);
      b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
    });
    const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    document.body.classList.toggle('has-touch', isTouch);
  }

  /** À appeler une fois par frame. */
  update() {
    this.prev = this.cur;
    const s = new Set();
    for (const [act, codes] of Object.entries(KEYMAP)) if (codes.some(c => this.keys.has(c) || this.tapped.has(c))) s.add(act);
    this.tapped.clear();
    for (const a of this.touch.btn) s.add(a);
    if (this.touch.tap) { for (const a of this.touch.tap) s.add(a); this.touch.tap.clear(); }
    if (this.touch.active) {
      if (this.touch.x < -0.35) s.add('left'); if (this.touch.x > 0.35) s.add('right');
      if (this.touch.y < -0.35) s.add('up'); if (this.touch.y > 0.35) s.add('down');
    }
    // Manette
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      const ax = p.axes[0] || 0, ay = p.axes[1] || 0;
      const b = i => p.buttons[i] && p.buttons[i].pressed;
      if (ax < -0.4 || b(14)) s.add('left'); if (ax > 0.4 || b(15)) s.add('right');
      if (ay < -0.4 || b(12)) s.add('up'); if (ay > 0.4 || b(13)) s.add('down');
      if (b(0)) s.add('attack'); if (b(1)) s.add('interact'); if (b(4) || b(6)) s.add('shield');
      if (b(2)) s.add('roll'); if (b(3)) s.add('inventory'); if (b(9)) s.add('pause'); if (b(8)) s.add('map');
      if ([...s].length) this.lastDevice = 'gamepad';
    }
    this.cur = this.enabled ? s : new Set();
  }

  down(a) { return this.cur.has(a); }
  pressed(a) { return this.cur.has(a) && !this.prev.has(a); }
  /** Vecteur de déplacement normalisé. */
  axis() {
    let x = 0, y = 0;
    if (this.touch.active && this.enabled) { x = this.touch.x; y = this.touch.y; if (Math.hypot(x, y) < 0.2) x = y = 0; }
    else {
      if (this.down('left')) x -= 1; if (this.down('right')) x += 1;
      if (this.down('up')) y -= 1; if (this.down('down')) y += 1;
    }
    const d = Math.hypot(x, y); if (d > 1) { x /= d; y /= d; }
    return { x, y };
  }
  clear() { this.keys.clear(); this.tapped.clear(); this.touch.btn.clear(); this.cur = new Set(); this.prev = new Set(); }
}

export const input = new Input();
