// =============================================================
// gfx.js — pixel art 100 % généré par le code (aucun asset externe)
// Chaque tuile / sprite est dessiné une fois dans un petit canvas
// puis mis en cache. Deux variantes pour les tuiles : « cendre » et « vert ».
// =============================================================
import { hash2, shade, mix, rng } from './util.js';

const cache = new Map();
function make(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function cached(key, w, h, draw) {
  let c = cache.get(key);
  if (!c) { c = make(w, h); const x = c.getContext('2d'); x.imageSmoothingEnabled = false; draw(x, w, h); cache.set(key, c); }
  return c;
}
const P = (x, X, Y, c) => { x.fillStyle = c; x.fillRect(X, Y, 1, 1); };
const R = (x, X, Y, w, h, c) => { x.fillStyle = c; x.fillRect(X, Y, w, h); };

// ------------------------------------------------------------------ Palettes
// Pour chaque thème : couleurs en mode « vert » (reverdi) et « cendre ».
const BASE = {
  village:    { g: ['#5fae4f', '#4f9a43', '#74c060'], ga: ['#6f6762', '#625a55', '#7d746d'], path: '#d2b277', water: '#3f95dc', wall: '#7b6a55', leaf: '#2f8a3e', alt: '#8acb5f', accent: '#e8d36a' },
  steppe:     { g: ['#8cc59a', '#7bb58b', '#a3d6ad'], ga: ['#949ca8', '#858d99', '#a6adb8'], path: '#e5e1d3', water: '#6fc3e6', wall: '#7e8a99', leaf: '#3b8c64', alt: '#d9f1f5', accent: '#bfe9ff' },
  bassin:     { g: ['#6fb556', '#5ea449', '#86c96a'], ga: ['#9a8466', '#8a7558', '#a89474'], path: '#cfb184', water: '#3d8ed4', wall: '#8a6e52', leaf: '#2e8040', alt: '#b9d77a', accent: '#a6e1ff' },
  mines:      { g: ['#b06a4a', '#9e5d41', '#c27d5a'], ga: ['#6e4234', '#5e382c', '#7e4e3e'], path: '#c9a07a', water: '#4aa0c8', wall: '#6b3d2c', leaf: '#4f8f3a', alt: '#d29a6e', accent: '#ffcf4a' },
  marais:     { g: ['#4f8f62', '#437f55', '#62a273'], ga: ['#585f48', '#4c523e', '#646b52'], path: '#9e8f6a', water: '#2f7d8c', wall: '#4b5a48', leaf: '#2f6e45', alt: '#7fbf7f', accent: '#79e7ff' },
  citadelle:  { g: ['#5aa17a', '#4c8f6b', '#6fb48c'], ga: ['#5c616b', '#50555e', '#6a707a'], path: '#a9b3c0', water: '#3aa0d8', wall: '#3d4350', leaf: '#2d7d52', alt: '#9ab0c4', accent: '#4affc8' },
  desert:     { g: ['#e3c27a', '#d6b36b', '#efd38d'], ga: ['#bba486', '#ad9678', '#c8b294'], path: '#f2dfae', water: '#43b5d6', wall: '#a27b52', leaf: '#5aa04a', alt: '#c9e6f0', accent: '#b98aff' },
  decharge:   { g: ['#7a9a4e', '#6b8a44', '#8fb05e'], ga: ['#6a5f55', '#5d534a', '#786c60'], path: '#a28f74', water: '#4790b8', wall: '#56493f', leaf: '#3f7f34', alt: '#b0a080', accent: '#ff9a4a' },
  forge:      { g: ['#67b25a', '#58a04d', '#7ec56e'], ga: ['#6d6359', '#60574e', '#7b7066'], path: '#c99a62', water: '#3c95d8', wall: '#7a5636', leaf: '#2f8a3e', alt: '#e0c27a', accent: '#ff7a3a' },
  sanctuaire: { g: ['#7ac6a0', '#69b48f', '#8fd6b2'], ga: ['#8a8498', '#7c768a', '#9892a6'], path: '#e8e4f2', water: '#58a8e8', wall: '#6f6a86', leaf: '#3a9a6e', alt: '#d6ccff', accent: '#ffe27a' },
  dungeon:    { g: ['#4b4f63', '#43475a', '#555a70'], ga: ['#4b4f63', '#43475a', '#555a70'], path: '#6b6f88', water: '#2f6fa8', wall: '#2a2c3a', leaf: '#3f7f5a', alt: '#7a7fa0', accent: '#8affc0' },
  cave:       { g: ['#5a4e48', '#4e4440', '#665a52'], ga: ['#5a4e48', '#4e4440', '#665a52'], path: '#7a6a5e', water: '#3a7fb0', wall: '#2e2622', leaf: '#4f8f5a', alt: '#8a7a6e', accent: '#ffe06a' },
};

export function palette(theme, green) {
  const b = BASE[theme] || BASE.village;
  if (green) return { ground: b.g, path: b.path, water: b.water, wall: b.wall, leaf: b.leaf, alt: b.alt, accent: b.accent, dead: false };
  return {
    ground: b.ga, path: mix(b.path, b.ga[0], 0.62), water: mix(b.water, '#5b5046', 0.75), wall: mix(b.wall, '#3e3632', 0.4),
    leaf: '#4a3f38', alt: mix(b.alt, b.ga[1], 0.62), accent: '#ff6a2a', dead: true,
  };
}
export const THEME_SKY = {
  ash: 'rgba(255,110,40,0.13)', green: 'rgba(255,255,200,0.0)',
};

// ------------------------------------------------------------------ Tuiles
/** Liste des types de tuiles. solid = bloque le passage. */
export const TILES = {
  G: { solid: 0 }, g: { solid: 0 }, P: { solid: 0 }, S: { solid: 0 }, F: { solid: 0 }, Y: { solid: 0 },
  W: { solid: 1, water: 1 }, D: { solid: 1 }, M: { solid: 1 }, T: { solid: 1 }, B: { solid: 1, cut: 1 },
  R: { solid: 1 }, X: { solid: 1 }, BR: { solid: 0 }, FL: { solid: 0 }, WL: { solid: 1 }, DR: { solid: 0 },
};

function groundBase(x, p, v) {
  R(x, 0, 0, 16, 16, p.ground[0]);
  for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
    const h = hash2(i, j, v * 31);
    if (h < 0.12) P(x, i, j, p.ground[1]); else if (h > 0.93) P(x, i, j, p.ground[2]);
  }
}

/** Dessine une tuile 16×16. v = variante (0..3), frame pour l'eau animée. */
export function tile(theme, green, kind, v = 0, frame = 0) {
  const key = `t:${theme}:${green ? 1 : 0}:${kind}:${v}:${kind === 'W' ? frame : 0}`;
  return cached(key, 16, 16, (x) => {
    const p = palette(theme, green);
    switch (kind) {
      case 'G': groundBase(x, p, v);
        if (!p.dead && v === 1) { P(x, 4, 5, shade(p.ground[0], 0.25)); P(x, 5, 4, shade(p.ground[0], 0.25)); P(x, 11, 10, shade(p.ground[0], 0.25)); }
        if (p.dead && v === 2) { P(x, 6, 6, '#3d3532'); P(x, 7, 6, '#3d3532'); P(x, 10, 11, '#ff7a3a'); }
        break;
      case 'g': R(x, 0, 0, 16, 16, p.ground[1]);
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) if (hash2(i, j, v + 99) < 0.18) P(x, i, j, p.ground[2]);
        break;
      case 'S': { const c = p.alt; R(x, 0, 0, 16, 16, c);
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const h = hash2(i, j, v + 7); if (h < 0.1) P(x, i, j, shade(c, -0.12)); else if (h > 0.95) P(x, i, j, shade(c, 0.15)); }
        if (theme === 'citadelle' || theme === 'dungeon' || theme === 'sanctuaire') { R(x, 0, 0, 16, 1, shade(c, -0.18)); R(x, 0, 0, 1, 16, shade(c, -0.18)); }
        break; }
      case 'P': R(x, 0, 0, 16, 16, p.path);
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const h = hash2(i, j, v + 3); if (h < 0.1) P(x, i, j, shade(p.path, -0.12)); else if (h > 0.94) P(x, i, j, shade(p.path, 0.12)); }
        break;
      case 'W': { R(x, 0, 0, 16, 16, p.water);
        const hl = shade(p.water, 0.25), dk = shade(p.water, -0.15);
        for (let j = 0; j < 16; j += 4) for (let i = 0; i < 16; i++) {
          const yy = (j + Math.round(Math.sin((i + frame * 2 + v * 3) * 0.6) * 1.2) + 16) % 16;
          if ((i + j + frame) % 7 < 3) P(x, i, yy, p.dead ? dk : hl);
        }
        if (p.dead) for (let i = 0; i < 6; i++) P(x, (v * 5 + i * 7) % 16, (i * 5 + v) % 16, '#7a6a3a');
        break; }
      case 'D': R(x, 0, 0, 16, 16, theme === 'dungeon' || theme === 'cave' ? '#0b0b12' : shade(p.water, -0.35));
        if (!(theme === 'dungeon' || theme === 'cave')) for (let i = 0; i < 5; i++) P(x, (v * 3 + i * 5) % 16, (i * 7 + frame) % 16, shade(p.water, -0.15));
        break;
      case 'M': case 'WL': { const c = p.wall; R(x, 0, 0, 16, 16, shade(c, -0.25));
        R(x, 1, 1, 14, 11, c);
        for (let i = 1; i < 15; i++) for (let j = 1; j < 12; j++) { const h = hash2(i, j, v + 5); if (h < 0.15) P(x, i, j, shade(c, 0.12)); else if (h > 0.9) P(x, i, j, shade(c, -0.15)); }
        R(x, 1, 1, 14, 1, shade(c, 0.22));
        if (kind === 'WL') { R(x, 0, 7, 16, 1, shade(c, -0.3)); R(x, 7, 0, 1, 7, shade(c, -0.3)); R(x, 3, 8, 1, 8, shade(c, -0.3)); R(x, 11, 8, 1, 8, shade(c, -0.3)); }
        if (!p.dead && kind === 'M' && v === 2) { P(x, 4, 2, p.leaf); P(x, 5, 2, p.leaf); P(x, 12, 3, p.leaf); }
        break; }
      case 'T': groundBase(x, p, v);
        if (p.dead) {
          R(x, 7, 6, 2, 9, '#3b302a'); R(x, 5, 4, 1, 4, '#3b302a'); R(x, 6, 7, 1, 1, '#3b302a'); R(x, 10, 3, 1, 5, '#3b302a'); R(x, 9, 6, 1, 1, '#3b302a');
          P(x, 4, 3, '#3b302a'); P(x, 11, 2, '#3b302a'); P(x, 8, 15, '#2a221e');
        } else {
          R(x, 7, 11, 2, 4, '#6b4a2b'); P(x, 6, 14, '#5a3c22'); P(x, 9, 14, '#5a3c22');
          const l = theme === 'desert' ? '#4f9a4a' : p.leaf;
          for (let i = 0; i < 16; i++) for (let j = 0; j < 12; j++) {
            const dx = i - 7.5, dy = j - 6; if (dx * dx / 42 + dy * dy / 32 < 1) P(x, i, j, hash2(i, j, v) < 0.25 ? shade(l, 0.18) : (dy > 2 ? shade(l, -0.15) : l));
          }
          if (v === 3) { P(x, 5, 5, '#ff5a5a'); P(x, 10, 7, '#ff5a5a'); }
        }
        break;
      case 'B': groundBase(x, p, v);
        for (let i = 0; i < 16; i++) for (let j = 3; j < 15; j++) {
          const dx = i - 7.5, dy = j - 9; if (dx * dx / 36 + dy * dy / 26 < 1) P(x, i, j, p.dead ? (hash2(i, j, 2) < 0.5 ? '#4d4038' : '#3a2f2a') : (hash2(i, j, v) < 0.2 ? shade(p.leaf, 0.3) : shade(p.leaf, 0.08)));
        }
        if (p.dead) { P(x, 5, 6, '#2a221e'); P(x, 10, 5, '#2a221e'); }
        break;
      case 'R': groundBase(x, p, v);
        for (let i = 2; i < 14; i++) for (let j = 4; j < 15; j++) {
          const dx = i - 8, dy = j - 10; if (dx * dx / 30 + dy * dy / 22 < 1) P(x, i, j, dy < -1 ? '#a8a29c' : hash2(i, j, 4) < 0.2 ? '#7d7670' : '#8f8882');
        }
        break;
      case 'F': groundBase(x, p, v);
        if (p.dead) { for (let k = 0; k < 4; k++) { const a = (v * 4 + k * 5) % 13 + 1, b = (k * 7 + v * 3) % 12 + 2; P(x, a, b, '#4a403a'); P(x, a, b - 1, '#3a302a'); } if (v % 2) P(x, 8, 8, '#ff7a3a'); }
        else { const cs = ['#ffdd55', '#ff6f91', '#ffffff', '#9ad0ff', '#ffa94d'];
          for (let k = 0; k < 4; k++) { const a = (v * 4 + k * 5) % 13 + 1, b = (k * 7 + v * 3) % 12 + 2; P(x, a, b + 1, shade(p.leaf, 0.1)); P(x, a, b, cs[(k + v) % 5]); } }
        break;
      case 'Y': groundBase(x, p, v); drawDeco(x, theme, p, v); break;
      case 'X': groundBase(x, p, v); drawObstacle(x, theme, p, v); break;
      case 'BR': R(x, 0, 0, 16, 16, p.water); R(x, 0, 2, 16, 12, '#8a5e36');
        for (let i = 0; i < 16; i += 4) R(x, i, 2, 1, 12, '#5e3f22'); R(x, 0, 2, 16, 1, '#a87a4a'); R(x, 0, 13, 16, 1, '#4a321c');
        break;
      case 'FL': { const c = p.path; R(x, 0, 0, 16, 16, shade(c, -0.08)); R(x, 0, 0, 16, 1, shade(c, -0.25)); R(x, 0, 0, 1, 16, shade(c, -0.25));
        if (hash2(v, 1, 3) < 0.4) P(x, 6, 7, shade(c, -0.2)); break; }
      case 'DR': R(x, 0, 0, 16, 16, '#000'); R(x, 2, 0, 12, 16, '#140f0c'); break;
    }
  });
}

function drawDeco(x, theme, p, v) {
  const d = p.dead;
  switch (theme) {
    case 'steppe': for (let k = 0; k < 3; k++) { const a = (v * 5 + k * 4) % 12 + 2, b = (k * 5 + v) % 10 + 4; R(x, a, b, 3, 1, d ? '#c9ccd1' : '#f4fbff'); } break;
    case 'mines': R(x, 0, 6, 16, 1, '#5a4a3a'); R(x, 0, 10, 16, 1, '#5a4a3a'); for (let i = 1; i < 16; i += 4) R(x, i, 5, 2, 7, '#7a5a3a'); break;
    case 'marais': for (let k = 0; k < 3; k++) { const a = 3 + k * 4 + (v % 2); R(x, a, 6 + k, 1, 8 - k, d ? '#5a5040' : '#5f9a4f'); P(x, a, 5 + k, d ? '#4a4032' : '#8a6a3a'); } break;
    case 'citadelle': R(x, 3, 3, 10, 10, shade(p.alt, -0.25)); for (let i = 4; i < 13; i += 2) R(x, i, 4, 1, 8, shade(p.alt, -0.45)); break;
    case 'desert': for (let k = 0; k < 3; k++) R(x, 1 + k * 2, 4 + k * 4, 10, 1, shade(p.ground[0], 0.12)); break;
    case 'decharge': for (let k = 0; k < 4; k++) R(x, (v * 3 + k * 4) % 13, (k * 5 + v * 2) % 13 + 1, 2, 2, ['#9a9a9a', '#5a8ac8', '#c85a5a', '#c8b45a'][k]); break;
    case 'forge': R(x, 1, 5, 14, 6, '#a0703a'); R(x, 1, 5, 14, 1, '#c08a4a'); R(x, 1, 8, 14, 1, '#7a5228'); break;
    case 'sanctuaire': R(x, 4, 4, 8, 8, shade(p.alt, -0.1)); R(x, 6, 6, 4, 4, d ? '#7a7590' : p.accent); break;
    default: for (let k = 0; k < 3; k++) { const a = (v * 5 + k * 4) % 12 + 2, b = (k * 5 + v) % 10 + 4; P(x, a, b, d ? '#4a403a' : shade(p.leaf, 0.2)); P(x, a + 1, b - 1, d ? '#4a403a' : shade(p.leaf, 0.3)); }
  }
}

function drawObstacle(x, theme, p, v) {
  const d = p.dead;
  switch (theme) {
    case 'steppe': // cristal de glace
      for (let j = 2; j < 15; j++) { const w = Math.max(1, 6 - Math.abs(j - 8)); R(x, 8 - w, j, w * 2, 1, j < 8 ? '#e8f8ff' : '#a8d8f0'); }
      R(x, 7, 2, 1, 12, '#ffffff'); break;
    case 'mines': // filon de minerai
      for (let i = 2; i < 14; i++) for (let j = 3; j < 15; j++) { const dx = i - 8, dy = j - 9; if (dx * dx + dy * dy < 30) P(x, i, j, hash2(i, j, v) < 0.15 ? p.accent : '#6a4a3a'); }
      break;
    case 'marais': // pylône
      R(x, 7, 1, 2, 15, '#4a4a52'); R(x, 3, 3, 10, 1, '#5a5a62'); R(x, 4, 6, 8, 1, '#5a5a62'); P(x, 3, 4, d ? '#ff4a2a' : '#4affc8'); P(x, 12, 4, d ? '#ff4a2a' : '#4affc8'); break;
    case 'citadelle': // baie de serveurs
      R(x, 2, 0, 12, 16, '#2a2f3a'); R(x, 3, 1, 10, 14, '#3a404d');
      for (let j = 2; j < 14; j += 3) { R(x, 4, j, 8, 2, '#1e222b'); P(x, 5, j, d ? '#ff5a3a' : '#4affc8'); P(x, 7, j, d ? '#ffa03a' : '#4aff7a'); }
      break;
    case 'desert': // cristal de silice / cactus
      if (d || v % 2) { for (let j = 3; j < 15; j++) { const w = Math.max(1, 5 - Math.abs(j - 9) / 1.5); R(x, 8 - w, j, w * 2, 1, j < 9 ? '#d8c8ff' : '#a88ae0'); } }
      else { R(x, 6, 3, 4, 12, '#3f9a4a'); R(x, 3, 6, 3, 2, '#3f9a4a'); R(x, 3, 4, 2, 3, '#3f9a4a'); R(x, 10, 8, 3, 2, '#3f9a4a'); R(x, 11, 5, 2, 4, '#3f9a4a'); P(x, 7, 5, '#ffef6a'); }
      break;
    case 'decharge': // tas de ferraille
      for (let i = 1; i < 15; i++) for (let j = 4; j < 16; j++) { const dx = i - 8, dy = j - 12; if (dx * dx / 50 + dy * dy / 70 < 1) P(x, i, j, ['#7a7a7a', '#5a5a62', '#8a6a4a', '#4a6a9a', '#9a4a4a'][Math.floor(hash2(i, j, v) * 5)]); }
      R(x, 5, 6, 6, 4, '#2a2a33'); R(x, 6, 7, 4, 2, d ? '#3a5a7a' : '#5aa0d0'); break;
    case 'forge': // caisse / enclume
      R(x, 2, 4, 12, 11, '#8a5a2a'); R(x, 2, 4, 12, 1, '#b07a3a'); R(x, 2, 9, 12, 1, '#6a4220'); R(x, 7, 4, 1, 11, '#6a4220'); break;
    case 'sanctuaire': // pilier
      R(x, 4, 0, 8, 16, '#cfcbe0'); R(x, 4, 0, 8, 2, '#efeaff'); R(x, 6, 2, 1, 13, '#a9a4c0'); R(x, 9, 2, 1, 13, '#a9a4c0'); break;
    case 'bassin': // souche
      R(x, 4, 8, 8, 7, '#6b4a2b'); R(x, 4, 8, 8, 2, '#a27a4a'); P(x, 7, 9, '#6b4a2b'); break;
    default: // clôture / puits
      R(x, 0, 6, 16, 2, '#8a6a42'); R(x, 0, 10, 16, 2, '#8a6a42'); R(x, 2, 4, 2, 11, '#6b4a2b'); R(x, 12, 4, 2, 11, '#6b4a2b');
  }
}

// ------------------------------------------------------------------ Personnages
/**
 * Humanoïde 16×16 générique (joueur + PNJ).
 * look = { skin, hair, hairStyle, top, bottom, hat, hatColor, beard, robe, cape, apron, glasses, prop }
 * dir : 0 bas, 1 haut, 2 gauche, 3 droite ; frame 0/1 ; act 'idle'|'walk'|'attack'|'shield'
 */
export function humanoid(look, dir = 0, frame = 0, act = 'walk') {
  const key = 'h:' + JSON.stringify(look) + dir + frame + act;
  return cached(key, 16, 16, (x) => {
    const L = Object.assign({ skin: '#f1c9a0', hair: '#5a3a22', hairStyle: 0, top: '#3a8a4a', bottom: '#5a4a3a', hat: null, hatColor: '#8a3a3a' }, look);
    const out = '#1b1420';
    const sk = L.skin, sks = shade(sk, -0.18);
    const walk = act === 'walk' ? frame : 0;
    // Jambes
    const legY = 12;
    if (!L.robe) {
      const l1 = walk ? 1 : 0, l2 = walk ? 0 : 1;
      R(x, 5, legY, 2, 3 - l1, L.bottom); R(x, 9, legY, 2, 3 - l2, L.bottom);
      R(x, 5, legY + 3 - l1, 2, 1, '#2a1e18'); R(x, 9, legY + 3 - l2, 2, 1, '#2a1e18');
    } else { R(x, 4, legY - 1, 8, 4, L.robe); R(x, 4, 14, 8, 1, shade(L.robe, -0.25)); if (walk) P(x, 5, 15, '#2a1e18'); else P(x, 10, 15, '#2a1e18'); }
    // Cape (derrière)
    if (L.cape && dir !== 1) { R(x, 4, 7, 8, 6, shade(L.cape, -0.2)); }
    // Corps
    R(x, 4, 7, 8, 5, L.top); R(x, 4, 7, 8, 1, shade(L.top, 0.15)); R(x, 4, 11, 8, 1, shade(L.top, -0.2));
    if (L.apron) R(x, 5, 8, 6, 4, L.apron);
    if (L.cape && dir === 1) R(x, 4, 7, 8, 6, L.cape);
    // Bras
    const armC = L.top;
    if (act === 'attack') {
      if (dir === 0) { R(x, 11, 9, 2, 4, armC); P(x, 11, 13, sk); }
      else if (dir === 1) { R(x, 3, 5, 2, 3, armC); }
      else if (dir === 2) { R(x, 1, 9, 4, 2, armC); P(x, 0, 9, sk); }
      else { R(x, 11, 9, 4, 2, armC); P(x, 15, 9, sk); }
    } else {
      const sw = walk ? 1 : 0;
      if (dir < 2) { R(x, 3, 8 + sw, 1, 3, armC); P(x, 3, 11 + sw, sk); R(x, 12, 9 - sw, 1, 3, armC); P(x, 12, 12 - sw, sk); }
      else { const ax = dir === 2 ? 6 : 9; R(x, ax, 8, 2, 3, shade(armC, -0.1)); P(x, ax, 11, sk); }
    }
    // Tête
    R(x, 4, 1, 8, 7, sk); R(x, 4, 7, 8, 1, sks);
    // Cheveux
    const hc = L.hair, hs = L.hairStyle;
    if (dir === 1) { R(x, 4, 1, 8, 6, hc); if (hs === 2) R(x, 5, 7, 6, 3, hc); }
    else {
      R(x, 4, 0, 8, 2, hc); R(x, 4, 2, 1, 3, hc); R(x, 11, 2, 1, 3, hc);
      if (hs === 1) { R(x, 4, 2, 8, 1, hc); }
      if (hs === 2) { R(x, 3, 2, 1, 6, hc); R(x, 12, 2, 1, 6, hc); }
      if (hs === 3) { P(x, 4, 0, sk); P(x, 11, 0, sk); R(x, 6, 0, 4, 1, sk); } // dégarni
      if (hs === 4) { R(x, 5, -1, 6, 2, hc); R(x, 7, 2, 4, 1, hc); }
      if (dir === 2) R(x, 9, 2, 3, 4, hc);
      if (dir === 3) R(x, 4, 2, 3, 4, hc);
      // Yeux
      if (dir === 0) { P(x, 6, 4, out); P(x, 9, 4, out); P(x, 7, 6, sks); P(x, 8, 6, sks); }
      if (dir === 2) { P(x, 5, 4, out); }
      if (dir === 3) { P(x, 10, 4, out); }
      if (L.glasses && dir !== 1) { R(x, 5, 4, 2, 1, '#cfe8ff'); R(x, 8, 4, 2, 1, '#cfe8ff'); if (dir === 0) P(x, 7, 4, '#333'); }
      if (L.beard) { R(x, 4, 6, 8, 2, L.beard); if (dir === 0) R(x, 6, 8, 4, 1, L.beard); }
    }
    // Chapeaux
    const hcx = L.hatColor;
    switch (L.hat) {
      case 'cap': R(x, 4, 0, 8, 2, hcx); if (dir === 0) R(x, 4, 2, 8, 1, shade(hcx, -0.2)); if (dir === 2) R(x, 2, 2, 3, 1, hcx); if (dir === 3) R(x, 11, 2, 3, 1, hcx); break;
      case 'hood': R(x, 3, 0, 10, 3, hcx); R(x, 3, 3, 1, 5, hcx); R(x, 12, 3, 1, 5, hcx); if (dir === 1) R(x, 4, 1, 8, 7, hcx); break;
      case 'helmet': R(x, 3, -1, 10, 3, hcx); R(x, 3, 2, 10, 1, shade(hcx, -0.2)); P(x, 7, 0, '#ffef8a'); P(x, 8, 0, '#ffef8a'); break;
      case 'wizard': R(x, 3, 1, 10, 1, hcx); R(x, 5, -1, 6, 2, hcx); break;
      case 'band': R(x, 4, 2, 8, 1, hcx); break;
      case 'crown': R(x, 4, 0, 8, 1, '#ffd84a'); P(x, 4, -1, '#ffd84a'); P(x, 7, -1, '#ffd84a'); P(x, 11, -1, '#ffd84a'); break;
      case 'leaf': R(x, 6, -1, 2, 2, '#4fbf5a'); P(x, 8, -1, '#7fdf6a'); break;
    }
    // Contour discret
    outline(x, 16, 16, out);
  });
}

function outline(x, w, h, col) {
  const img = x.getImageData(0, 0, w, h), d = img.data;
  const solid = (i, j) => i >= 0 && j >= 0 && i < w && j < h && d[(j * w + i) * 4 + 3] > 0;
  const add = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (solid(i, j)) continue;
    if (solid(i - 1, j) || solid(i + 1, j) || solid(i, j - 1) || solid(i, j + 1)) add.push([i, j]);
  }
  x.fillStyle = col; for (const [i, j] of add) x.fillRect(i, j, 1, 1);
}

/** Le joueur : tunique verte (vire au vert vif quand le monde reverdit). */
export function playerSprite(dir, frame, act, tunic = '#3f9a52') {
  return humanoid({ skin: '#f3cfa6', hair: '#6b3e1f', hairStyle: 4, top: tunic, bottom: '#6a4f3a', hat: 'leaf', cape: '#2e6b3c' }, dir, frame, act);
}

// ------------------------------------------------------------------ Créatures spéciales
export function creature(kind, frame = 0, dir = 0, tint = null) {
  const key = `c:${kind}:${frame}:${dir}:${tint}`;
  const big = { golemboss: 32, omnium: 48, gargantua: 32 }[kind] || 16;
  return cached(key, big, big, (x, w, h) => {
    const f = frame;
    const T = tint;
    switch (kind) {
      case 'cloud': { // fumerolle de gaz
        const c = T || '#8a8a92';
        const blobs = [[5, 9, 4], [10, 9, 4], [8, 6, 4], [7, 11, 3]];
        for (const [cx, cy, r] of blobs) for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) if ((i - cx) ** 2 + (j - cy - (f ? 1 : 0)) ** 2 < r * r) P(x, i, j, hash2(i, j, 1) < 0.2 ? shade(c, 0.2) : c);
        P(x, 6, 8 + f, '#1b1420'); P(x, 10, 8 + f, '#1b1420'); R(x, 7, 11 + f, 3, 1, '#1b1420');
        break; }
      case 'blob': { // obésiciel
        const c = T || '#ff8acb'; const sq = f ? 1 : 0;
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const dx = (i - 8) / (6 + sq), dy = (j - 10 - sq) / (5 - sq); if (dx * dx + dy * dy < 1) P(x, i, j, dy < -0.4 ? shade(c, 0.25) : c); }
        P(x, 6, 9, '#1b1420'); P(x, 10, 9, '#1b1420'); R(x, 7, 12, 3, 1, shade(c, -0.4)); P(x, 5, 6, '#fff');
        break; }
      case 'ghost': { const c = T || '#c9b8ff';
        for (let i = 3; i < 13; i++) for (let j = 2; j < 14; j++) { const dx = (i - 8) / 5, dy = (j - 7) / 5; if (dx * dx + dy * dy < 1 || (j > 7 && j < 14 && (j < 13 || (i + f) % 3))) P(x, i, j, c); }
        R(x, 6, 6, 1, 2, '#1b1420'); R(x, 9, 6, 1, 2, '#1b1420'); R(x, 7, 10, 2, 1, shade(c, -0.4));
        break; }
      case 'golem': { const c = T || '#8a6a5a';
        R(x, 3, 4, 10, 9, c); R(x, 3, 4, 10, 2, shade(c, 0.2)); R(x, 1, 6 + f, 2, 5, shade(c, -0.1)); R(x, 13, 6 + (1 - f), 2, 5, shade(c, -0.1));
        R(x, 4, 13, 3, 3, shade(c, -0.2)); R(x, 9, 13, 3, 3, shade(c, -0.2)); P(x, 6, 7, '#ffcf4a'); P(x, 9, 7, '#ffcf4a'); P(x, 5, 10, '#ffcf4a'); P(x, 11, 5, '#4af');
        break; }
      case 'rat': { const c = T || '#6a6a72';
        R(x, 3, 8, 9, 5, c); R(x, 11, 7, 3, 4, c); P(x, 13, 8, '#ff3a3a'); R(x, 0, 10 + f, 3, 1, '#c88a9a'); R(x, 4, 13, 1, 2 - f, '#333'); R(x, 9, 13, 1, 1 + f, '#333');
        R(x, 5, 6, 4, 2, '#3aff6a'); R(x, 6, 5, 2, 1, '#ddd');
        break; }
      case 'zombie': { const look = { skin: '#9fbf8a', hair: '#3a4a2a', top: '#5a5a7a', bottom: '#3a3a4a', hairStyle: 3 };
        x.drawImage(humanoid(look, 0, f, 'walk'), 0, 0); R(x, 2, 8, 12, 4, '#f2f2f2'); x.fillStyle = '#c03030'; x.font = 'bold 5px monospace'; x.fillText('404', 3, 12);
        break; }
      case 'suit': { // greenwasheur
        const look = { skin: '#f0c8a0', hair: '#222', top: '#2f3a4f', bottom: '#222a3a', hairStyle: 1, apron: null };
        x.drawImage(humanoid(look, dir, f, 'walk'), 0, 0); R(x, 7, 8, 2, 3, '#3fbf4f'); R(x, 12, 9 - f, 3, 4, '#5aff6a'); R(x, 12, 9 - f, 3, 1, '#2a8a3a');
        break; }
      case 'lumber': { const look = { skin: '#e8b890', hair: '#8a3a1a', beard: '#8a3a1a', top: '#c03a3a', bottom: '#3a4a7a', hat: 'cap', hatColor: '#3a3a3a' };
        x.drawImage(humanoid(look, dir, f, f ? 'attack' : 'walk'), 0, 0); R(x, 13, 4, 1, 8, '#7a5a3a'); R(x, 12, 3, 3, 3, '#bbb');
        break; }
      case 'jelly': { const c = T || '#7fd8ff';
        for (let i = 3; i < 13; i++) for (let j = 2; j < 9; j++) { const dx = (i - 8) / 5, dy = (j - 8) / 6; if (dx * dx + dy * dy < 1) P(x, i, j, c); }
        for (let k = 0; k < 4; k++) R(x, 4 + k * 2 + (k % 2 ? f : 0), 9, 1, 5 + (k + f) % 2, shade(c, -0.15));
        P(x, 6, 6, '#fff'); P(x, 10, 6, '#fff'); R(x, 7, 3, 2, 1, '#fff'); x.fillStyle = '#1b5a8a'; x.font = 'bold 4px monospace'; x.fillText('5G', 6, 5);
        break; }
      case 'flame': { const c = T || '#ff7a2a';
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const dx = (i - 8) / 5, dy = (j - 10) / 5; if (dx * dx + dy * dy < 1 || (j < 10 && Math.abs(i - 8 + Math.sin(j + f * 2)) < (j - 2) / 2)) P(x, i, j, j < 8 ? '#ffd84a' : c); }
        P(x, 6, 10, '#1b1420'); P(x, 10, 10, '#1b1420');
        break; }
      case 'spam': { // enveloppe chauve-souris
        R(x, 4, 6, 8, 6, '#f0f0f0'); R(x, 4, 6, 8, 1, '#ccc'); P(x, 5, 7, '#c33'); P(x, 10, 7, '#c33'); R(x, 7, 9, 2, 1, '#c33');
        const wy = f ? 4 : 8; R(x, 0, wy, 4, 2, '#5a3a7a'); R(x, 12, wy, 4, 2, '#5a3a7a');
        break; }
      case 'printer': R(x, 2, 5, 12, 8, '#d8d8d8'); R(x, 2, 5, 12, 2, '#f0f0f0'); R(x, 4, 2 - f, 8, 4, '#fff'); R(x, 3, 10, 10, 2, '#333');
        for (let i = 4; i < 12; i += 2) P(x, i, 11 + f, '#fff'); P(x, 5, 8, '#f33'); P(x, 10, 8, '#f33'); R(x, 3, 13, 2, 2, '#555'); R(x, 11, 13, 2, 2, '#555'); break;
      case 'cart': R(x, 2, 6, 12, 6, '#7a5a3a'); R(x, 2, 6, 12, 1, '#a07a4a'); R(x, 3, 3, 10, 3, '#c97a4a'); P(x, 5, 4, '#ffcf4a'); P(x, 9, 3, '#ffcf4a');
        R(x, 3, 12, 3, 3, '#333'); R(x, 10, 12, 3, 3, '#333'); P(x, 4 + f, 13, '#888'); P(x, 11 + f, 13, '#888'); P(x, 6, 8, '#fff'); P(x, 10, 8, '#fff'); break;
      case 'gear': { const c = T || '#a08a6a';
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const a = Math.atan2(j - 8, i - 8) + f * 0.4, r = Math.hypot(i - 8, j - 8); if (r < 5 || (r < 7 && Math.cos(a * 6) > 0.3)) P(x, i, j, r < 2 ? '#333' : c); }
        P(x, 6, 6, '#ff3a3a'); P(x, 10, 6, '#ff3a3a');
        break; }
      case 'eye': { // tracker
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const dx = (i - 8) / 7, dy = (j - 8) / 4.5; if (dx * dx + dy * dy < 1) P(x, i, j, '#f2f2f2'); }
        R(x, 6 + f, 6, 4, 4, '#3a6aff'); R(x, 7 + f, 7, 2, 2, '#111'); R(x, 0, 7, 2, 1, '#8a3a3a'); R(x, 14, 7, 2, 1, '#8a3a3a');
        break; }
      case 'carousel': R(x, 2, 3, 12, 10, '#ffd84a'); R(x, 3, 4, 10, 8, ['#ff6a6a', '#6aaaff', '#6aff8a'][f % 3]); R(x, 0, 7, 2, 2, '#333'); R(x, 14, 7, 2, 2, '#333'); P(x, 6, 7, '#fff'); P(x, 9, 7, '#fff'); break;
      case 'robot': // Holo
        R(x, 4, 2, 8, 6, '#c9d6de'); R(x, 5, 3, 6, 3, '#1b2a3a'); P(x, 6, 4, f ? '#4affc8' : '#2ac8a0'); P(x, 9, 4, f ? '#4affc8' : '#2ac8a0');
        R(x, 7, 0, 2, 2, '#8a9aa6'); P(x, 7, 0, '#ffd84a'); R(x, 3, 8, 10, 5, '#a9b6be'); R(x, 4, 9, 8, 2, '#3a7aff'); R(x, 5, 9, 6, 1, '#7aaaff');
        R(x, 5, 13, 2, 2, '#6a7680'); R(x, 9, 13, 2, 2, '#6a7680'); R(x, 1, 9 + f, 2, 3, '#8a9aa6'); R(x, 13, 9 + (1 - f), 2, 3, '#8a9aa6');
        outline(x, 16, 16, '#1b1420'); break;
      case 'dog': R(x, 3, 7, 9, 5, '#c08a4a'); R(x, 10, 4, 5, 5, '#c08a4a'); R(x, 13, 6, 2, 2, '#2a1a10'); P(x, 12, 5, '#111'); R(x, 10, 3, 2, 3, '#7a4a2a');
        R(x, 1, 6 - f, 2, 2, '#c08a4a'); R(x, 4, 12, 2, 3 - f, '#a0703a'); R(x, 9, 12, 2, 2 + f, '#a0703a'); R(x, 5, 8, 4, 2, '#e04a4a');
        outline(x, 16, 16, '#1b1420'); break;
      case 'golemboss': { // Golem Obésiciel 32×32
        const c = '#ff8acb';
        for (let i = 0; i < 32; i++) for (let j = 0; j < 32; j++) { const dx = (i - 16) / (14 + f), dy = (j - 19) / (12 - f); if (dx * dx + dy * dy < 1) P(x, i, j, dy < -0.5 ? shade(c, 0.25) : hash2(i, j, 5) < 0.06 ? '#ffd0ea' : c); }
        R(x, 10, 15, 3, 3, '#1b1420'); R(x, 19, 15, 3, 3, '#1b1420'); R(x, 12, 23, 8, 2, '#8a2a5a');
        x.fillStyle = '#5a1a3a'; x.font = 'bold 6px monospace'; x.fillText('Ko', 13, 12);
        break; }
      case 'omnium': { // Boss final 48×48
        for (let i = 0; i < 48; i++) for (let j = 0; j < 48; j++) { const r = Math.hypot(i - 24, j - 24); if (r < 22) P(x, i, j, r > 19 ? '#2a2a33' : r > 14 ? (Math.cos(Math.atan2(j - 24, i - 24) * 8 + f) > 0 ? '#5a5a6a' : '#3a3a48') : '#1b1b24'); }
        for (let i = 0; i < 48; i++) for (let j = 0; j < 48; j++) { const r = Math.hypot(i - 24, j - 24); if (r < 9) P(x, i, j, r < 4 ? '#fff' : r < 7 ? '#ff3a2a' : '#ff9a2a'); }
        R(x, 22 + f, 22, 4, 4, '#111');
        break; }
      case 'seed': // graine-mère
        for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const dx = (i - 8) / 4.5, dy = (j - 9) / 5.5; if (dx * dx + dy * dy < 1) P(x, i, j, dy < -0.3 ? '#9aff7a' : '#4fbf4a'); }
        R(x, 8, 2, 1, 3, '#2f8a3e'); R(x, 9, 2, 3, 2, '#7fdf6a'); P(x, 6, 7, '#eaffd8');
        break;
    }
  });
}

// ------------------------------------------------------------------ Objets / icônes
export function icon(name) {
  return cached('i:' + name, 16, 16, (x) => {
    switch (name) {
      case 'baton': R(x, 7, 2, 2, 13, '#8a5a2a'); R(x, 6, 1, 4, 3, '#4fbf4a'); P(x, 5, 2, '#7fdf6a'); P(x, 10, 2, '#7fdf6a'); break;
      case 'bouclier': for (let j = 1; j < 15; j++) { const w = j < 9 ? 6 : 6 - (j - 9); R(x, 8 - w, j, w * 2, 1, j < 3 ? '#cfe8ff' : '#3a7aff'); } R(x, 7, 3, 2, 9, '#ffd84a'); R(x, 4, 6, 8, 2, '#ffd84a'); break;
      case 'lanterne': R(x, 6, 1, 4, 2, '#555'); R(x, 4, 3, 8, 10, '#ffd84a'); R(x, 5, 4, 6, 8, '#fff6b0'); R(x, 4, 13, 8, 2, '#555'); P(x, 7, 7, '#ff9a2a'); P(x, 8, 8, '#ff9a2a'); break;
      case 'grappin': R(x, 2, 12, 9, 2, '#4a8aff'); for (let k = 0; k < 6; k++) P(x, 9 + Math.floor(k / 2), 11 - k, '#4a8aff'); R(x, 11, 2, 3, 3, '#ccc'); P(x, 10, 1, '#ccc'); P(x, 14, 1, '#ccc'); break;
      case 'lentille': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const r = Math.hypot(i - 7, j - 7); if (r < 5.5) P(x, i, j, r > 4 ? '#8a6a3a' : r < 2 ? '#fff' : '#9adfff'); } R(x, 10, 10, 2, 5, '#6a4a2a'); R(x, 11, 12, 3, 2, '#6a4a2a'); break;
      case 'cristal': for (let j = 1; j < 15; j++) { const w = Math.max(1, 5 - Math.abs(j - 7) * 0.7); R(x, 8 - w, j, w * 2, 1, j < 7 ? '#d8f8ff' : '#7ad8ff'); } P(x, 7, 4, '#fff'); break;
      case 'pinces': R(x, 3, 9, 3, 6, '#c03a3a'); R(x, 10, 9, 3, 6, '#c03a3a'); R(x, 5, 3, 2, 7, '#aaa'); R(x, 9, 3, 2, 7, '#aaa'); R(x, 6, 2, 1, 2, '#ddd'); R(x, 9, 2, 1, 2, '#ddd'); P(x, 8, 8, '#555'); break;
      case 'plan': R(x, 2, 3, 12, 10, '#3a6aaa'); R(x, 2, 3, 12, 1, '#6a9ae0'); for (let i = 4; i < 13; i += 3) R(x, i, 5, 1, 7, '#9ac8ff'); R(x, 3, 8, 10, 1, '#9ac8ff'); break;
      case 'graine': x.drawImage(creature('seed'), 0, 0); break;
      case 'fruit': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) if ((i - 8) ** 2 + (j - 9) ** 2 < 22) P(x, i, j, (i < 7 && j < 8) ? '#ff8a8a' : '#e83a3a'); R(x, 8, 2, 1, 3, '#6a4a2a'); R(x, 9, 3, 3, 2, '#4fbf4a'); break;
      case 'coin': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) if ((i - 8) ** 2 / 9 + (j - 8) ** 2 / 25 < 1) P(x, i, j, i < 7 ? '#d8ff9a' : '#7fcf4a'); R(x, 8, 4, 1, 8, '#4f9a3a'); break;
      case 'heart': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const a = (i - 5) ** 2 + (j - 6) ** 2 < 10, b = (i - 11) ** 2 + (j - 6) ** 2 < 10, c = j >= 6 && j < 14 && Math.abs(i - 8) < (14 - j); if (a || b || c) P(x, i, j, '#4fd65a'); } P(x, 4, 5, '#c8ffb0'); break;
      case 'leaf_full': leaf(x, '#4fd65a', '#2f9a3e'); break;
      case 'leaf_half': leaf(x, '#4fd65a', '#2f9a3e', true); break;
      case 'leaf_empty': leaf(x, '#3a3330', '#2a2320'); break;
      case 'scroll': R(x, 3, 3, 10, 10, '#f2e2b0'); R(x, 2, 2, 12, 2, '#c8a86a'); R(x, 2, 12, 12, 2, '#c8a86a'); for (let j = 5; j < 11; j += 2) R(x, 5, j, 6, 1, '#8a6a3a'); break;
      case 'kit': R(x, 2, 5, 12, 9, '#c03a3a'); R(x, 6, 3, 4, 2, '#888'); R(x, 7, 7, 2, 5, '#fff'); R(x, 5, 9, 6, 1, '#fff'); break;
      case 'quest': R(x, 6, 1, 4, 9, '#ffd84a'); R(x, 6, 12, 4, 3, '#ffd84a'); break;
      case 'talk': R(x, 2, 3, 12, 8, '#fff'); P(x, 4, 11, '#fff'); R(x, 4, 12, 2, 1, '#fff'); for (let i = 4; i < 12; i += 3) P(x, i, 7, '#333'); break;
      default: R(x, 4, 4, 8, 8, '#f0f');
    }
  });
}
function leaf(x, c, d, half) {
  for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const dx = (i - 8) / 5, dy = (j - 8) / 7; const rot = dx + dy * 0.3; if (rot * rot + dy * dy < 1) P(x, i, j, half && i > 8 ? '#3a3330' : (i < 8 ? shade(c, 0.15) : c)); }
  for (let j = 3; j < 14; j++) P(x, 8, j, d); P(x, 8, 15, d);
}

// ------------------------------------------------------------------ Décors (props)
/** Props multi-tuiles. green = 0..1. variant pour la couleur. */
export function prop(kind, green = 1, variant = 0, frame = 0) {
  const g = green > 0.5 ? 1 : 0;
  const key = `p:${kind}:${g}:${variant}:${frame}`;
  const size = { house: [48, 48], temple: [64, 56], tree: [64, 80], obelisk: [16, 32], monolith: [16, 32], stele: [16, 16], chest: [16, 16], chestopen: [16, 16],
    mural: [32, 24], pedestal: [16, 16], altar: [32, 24], warp: [16, 16], arcade: [16, 24], stall: [32, 32], sign: [16, 16], cave: [32, 24],
    gate_fog: [16, 16], gate_rune: [16, 16], gate_chasm: [16, 16], gate_door: [16, 16], gate_mirage: [16, 16], gate_hallu: [16, 16], gate_dark: [16, 16], gate_bridge: [16, 16], gate_log: [16, 16], gate_boss: [16, 16],
    door: [16, 16], pot: [16, 16], tower: [32, 64], rack: [16, 32], crane: [48, 64], well: [32, 32], anvil: [16, 16], book: [16, 16], screen: [32, 24], heatpipe: [16, 16], dish: [32, 32] }[kind] || [16, 16];
  return cached(key, size[0], size[1], (x, w, h) => drawProp(x, w, h, kind, g, variant, frame));
}

function drawProp(x, w, h, kind, g, v, f) {
  const roofs = ['#c0503a', '#3a6aaa', '#7a4aaa', '#c08a3a', '#3a8a6a', '#aa3a6a'];
  switch (kind) {
    case 'house': {
      const roof = g ? roofs[v % roofs.length] : '#5a4a44', wall = g ? '#efe0c0' : '#9a8e80';
      R(x, 4, 20, 40, 26, wall); R(x, 4, 44, 40, 2, shade(wall, -0.3));
      for (let j = 0; j < 20; j++) R(x, 2 + j * 0.0, 2 + j, 44, 1, j % 4 === 0 ? shade(roof, -0.2) : roof);
      R(x, 2, 20, 44, 2, shade(roof, -0.35));
      R(x, 20, 30, 8, 16, g ? '#7a4a2a' : '#3a2a22'); P(x, 26, 38, '#ffd84a');
      R(x, 8, 26, 8, 7, g ? '#9adfff' : '#4a4440'); R(x, 32, 26, 8, 7, g ? '#9adfff' : '#4a4440');
      R(x, 11, 26, 1, 7, wall); R(x, 35, 26, 1, 7, wall);
      if (!g) { R(x, 30, 4, 8, 6, '#2a2220'); P(x, 34, 2, '#ff6a2a'); R(x, 9, 29, 3, 1, '#2a2220'); }
      else { for (let i = 6; i < 18; i += 3) { P(x, i, 45, '#ff6f91'); P(x, i + 26, 45, '#ffdd55'); } R(x, 36, 0, 4, 6, '#8a6a5a'); }
      outline(x, w, h, '#1b1420'); break; }
    case 'temple': {
      const st = g ? '#d8d0c0' : '#8a8078', dk = shade(st, -0.3);
      R(x, 2, 18, 60, 36, st); R(x, 0, 12, 64, 8, shade(st, 0.1));
      for (let i = 0; i < 32; i++) R(x, 32 - i, 12 - i * 0.37, i * 2, 1, shade(st, 0.05));
      for (let c = 6; c < 60; c += 12) { R(x, c, 20, 5, 32, shade(st, 0.12)); R(x, c + 4, 20, 1, 32, dk); }
      R(x, 24, 30, 16, 24, '#120c10'); R(x, 22, 28, 20, 3, dk);
      P(x, 31, 6, g ? '#4affc8' : '#ff5a2a'); P(x, 32, 6, g ? '#4affc8' : '#ff5a2a');
      if (!g) { R(x, 44, 16, 6, 4, '#3a3230'); R(x, 10, 40, 4, 2, '#3a3230'); }
      outline(x, w, h, '#1b1420'); break; }
    case 'tree': { // Arbre-Mère : v = stade 0..9
      const st = v; const trunk = st === 0 ? '#2e2420' : '#6b4a2b';
      R(x, 26, 40, 12, 38, trunk); R(x, 22, 72, 20, 6, trunk); R(x, 18, 76, 28, 4, shade(trunk, -0.2));
      R(x, 30, 44, 2, 30, shade(trunk, -0.25)); R(x, 34, 50, 1, 20, shade(trunk, 0.15));
      // branches
      R(x, 14, 34, 14, 3, trunk); R(x, 36, 30, 16, 3, trunk); R(x, 12, 26, 3, 10, trunk); R(x, 50, 22, 3, 10, trunk); R(x, 30, 18, 4, 24, trunk);
      if (st > 0) {
        const leafC = ['#3f8a3a', '#4f9a43', '#5aaa4a', '#64b852', '#6fc35a', '#7acd62', '#86d66a', '#92de72', '#9de67a'][st - 1];
        const rr = rng(7);
        const n = st * 70;
        for (let k = 0; k < n; k++) {
          const a = rr() * Math.PI * 2, r = Math.sqrt(rr()) * (10 + st * 2.4);
          const cx = 32 + Math.cos(a) * r * 1.3, cy = 26 + Math.sin(a) * r * 0.85;
          const s = 2 + Math.floor(rr() * 2);
          R(x, Math.round(cx), Math.round(cy), s, s, rr() < 0.25 ? shade(leafC, 0.2) : rr() < 0.2 ? shade(leafC, -0.2) : leafC);
        }
        if (st >= 6) for (let k = 0; k < (st - 5) * 10; k++) { const a = rr() * 6.28, r = rr() * 26; P(x, Math.round(32 + Math.cos(a) * r * 1.2), Math.round(26 + Math.sin(a) * r * 0.8), ['#ff9ad0', '#fff', '#ffdd55'][k % 3]); }
      } else { P(x, 20, 30, '#ff6a2a'); P(x, 44, 26, '#ff6a2a'); P(x, 31, 60, '#ff6a2a'); }
      outline(x, w, h, '#1b1420'); break; }
    case 'obelisk': {
      const ok = v === 1; const st = '#5a5470';
      R(x, 3, 4, 10, 27, st); for (let j = 0; j < 4; j++) R(x, 4 + j, j, 8 - j * 2, 1, st); R(x, 2, 29, 12, 3, shade(st, -0.3));
      R(x, 6, 8, 4, 16, ok ? '#4affa0' : '#ff4a2a'); R(x, 7, 9, 2, 14, ok ? '#c8ffe0' : '#ffb07a');
      if (!ok) { R(x, 4, 12, 3, 1, '#1b1420'); R(x, 9, 18, 3, 1, '#1b1420'); P(x, 6, 13, '#1b1420'); }
      outline(x, w, h, '#1b1420'); break; }
    case 'monolith': { // pierre de projection
      R(x, 2, 2, 12, 28, '#4a4658'); R(x, 2, 2, 12, 2, '#6a6680'); R(x, 4, 6, 8, 10, '#0f1a2a');
      R(x, 5, 7, 6, 8, f ? '#2a5aff' : '#1a3aaa'); P(x, 7, 10, '#fff'); P(x, 8, 11, '#fff'); P(x, 7, 12, '#fff'); R(x, 1, 28, 14, 3, '#3a3648');
      outline(x, w, h, '#1b1420'); break; }
    case 'stele': R(x, 3, 2, 10, 13, '#8a8698'); R(x, 3, 2, 10, 2, '#aaa6b8'); for (let j = 6; j < 13; j += 2) R(x, 5, j, 6, 1, '#5a5668'); R(x, 2, 14, 12, 2, '#5a5668'); outline(x, w, h, '#1b1420'); break;
    case 'sign': R(x, 7, 8, 2, 8, '#6b4a2b'); R(x, 2, 2, 12, 7, '#a87a4a'); R(x, 2, 2, 12, 1, '#c89a5a'); for (let i = 4; i < 12; i += 3) R(x, i, 5, 2, 1, '#5a3a1a'); outline(x, w, h, '#1b1420'); break;
    case 'chest': R(x, 2, 5, 12, 9, '#a0602a'); R(x, 2, 5, 12, 3, '#c07a3a'); R(x, 2, 8, 12, 1, '#ffd84a'); R(x, 7, 7, 2, 3, '#ffd84a'); R(x, 2, 13, 12, 1, '#5a3010'); outline(x, w, h, '#1b1420'); break;
    case 'chestopen': R(x, 2, 7, 12, 7, '#a0602a'); R(x, 2, 2, 12, 4, '#7a4a20'); R(x, 3, 7, 10, 2, '#2a1a10'); R(x, 2, 13, 12, 1, '#5a3010'); outline(x, w, h, '#1b1420'); break;
    case 'mural': R(x, 0, 0, 32, 22, '#6a4a2a'); R(x, 2, 2, 28, 18, '#f2e8d0');
      for (let i = 4; i < 28; i += 4) { const hh = 3 + ((i * 7 + v * 3) % 12); R(x, i, 18 - hh, 3, hh, ['#c03a3a', '#3a7aff', '#3aaa5a', '#ffaa3a'][(i / 4 + v) % 4]); }
      R(x, 4, 18, 24, 1, '#333'); R(x, 6, 22, 2, 2, '#4a3220'); R(x, 24, 22, 2, 2, '#4a3220'); outline(x, w, h, '#1b1420'); break;
    case 'pedestal': R(x, 3, 6, 10, 9, '#6a6680'); R(x, 2, 5, 12, 2, '#8a86a0'); R(x, 2, 14, 12, 2, '#4a4660');
      R(x, 6, 1 + (f ? 0 : 1), 4, 4, v === 1 ? '#4affa0' : '#ffd84a'); P(x, 7, 2 + (f ? 0 : 1), '#fff'); outline(x, w, h, '#1b1420'); break;
    case 'altar': R(x, 2, 10, 28, 12, '#8a8698'); R(x, 0, 8, 32, 3, '#aaa6b8'); R(x, 0, 20, 32, 3, '#5a5668');
      for (let i = 4; i < 28; i += 6) R(x, i, 13, 3, 5, '#6a6680'); R(x, 12, 2, 8, 7, v ? '#4fbf4a' : '#3a3230'); outline(x, w, h, '#1b1420'); break;
    case 'warp': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const r = Math.hypot(i - 8, (j - 9) * 1.6); if (r < 7.5) P(x, i, j, r > 6 ? '#6b4a2b' : v ? (Math.cos(r * 1.2 - f) > 0 ? '#7fffb0' : '#3fbf7a') : '#3a3230'); } outline(x, w, h, '#1b1420'); break;
    case 'arcade': R(x, 2, 0, 12, 24, '#3a2a6a'); R(x, 3, 3, 10, 8, '#0a0a1a'); R(x, 4, 4, 8, 6, f ? '#3aff6a' : '#2ac85a'); R(x, 2, 13, 12, 3, '#5a4a8a'); P(x, 5, 14, '#f33'); P(x, 9, 14, '#ff3'); P(x, 11, 14, '#3af'); outline(x, w, h, '#1b1420'); break;
    case 'stall': R(x, 2, 14, 28, 16, '#a87a4a'); for (let i = 0; i < 32; i += 4) R(x, i, 4, 4, 8, i % 8 ? '#fff' : (g ? '#c03a3a' : '#6a5a54')); R(x, 0, 12, 32, 2, '#7a4a2a'); R(x, 2, 12, 2, 18, '#6b4a2b'); R(x, 28, 12, 2, 18, '#6b4a2b'); outline(x, w, h, '#1b1420'); break;
    case 'cave': R(x, 0, 6, 32, 18, '#5a4e48'); for (let i = 0; i < 16; i++) R(x, 16 - i, 6 - i * 0.35, i * 2, 1, '#6a5e58'); R(x, 9, 10, 14, 14, '#0b0808'); outline(x, w, h, '#1b1420'); break;
    case 'gate_fog': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const n = hash2(i + f, j, 3); if (n < 0.75) P(x, i, j, n < 0.3 ? '#d8d0e8' : '#a8a0b8'); } break;
    case 'gate_rune': R(x, 0, 0, 16, 16, '#3a3654'); R(x, 1, 1, 14, 14, '#4a4670'); R(x, 6, 3, 4, 10, '#9a8aff'); R(x, 3, 6, 10, 4, '#9a8aff'); P(x, 7, 7, '#fff'); break;
    case 'gate_chasm': R(x, 0, 0, 16, 16, '#0b0808'); for (let i = 0; i < 16; i += 3) P(x, i, (i * 5) % 16, '#2a2020'); R(x, 0, 0, 16, 2, '#4a3a30'); break;
    case 'gate_door': R(x, 1, 0, 14, 16, '#5a3a22'); R(x, 2, 1, 12, 14, '#7a5230'); R(x, 3, 3, 10, 2, '#555'); R(x, 3, 11, 10, 2, '#555'); R(x, 9, 6, 6, 4, '#8a2a2a'); P(x, 11, 7, '#ffd84a'); break;
    case 'gate_mirage': for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) P(x, i, j, Math.sin(i * 0.8 + j * 0.4 + f) > 0 ? 'rgba(200,170,255,0.75)' : 'rgba(255,230,180,0.6)'); break;
    case 'gate_hallu': R(x, 0, 0, 16, 16, '#2a1a3a'); for (let k = 0; k < 6; k++) R(x, (k * 5 + f * 3) % 14, (k * 3) % 14, 3, 2, ['#ff4af0', '#4afff0', '#ffe04a'][k % 3]); break;
    case 'gate_dark': R(x, 0, 0, 16, 16, '#050508'); P(x, 5, 7, '#ff2a2a'); P(x, 9, 7, '#ff2a2a'); break;
    case 'gate_bridge': R(x, 0, 0, 16, 16, '#3d8ed4'); R(x, 0, 2, 5, 12, '#5a3e22'); R(x, 11, 2, 5, 12, '#5a3e22'); R(x, 6, 10, 2, 2, '#5a3e22'); break;
    case 'gate_log': R(x, 0, 4, 16, 9, '#6b4a2b'); R(x, 0, 4, 16, 2, '#8a6a42'); R(x, 0, 11, 16, 2, '#4a321c'); for (let i = 0; i < 16; i += 5) P(x, i, 8, '#3a2a1a'); break;
    case 'gate_boss': R(x, 0, 0, 16, 16, '#2a1a1a'); R(x, 1, 1, 14, 14, '#5a1a1a'); for (let k = 0; k < 8; k++) P(x, 4 + (k % 4) * 2, 4 + Math.floor(k / 4) * 6, '#4fbf4a'); R(x, 6, 6, 4, 4, '#ff3a2a'); break;
    case 'door': R(x, 2, 0, 12, 16, '#0b0808'); R(x, 0, 0, 2, 16, '#5a5668'); R(x, 14, 0, 2, 16, '#5a5668'); R(x, 0, 0, 16, 2, '#7a7690'); break;
    case 'pot': R(x, 4, 5, 8, 9, '#b0683a'); R(x, 5, 3, 6, 2, '#904a2a'); R(x, 4, 7, 8, 1, '#d08a4a'); outline(x, w, h, '#1b1420'); break;
    case 'tower': R(x, 6, 10, 20, 54, '#6a5a4a'); R(x, 2, 2, 28, 10, '#8a6a4a'); R(x, 10, 4, 12, 6, '#0b0808'); for (let j = 16; j < 60; j += 8) R(x, 6, j, 20, 1, '#4a3a2a'); R(x, 12, 50, 8, 14, '#2a1a10'); outline(x, w, h, '#1b1420'); break;
    case 'rack': R(x, 1, 0, 14, 32, '#2a2f3a'); for (let j = 2; j < 30; j += 4) { R(x, 2, j, 12, 3, '#3a404d'); P(x, 3, j + 1, g ? '#4affc8' : '#ff5a3a'); P(x, 5, j + 1, (j + f) % 8 ? '#4aff7a' : '#222'); } outline(x, w, h, '#1b1420'); break;
    case 'crane': R(x, 6, 10, 4, 54, '#d8a83a'); R(x, 6, 8, 40, 4, '#d8a83a'); R(x, 40, 12, 1, 26, '#333'); R(x, 36, 38, 9, 6, '#666'); R(x, 2, 58, 12, 6, '#555'); outline(x, w, h, '#1b1420'); break;
    case 'well': R(x, 4, 12, 24, 16, '#8a8698'); R(x, 6, 14, 20, 6, '#1a2a4a'); R(x, 4, 2, 2, 12, '#6b4a2b'); R(x, 26, 2, 2, 12, '#6b4a2b'); R(x, 2, 0, 28, 4, '#a0503a'); outline(x, w, h, '#1b1420'); break;
    case 'anvil': R(x, 2, 4, 12, 4, '#4a4a55'); R(x, 0, 4, 3, 2, '#4a4a55'); R(x, 5, 8, 6, 4, '#3a3a44'); R(x, 3, 12, 10, 3, '#3a3a44'); R(x, 2, 4, 12, 1, '#7a7a88'); outline(x, w, h, '#1b1420'); break;
    case 'book': R(x, 2, 2, 12, 12, '#3a5aaa'); R(x, 3, 3, 10, 10, '#f2e8d0'); R(x, 8, 3, 1, 10, '#3a5aaa'); for (let j = 5; j < 12; j += 2) { R(x, 4, j, 3, 1, '#888'); R(x, 10, j, 2, 1, '#888'); } outline(x, w, h, '#1b1420'); break;
    case 'screen': R(x, 0, 0, 32, 20, '#2a2f3a'); R(x, 2, 2, 28, 16, '#0a1a2a'); for (let i = 4; i < 28; i += 2) P(x, i, 10 + Math.round(Math.sin(i * 0.5 + f) * 4), '#4affc8'); R(x, 14, 20, 4, 4, '#2a2f3a'); outline(x, w, h, '#1b1420'); break;
    case 'heatpipe': R(x, 5, 0, 6, 16, g ? '#c8603a' : '#7a3a2a'); R(x, 6, 0, 1, 16, '#ffb07a'); break;
    case 'dish': for (let i = 0; i < 32; i++) for (let j = 0; j < 32; j++) { const r = Math.hypot(i - 16, (j - 12) * 1.5); if (r < 13 && j < 18) P(x, i, j, r < 11 ? '#d8d8e0' : '#9a9aa8'); } R(x, 14, 18, 4, 14, '#6a6a78'); P(x, 16, 10, '#ff3a3a'); outline(x, w, h, '#1b1420'); break;
  }
}

// ------------------------------------------------------------------ Texte pixel
/** Dessine un texte avec ombre (utilise la police monospace du système, petite taille). */
export function text(ctx, s, x, y, col = '#fff', size = 8, align = 'left', shadow = '#000') {
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textAlign = align; ctx.textBaseline = 'top';
  if (shadow) { ctx.fillStyle = shadow; ctx.fillText(s, x + 1, y + 1); }
  ctx.fillStyle = col; ctx.fillText(s, x, y);
}
