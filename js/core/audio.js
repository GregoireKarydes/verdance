// =============================================================
// audio.js — musique d'ambiance procédurale (piano, nappes, réverb) + effets sonores
// Tout est synthétisé par la Web Audio API : aucun fichier audio.
// =============================================================
import { rng } from './util.js';

const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11], phrygian: [0, 1, 3, 5, 7, 8, 10], mixo: [0, 2, 4, 5, 7, 9, 10],
  harm: [0, 2, 3, 5, 7, 8, 11],
};

/**
 * Thèmes musicaux — ambiance « grand jeu d'aventure » : piano épars, nappes,
 * réverbération longue, mélodies de village. Composition générative : la musique
 * ne se répète jamais à l'identique.
 * style : field (plaine, notes éparses) · village (mélodie + arpèges) · dungeon
 * (mystère, gouttes) · boss (ostinato tendu) · title / ending (thème lent).
 */
export const THEMES = {
  title:      { root: 57, bpm: 66, ash: 'minor',    green: 'dorian', prog: [0, 5, 3, 4], seed: 11,  style: 'title' },
  village:    { root: 60, bpm: 84, ash: 'dorian',   green: 'major',  prog: [0, 3, 4, 0, 5, 3, 1, 4], seed: 3, style: 'village' },
  steppe:     { root: 62, bpm: 72, ash: 'phrygian', green: 'lydian', prog: [0, 3, 0, 4], seed: 7,   style: 'field' },
  bassin:     { root: 59, bpm: 70, ash: 'minor',    green: 'major',  prog: [0, 5, 3, 4], seed: 21,  style: 'field' },
  mines:      { root: 55, bpm: 64, ash: 'harm',     green: 'dorian', prog: [0, 1, 0, 5], seed: 33,  style: 'dungeon' },
  marais:     { root: 58, bpm: 66, ash: 'phrygian', green: 'dorian', prog: [0, 6, 5, 6], seed: 41,  style: 'field' },
  citadelle:  { root: 57, bpm: 78, ash: 'minor',    green: 'mixo',   prog: [0, 5, 6, 4], seed: 52,  style: 'village' },
  desert:     { root: 61, bpm: 68, ash: 'harm',     green: 'lydian', prog: [0, 1, 0, 4], seed: 63,  style: 'field' },
  decharge:   { root: 56, bpm: 70, ash: 'phrygian', green: 'mixo',   prog: [0, 6, 5, 6], seed: 74,  style: 'field' },
  forge:      { root: 60, bpm: 80, ash: 'dorian',   green: 'major',  prog: [0, 4, 5, 3], seed: 85,  style: 'village' },
  sanctuaire: { root: 64, bpm: 60, ash: 'minor',    green: 'lydian', prog: [0, 3, 5, 4], seed: 96,  style: 'title' },
  dungeon:    { root: 53, bpm: 60, ash: 'harm',     green: 'dorian', prog: [0, 1, 0, 5], seed: 105, style: 'dungeon' },
  boss:       { root: 52, bpm: 132, ash: 'harm',    green: 'harm',   prog: [0, 1, 5, 4], seed: 666, style: 'boss' },
  ending:     { root: 60, bpm: 70, ash: 'major',    green: 'major',  prog: [0, 5, 3, 4], seed: 2026, style: 'title' },
  puzzle:     { root: 62, bpm: 76, ash: 'dorian',   green: 'dorian', prog: [0, 3, 0, 4], seed: 314, style: 'field' },
};

class AudioEngine {
  constructor() {
    this.ctx = null; this.ready = false;
    this.vol = { master: 0.8, music: 0.55, sfx: 0.8 };
    this.theme = null; this.green = 0; this.step = 0; this.nextTime = 0;
    this.timer = null; this.pattern = null; this.muted = false;
  }

  /** Doit être appelé sur un geste utilisateur. */
  init() {
    if (this.ready) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const c = this.ctx;
    this.master = c.createGain(); this.master.connect(c.destination);
    this.comp = c.createDynamicsCompressor(); this.comp.connect(this.master);
    this.musicBus = c.createGain(); this.musicFilter = c.createBiquadFilter();
    this.musicFilter.type = 'lowpass'; this.musicFilter.frequency.value = 2400;
    this.musicBus.connect(this.musicFilter); this.musicFilter.connect(this.comp);
    // Réverbération longue (réponse impulsionnelle générée) : le cœur de l'ambiance
    this.reverb = c.createConvolver(); this.reverb.buffer = this._impulse(4.2, 2.6);
    this.revSend = c.createGain(); this.revSend.gain.value = 0.55;
    this.revOut = c.createGain(); this.revOut.gain.value = 0.9;
    this.musicFilter.connect(this.revSend); this.revSend.connect(this.reverb); this.reverb.connect(this.revOut); this.revOut.connect(this.comp);
    this.sfxBus = c.createGain(); this.sfxBus.connect(this.comp);
    // Écho léger pour la musique
    this.delay = c.createDelay(); this.delay.delayTime.value = 0.28;
    this.fb = c.createGain(); this.fb.gain.value = 0.22;
    this.delay.connect(this.fb); this.fb.connect(this.delay); this.delay.connect(this.musicFilter);
    // Bruit blanc réutilisable
    const len = c.sampleRate * 1.5; const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    // Onde pulse 25 %
    const real = new Float32Array(32), imag = new Float32Array(32);
    for (let n = 1; n < 32; n++) imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * 0.25);
    this.pulse = c.createPeriodicWave(real, imag);
    this.ambient = null;
    this.ready = true;
    this.applyVolumes();
    this.timer = setInterval(() => this._schedule(), 30);
  }

  applyVolumes() {
    if (!this.ready) return;
    this.master.gain.value = this.muted ? 0 : this.vol.master;
    this.musicBus.gain.value = this.vol.music * 0.9;
    this.sfxBus.gain.value = this.vol.sfx * 0.7;
  }
  setVolumes(v) { Object.assign(this.vol, v); this.applyVolumes(); }

  // ---------------------------------------------------------------- Musique
  /** Change de thème (fondu). green ∈ [0,1] module le mode et la brillance. */
  play(name, green = 0) {
    if (!this.ready) { this._pending = [name, green]; return; }
    const th = THEMES[name] || THEMES.village;
    const key = name + ':' + (green > 0.5 ? 'g' : 'a');
    if (this.themeKey === key) { this.setGreen(green); return; }
    this.themeKey = key; this.themeName = name;
    const c = this.ctx, t = c.currentTime;
    this.musicBus.gain.cancelScheduledValues(t);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, t);
    this.musicBus.gain.linearRampToValueAtTime(0.0001, t + 0.6);
    setTimeout(() => {
      this.theme = th; this.green = green; this.pattern = this._compose(th, green); this.phrase = [];
      this.step = 0; this.nextTime = this.ctx.currentTime + 0.05;
      this.musicBus.gain.linearRampToValueAtTime(this.vol.music * 0.9, this.ctx.currentTime + 1.2);
      this.setGreen(green);
      this._ambient(name, green);
    }, 620);
  }
  setGreen(g) {
    this.green = g;
    if (this.ready) this.musicFilter.frequency.setTargetAtTime(1500 + g * 5000, this.ctx.currentTime, 0.8);
  }
  stopMusic() { this.theme = null; this.themeKey = null; }

  _impulse(sec, decay) {
    const c = this.ctx, n = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay) * (i < 400 ? i / 400 : 1); }
    return b;
  }

  _compose(th, green) {
    const r = rng(th.seed + (green > 0.5 ? 1000 : 0));
    const scale = SCALES[green > 0.5 ? th.green : th.ash];
    const deg = (d, oct = 0) => th.root + scale[((d % 7) + 7) % 7] + 12 * (Math.floor(d / 7) + oct);
    // Mélodie composée (thèmes chantants) : 8 mesures de croches, forme A A' B A
    const phrase = () => { const out = []; let d = [0, 2, 4][Math.floor(r() * 3)]; let i = 0;
      while (i < 16) { const len = [1, 1, 2, 2, 2, 3, 4][Math.floor(r() * 7)]; out.push({ i, d, len: Math.min(len, 16 - i) }); i += len; d += [-2, -1, -1, 1, 1, 2, 0, 3][Math.floor(r() * 8)]; d = Math.max(-2, Math.min(9, d)); }
      out[out.length - 1].len += 0; return out; };
    const A = phrase(), A2 = phrase().map((n, k) => k < 3 ? { ...A[k] || n } : n), Bp = phrase().map(n => ({ ...n, d: n.d + 2 }));
    const tune = [];
    [A, A2, Bp, A].forEach((ph, k) => ph.forEach(n => tune.push({ step: k * 16 + n.i, d: n.d, len: n.len })));
    tune.at(-1).d = 0; tune.at(-1).len = Math.max(tune.at(-1).len, 3);
    return { deg, scale, tune };
  }

  _schedule() {
    if (!this.ready || !this.theme || !this.pattern) return;
    const c = this.ctx, th = this.theme, p = this.pattern, g = this.green;
    const e = 60 / th.bpm / 2; // croche
    while (this.nextTime < c.currentTime + 0.25) {
      const t = this.nextTime, s = this.step;
      const barLen = 8, chordLen = th.style === 'boss' ? 8 : 16;
      const ci = Math.floor(s / chordLen) % th.prog.length, root = th.prog[ci];
      const inChord = s % chordLen;
      const chord = [p.deg(root, -1), p.deg(root + 2, -1), p.deg(root + 4, -1)];
      const human = () => (Math.random() - 0.5) * 0.018;
      switch (th.style) {
        case 'boss': {
          if (s % 2 === 0) this._piano(NOTE(chord[0] - 12 + (s % 8 === 6 ? 1 : 0)), t, 0.16, 0.5);
          if (s % 8 === 0 || s % 8 === 3 || s % 8 === 6) this._taiko(t, s % 8 === 0 ? 0.5 : 0.3);
          if (inChord === 0) this._pad(chord.map(n => NOTE(n)), t, e * chordLen, 0.03, 900);
          if (s % 16 === 12) this._piano(NOTE(p.deg(root + 4, 1)), t, 0.12, 1.2);
          break;
        }
        case 'dungeon': {
          if (inChord === 0) { this._pad([NOTE(chord[0] - 12), NOTE(chord[0] - 5)], t, e * chordLen, 0.05, 600); this._piano(NOTE(chord[0] - 12), t + human(), 0.18, 6); }
          if (s % 4 === 0 && Math.random() < 0.22) { const n = p.deg(Math.floor(Math.random() * 7) + (Math.random() < 0.4 ? 7 : 0), 0); this._piano(NOTE(n), t + human(), 0.07 + Math.random() * 0.06, 4); }
          if (Math.random() < 0.025) this._drop(t);
          break;
        }
        case 'village': case 'title': {
          const slow = th.style === 'title';
          // main gauche : accords brisés doux
          const pat = slow ? [0, null, 2, null, 1, null, 2, null] : [0, 2, 1, 2, 0, 2, 1, 2];
          const k = pat[s % barLen];
          if (k !== null && (g > 0.3 || s % 2 === 0)) this._piano(NOTE(chord[k] + (k === 0 ? -12 : 0)), t + human(), (k === 0 ? 0.13 : 0.075) * (0.6 + 0.4 * g), slow ? 3 : 2);
          if (inChord === 0) this._pad(chord.map(n => NOTE(n + 12)), t, e * chordLen, 0.012 + 0.014 * g, 1400);
          // mélodie (flûte quand le monde est vert, piano dans la cendre)
          const ms = s % 64, n = p.tune.find(x => x.step === ms);
          if (n && (g > 0.5 || Math.random() < 0.75)) {
            const f = NOTE(p.deg(n.d, 1)), dur = n.len * e;
            if (g > 0.5 && !slow) this._flute(f, t + human(), dur * 0.95, 0.07);
            else this._piano(f, t + human(), 0.17, Math.max(1.5, dur * 2));
          }
          break;
        }
        default: { // field : piano épars façon grande plaine
          if (inChord === 0) { this._piano(NOTE(chord[0] - 12), t, 0.14, 7); this._pad(chord.map(n => NOTE(n + 12)), t, e * chordLen, 0.008 + 0.012 * g, 1100); }
          if (!this.phrase.length && s % 4 === 0 && Math.random() < 0.10 + 0.12 * g) {
            let d = [0, 2, 4, 7][Math.floor(Math.random() * 4)] + root; let at = s + (Math.random() < 0.5 ? 0 : 1);
            const N = 3 + Math.floor(Math.random() * (g > 0.5 ? 5 : 3));
            for (let i = 0; i < N; i++) { this.phrase.push({ at, d }); at += [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)]; d += [-2, -1, 1, 1, 2, -3, 4][Math.floor(Math.random() * 7)]; }
          }
          while (this.phrase.length && this.phrase[0].at <= s) {
            const n = this.phrase.shift(); const hi = g > 0.5 ? 1 : 0;
            this._piano(NOTE(p.deg(n.d, hi)), t + human(), 0.1 + Math.random() * 0.08, 4);
            if (g > 0.6 && Math.random() < 0.15) this._piano(NOTE(p.deg(n.d + 7, hi)), t + 0.02, 0.05, 3);
          }
          if (g > 0.5 && s % 32 === 30 && Math.random() < 0.3) for (let i = 0; i < 6; i++) this._piano(NOTE(p.deg(root + i * 2, 1)), t + i * 0.07, 0.05, 2.5); // glissando
        }
      }
      this.nextTime += e; this.step++;
    }
  }

  // ---------------------------------------------------------------- Instruments
  /** Piano synthétique : partiels sinus, attaque franche, décroissance douce. */
  _piano(freq, t, vel, dur = 3) {
    const c = this.ctx, out = c.createGain(), f = c.createBiquadFilter();
    t = Math.max(t, c.currentTime);
    f.type = 'lowpass'; f.frequency.setValueAtTime(Math.min(9000, freq * 9), t); f.frequency.exponentialRampToValueAtTime(Math.max(500, freq * 2.2), t + dur * 0.6);
    out.gain.setValueAtTime(0.0001, t); out.gain.linearRampToValueAtTime(vel, t + 0.006);
    out.gain.exponentialRampToValueAtTime(vel * 0.4, t + 0.3); out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [[1, 1], [2, 0.38], [3, 0.16], [4, 0.08], [6, 0.03]].forEach(([k, a]) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'sine';
      o.frequency.value = freq * k * (1 + 0.00035 * k * k); o.detune.value = (Math.random() - 0.5) * 4; g.gain.value = a;
      o.connect(g); g.connect(f); o.start(t); o.stop(t + dur + 0.05);
    });
    f.connect(out); out.connect(this.musicBus);
  }
  /** Nappe : oscillateurs désaccordés, attaque et extinction lentes. */
  _pad(freqs, t, dur, vol, cut = 1200) {
    const c = this.ctx, f = c.createBiquadFilter(), out = c.createGain();
    f.type = 'lowpass'; f.frequency.value = cut; f.Q.value = 0.3;
    out.gain.setValueAtTime(0.0001, t); out.gain.linearRampToValueAtTime(vol, t + Math.min(2, dur * 0.4));
    out.gain.setValueAtTime(vol, t + dur * 0.75); out.gain.linearRampToValueAtTime(0.0001, t + dur + 2.5);
    for (const fr of freqs) for (const det of [-7, 7]) { const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = fr; o.detune.value = det; o.connect(f); o.start(t); o.stop(t + dur + 2.6); }
    f.connect(out); out.connect(this.musicBus);
  }
  /** Flûte douce (sinus + souffle léger, vibrato tardif). */
  _flute(freq, t, dur, vol) {
    const c = this.ctx, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain();
    o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = freq; o2.frequency.value = freq * 2; const g2 = c.createGain(); g2.gain.value = 0.08;
    l.frequency.value = 5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(freq * 0.006, t + Math.min(0.5, dur)); l.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.07); g.gain.setValueAtTime(vol * 0.85, t + Math.max(0.08, dur - 0.1)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(this.musicBus);
    [o, o2, l].forEach(x => { x.start(t); x.stop(t + dur + 0.4); });
  }
  _taiko(t, v) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g); g.connect(this.musicBus); o.start(t); o.stop(t + 0.5);
    this._noise(t, 0.08, v * 0.3, 700, 'lowpass');
  }
  _drop(t) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); const f = 1400 + Math.random() * 900;
    o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.06);
    g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12); o.connect(g); g.connect(this.musicBus); o.start(t); o.stop(t + 0.15); }

  _tone(freq, t, dur, type, vol, att = 0.01, rel = 0.1, detune = 0, vib = false, bus) {
    const c = this.ctx, o = c.createOscillator(), gn = c.createGain();
    if (type === 'pulse') o.setPeriodicWave(this.pulse); else o.type = type;
    o.frequency.value = freq; o.detune.value = detune;
    if (vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.5; lg.gain.value = 6; l.connect(lg); lg.connect(o.detune); l.start(t); l.stop(t + dur + rel); }
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(vol, t + att);
    gn.gain.setValueAtTime(vol, t + Math.max(att, dur - rel));
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
    o.connect(gn); gn.connect(bus || this.musicBus);
    if (!bus && vib) gn.connect(this.delay);
    o.start(t); o.stop(t + dur + rel + 0.05);
  }
  _kick(t, bus) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(bus || this.musicBus); o.start(t); o.stop(t + 0.2);
  }
  _noise(t, dur, vol, freq, ftype = 'highpass', bus) {
    const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noiseBuf; f.type = ftype; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || this.musicBus);
    s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }

  // ---------------------------------------------------------------- Ambiance
  _ambient(name, green) {
    if (this.ambient) { try { this.ambient.g.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1); const a = this.ambient; setTimeout(() => a.s.stop(), 1200); } catch (e) { /* */ } }
    clearInterval(this._birds);
    const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noiseBuf; s.loop = true; f.type = 'lowpass';
    f.frequency.value = green > 0.5 ? 500 : 350; g.gain.value = 0.0001;
    g.gain.linearRampToValueAtTime(green > 0.5 ? 0.02 : 0.05, c.currentTime + 2);
    // Souffle de vent modulé
    const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 0.13; lg.gain.value = 220;
    l.connect(lg); lg.connect(f.frequency); l.start();
    s.connect(f); f.connect(g); g.connect(this.sfxBus); s.start();
    this.ambient = { s, g };
    if (green > 0.5 && !['dungeon', 'boss', 'title'].includes(name)) {
      this._birds = setInterval(() => { if (Math.random() < 0.35) this.sfx('bird'); }, 2200);
    }
  }

  // ---------------------------------------------------------------- Effets
  sfx(name) {
    if (!this.ready) return;
    const c = this.ctx, t = c.currentTime, B = this.sfxBus;
    const tone = (f, d, type = 'square', v = 0.15, a = 0.005, r = 0.05) => this._tone(f, t, d, type, v, a, r, 0, false, B);
    const sweep = (f1, f2, d, type = 'square', v = 0.15, delay = 0) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = type;
      o.frequency.setValueAtTime(f1, t + delay); o.frequency.exponentialRampToValueAtTime(f2, t + delay + d);
      g.gain.setValueAtTime(v, t + delay); g.gain.exponentialRampToValueAtTime(0.0001, t + delay + d);
      o.connect(g); g.connect(B); o.start(t + delay); o.stop(t + delay + d + 0.02);
    };
    const arp = (notes, step, type = 'square', v = 0.12) => notes.forEach((n, i) => this._tone(NOTE(n), t + i * step, step * 1.2, type, v, 0.004, 0.05, 0, false, B));
    switch (name) {
      case 'swing': this._noise(t, 0.09, 0.18, 2500, 'bandpass', B); sweep(500, 220, 0.08, 'triangle', 0.08); break;
      case 'hit': sweep(320, 80, 0.12, 'square', 0.18); this._noise(t, 0.06, 0.2, 1200, 'lowpass', B); break;
      case 'kill': arp([72, 67, 60, 55], 0.04, 'square', 0.1); this._noise(t, 0.2, 0.2, 900, 'lowpass', B); break;
      case 'hurt': sweep(220, 70, 0.25, 'sawtooth', 0.2); break;
      case 'shield': tone(1200, 0.05, 'square', 0.1); tone(1800, 0.08, 'triangle', 0.08); break;
      case 'parry': arp([84, 88, 91], 0.035, 'square', 0.12); break;
      case 'roll': this._noise(t, 0.18, 0.12, 600, 'bandpass', B); break;
      case 'step': this._noise(t, 0.03, 0.04, 300, 'lowpass', B); break;
      case 'blip': tone(880 + Math.random() * 60, 0.025, 'square', 0.05); break;
      case 'select': tone(990, 0.04, 'square', 0.09); break;
      case 'confirm': arp([76, 83], 0.05, 'square', 0.1); break;
      case 'back': arp([76, 69], 0.05, 'square', 0.08); break;
      case 'coin': arp([88, 95], 0.05, 'square', 0.09); break;
      case 'pickup': arp([72, 76, 79, 84], 0.05, 'pulse', 0.12); break;
      case 'heal': arp([67, 71, 74, 79, 83], 0.05, 'triangle', 0.14); break;
      case 'codex': arp([79, 83, 86, 91], 0.06, 'triangle', 0.12); break;
      case 'item': arp([67, 71, 74, 79, 74, 79, 83, 86], 0.09, 'square', 0.13); break;
      case 'secret': arp([79, 78, 75, 69, 68, 76, 80, 84], 0.08, 'square', 0.12); break;
      case 'door': sweep(120, 60, 0.4, 'sawtooth', 0.15); this._noise(t, 0.4, 0.15, 400, 'lowpass', B); break;
      case 'unlock': arp([60, 64, 67, 72, 76], 0.06, 'square', 0.12); break;
      case 'right': arp([72, 79, 84], 0.07, 'square', 0.12); break;
      case 'wrong': sweep(300, 150, 0.25, 'sawtooth', 0.12); tone(140, 0.25, 'square', 0.06); break;
      case 'quest': arp([67, 72, 76, 79, 84, 88], 0.08, 'pulse', 0.13); break;
      case 'grow': arp([60, 64, 67, 71, 72, 76, 79, 83, 84, 88, 91, 96], 0.09, 'triangle', 0.15); sweep(200, 1600, 1.6, 'sine', 0.06); break;
      case 'levelup': arp([60, 67, 72, 76, 79, 84], 0.07, 'square', 0.14); break;
      case 'bubble': sweep(600, 900, 0.1, 'sine', 0.08); break;
      case 'explode': this._noise(t, 0.6, 0.35, 500, 'lowpass', B); sweep(180, 40, 0.5, 'sawtooth', 0.2); break;
      case 'warp': sweep(200, 1400, 0.5, 'sine', 0.1); sweep(1400, 300, 0.5, 'triangle', 0.06, 0.25); break;
      case 'bird': { const f = 2000 + Math.random() * 1500; sweep(f, f * 1.4, 0.07, 'sine', 0.025); sweep(f * 1.2, f * 0.9, 0.06, 'sine', 0.02, 0.1); break; }
      case 'death': arp([67, 63, 60, 55, 51, 48], 0.14, 'triangle', 0.15); break;
      case 'boss': sweep(80, 40, 1.2, 'sawtooth', 0.25); this._noise(t, 1.2, 0.2, 300, 'lowpass', B); break;
      case 'type': tone(600 + Math.random() * 300, 0.015, 'square', 0.025); break;
      default: tone(660, 0.05);
    }
  }
}

export const audio = new AudioEngine();
