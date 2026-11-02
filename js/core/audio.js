// =============================================================
// audio.js — musique procédurale chiptune + effets sonores
// Tout est synthétisé par la Web Audio API : aucun fichier audio.
// =============================================================
import { rng } from './util.js';

const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11], phrygian: [0, 1, 3, 5, 7, 8, 10], mixo: [0, 2, 4, 5, 7, 9, 10],
  harm: [0, 2, 3, 5, 7, 8, 11],
};

/** Thèmes musicaux : root MIDI, tempo, modes cendre/vert, progression (degrés). */
export const THEMES = {
  title:      { root: 57, bpm: 84,  ash: 'minor',  green: 'dorian', prog: [0, 5, 3, 4], seed: 11, drums: 0, pad: 1 },
  village:    { root: 60, bpm: 96,  ash: 'minor',  green: 'major',  prog: [0, 3, 4, 0], seed: 3,  drums: 1 },
  steppe:     { root: 62, bpm: 80,  ash: 'phrygian', green: 'lydian', prog: [0, 6, 5, 4], seed: 7, drums: 0, pad: 1 },
  bassin:     { root: 59, bpm: 90,  ash: 'minor',  green: 'mixo',   prog: [0, 4, 5, 3], seed: 21, drums: 1 },
  mines:      { root: 55, bpm: 104, ash: 'harm',   green: 'dorian', prog: [0, 0, 5, 4], seed: 33, drums: 2 },
  marais:     { root: 58, bpm: 76,  ash: 'phrygian', green: 'dorian', prog: [0, 1, 0, 6], seed: 41, drums: 1, pad: 1 },
  citadelle:  { root: 57, bpm: 118, ash: 'minor',  green: 'mixo',   prog: [0, 5, 6, 4], seed: 52, drums: 2 },
  desert:     { root: 61, bpm: 88,  ash: 'harm',   green: 'lydian', prog: [0, 1, 0, 4], seed: 63, drums: 1, pad: 1 },
  decharge:   { root: 56, bpm: 110, ash: 'phrygian', green: 'mixo', prog: [0, 6, 5, 6], seed: 74, drums: 2 },
  forge:      { root: 60, bpm: 108, ash: 'dorian', green: 'major',  prog: [0, 4, 5, 3], seed: 85, drums: 2 },
  sanctuaire: { root: 64, bpm: 72,  ash: 'minor',  green: 'lydian', prog: [0, 3, 5, 4], seed: 96, drums: 0, pad: 1 },
  dungeon:    { root: 53, bpm: 92,  ash: 'harm',   green: 'dorian', prog: [0, 1, 0, 5], seed: 105, drums: 1, pad: 1 },
  boss:       { root: 52, bpm: 140, ash: 'harm',   green: 'harm',   prog: [0, 1, 5, 4], seed: 666, drums: 3 },
  ending:     { root: 60, bpm: 78,  ash: 'major',  green: 'major',  prog: [0, 5, 3, 4], seed: 2026, drums: 1, pad: 1 },
  puzzle:     { root: 62, bpm: 84,  ash: 'dorian', green: 'dorian', prog: [0, 3, 0, 4], seed: 314, drums: 0, pad: 1 },
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
    this.musicBus.gain.value = this.vol.music * 0.5;
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
      this.theme = th; this.green = green; this.pattern = this._compose(th, green);
      this.step = 0; this.nextTime = this.ctx.currentTime + 0.05;
      this.musicBus.gain.linearRampToValueAtTime(this.vol.music * 0.5, this.ctx.currentTime + 1.2);
      this.setGreen(green);
      this._ambient(name, green);
    }, 620);
  }
  setGreen(g) {
    this.green = g;
    if (this.ready) this.musicFilter.frequency.setTargetAtTime(900 + g * 3600, this.ctx.currentTime, 0.8);
  }
  stopMusic() { this.theme = null; this.themeKey = null; }

  _compose(th, green) {
    const r = rng(th.seed + (green > 0.5 ? 1000 : 0));
    const scale = SCALES[green > 0.5 ? th.green : th.ash];
    const deg = (d, oct = 0) => th.root + scale[((d % 7) + 7) % 7] + 12 * (Math.floor(d / 7) + oct);
    const bars = th.prog.length;
    const melody = [];
    // Motif de 2 mesures répété avec variation
    const motif = [];
    for (let i = 0; i < 32; i++) {
      const play = r() < (green > 0.5 ? 0.42 : 0.26) && (i % 2 === 0 || r() < 0.3);
      motif.push(play ? Math.floor(r() * 7) + (r() < 0.2 ? 7 : 0) : null);
    }
    for (let b = 0; b < bars; b++) for (let s = 0; s < 16; s++) {
      const m = motif[(b % 2) * 16 + s];
      melody.push(m === null ? null : deg(m + th.prog[b] * (b >= 2 && r() < 0.3 ? 1 : 0), 1));
    }
    const chords = th.prog.map(p => [deg(p, -1), deg(p + 2, -1), deg(p + 4, -1)]);
    const arpPat = [0, 1, 2, 1, 0, 2, 1, 2].map(x => x);
    return { melody, chords, arpPat, deg, bars, scale };
  }

  _schedule() {
    if (!this.ready || !this.theme || !this.pattern) return;
    const c = this.ctx, th = this.theme, p = this.pattern;
    const spb = 60 / th.bpm / 4; // durée d'une double-croche
    while (this.nextTime < c.currentTime + 0.18) {
      const t = this.nextTime, s = this.step % (p.bars * 16), bar = Math.floor(s / 16), sb = s % 16;
      const ch = p.chords[bar];
      const g = this.green;
      // Pad
      if (sb === 0 && (th.pad || g > 0.3)) ch.forEach((n, i) => this._tone(NOTE(n + 12), t, spb * 16, 'sawtooth', 0.025 + 0.01 * g, 0.4, 0.5, i * 7 - 7));
      // Basse
      if (sb % 4 === 0 && (sb !== 8 || th.drums > 1)) this._tone(NOTE(ch[0] - 12), t, spb * (th.drums > 1 ? 2 : 3.5), 'triangle', 0.18, 0.005, 0.08);
      // Arpège (plus présent quand le monde reverdit)
      if (sb % 2 === 0 && g > 0.25) { const n = ch[p.arpPat[(sb / 2) % 8]] + 24; this._tone(NOTE(n), t, spb * 1.5, 'pulse', 0.035 * g, 0.002, 0.06); }
      // Mélodie
      const m = p.melody[s];
      if (m) this._tone(NOTE(m), t, spb * 2.2, g > 0.5 ? 'square' : 'triangle', 0.05, 0.01, 0.12, 0, true);
      // Batterie
      if (th.drums) {
        if (sb % 8 === 0) this._kick(t);
        if (th.drums > 1 && sb % 8 === 4) this._noise(t, 0.12, 0.12, 1800, 'bandpass');
        if (sb % 2 === 0 && (th.drums > 1 || g > 0.5)) this._noise(t, 0.03, 0.04, 8000, 'highpass');
        if (th.drums > 2 && sb % 4 === 2) this._noise(t, 0.05, 0.05, 5000, 'highpass');
      }
      this.nextTime += spb; this.step++;
    }
  }

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
