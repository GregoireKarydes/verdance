// =============================================================
// world.js — génération déterministe du monde (surface + intérieurs)
// La surface est une grille de régions 64×48 tuiles. Les intérieurs
// (donjons, grottes) sont de petites cartes séparées.
// =============================================================
import { TILE, fbm, hash2, rng, clamp } from './util.js';
import { TILES } from './gfx.js';
import { REGIONS, GATES, GRID, DUNGEONS, CAVES } from '../content/world.js';

export const RW = 64, RH = 48;
export const KINDS = ['G', 'g', 'P', 'S', 'F', 'Y', 'W', 'D', 'M', 'T', 'B', 'R', 'X', 'BR', 'FL', 'WL', 'DR'];
const K = Object.fromEntries(KINDS.map((k, i) => [k, i]));
export const SOLID = KINDS.map(k => !!TILES[k].solid);

/** Carte = grille de tuiles + props. */
class GameMap {
  constructor(id, w, h, theme) {
    this.id = id; this.w = w; this.h = h; this.theme = theme;
    this.t = new Uint8Array(w * h).fill(K.G);
    this.v = new Uint8Array(w * h);
    this.props = []; this.landmarks = []; this.warps = [];
    this.interior = false;
  }
  get(x, y) { return x < 0 || y < 0 || x >= this.w || y >= this.h ? K.M : this.t[y * this.w + x]; }
  set(x, y, k) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.t[y * this.w + x] = typeof k === 'string' ? K[k] : k; }
  kind(x, y) { return KINDS[this.get(x, y)]; }
  /** Région (surface) à la tuile. */
  regionAt(tx, ty) {
    if (this.interior) return this.region;
    const c = Math.floor(tx / RW), r = Math.floor(ty / RH);
    return GRID[r] && GRID[r][c] ? GRID[r][c] : null;
  }
}

let world = null;
export function getWorld() { return world; }

/** Construit le monde complet. */
export function buildWorld() {
  const rows = GRID.length, cols = GRID[0].length;
  const ow = new GameMap('overworld', cols * RW, rows * RH, null);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const id = GRID[r][c];
    genRegion(ow, c * RW, r * RH, id ? REGIONS[id] : null, c, r);
  }
  carveGates(ow);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const id = GRID[r][c]; if (!id) continue;
    placeLandmarks(ow, REGIONS[id], c * RW, r * RH);
  }
  finalizeVariants(ow);
  const maps = { overworld: ow };
  for (const d of Object.values(DUNGEONS)) maps[d.id] = (d.rooms.some(r => r.final) && d.id !== 'd_index') ? genTemple(d) : genDungeon(d);
  for (const cv of Object.values(CAVES)) maps[cv.id] = genCave(cv);
  world = { maps, overworld: ow };
  return world;
}

// ---------------------------------------------------------------- Régions
const PROFILES = {
  village:    { tree: 0.6, rock: 0.012, bush: 0.02, x: 0.004, water: 0.22, sec: 0.0, deco: 0.08, ydeco: 0.02 },
  steppe:     { tree: 0.68, rock: 0.02, bush: 0.006, x: 0.02, water: 0.24, sec: 0.6, deco: 0.03, ydeco: 0.06 },
  bassin:     { tree: 0.64, rock: 0.012, bush: 0.02, x: 0.012, water: 0.3, sec: 0.0, deco: 0.06, ydeco: 0.02 },
  mines:      { tree: 0.74, rock: 0.03, bush: 0.004, x: 0.025, water: 0.18, sec: 0.62, deco: 0.01, ydeco: 0.02, ridges: 1 },
  marais:     { tree: 0.62, rock: 0.006, bush: 0.03, x: 0.01, water: 0.42, sec: 0.0, deco: 0.05, ydeco: 0.08 },
  citadelle:  { tree: 0.8, rock: 0.004, bush: 0.01, x: 0.0, water: 0.18, sec: 0.5, deco: 0.03, ydeco: 0.03, grid: 1 },
  desert:     { tree: 0.86, rock: 0.012, bush: 0.002, x: 0.018, water: 0.12, sec: 0.55, deco: 0.01, ydeco: 0.06 },
  decharge:   { tree: 0.76, rock: 0.01, bush: 0.01, x: 0.045, water: 0.2, sec: 0.6, deco: 0.03, ydeco: 0.06 },
  forge:      { tree: 0.62, rock: 0.01, bush: 0.02, x: 0.01, water: 0.22, sec: 0.0, deco: 0.08, ydeco: 0.03 },
  sanctuaire: { tree: 0.66, rock: 0.006, bush: 0.01, x: 0.012, water: 0.2, sec: 0.58, deco: 0.06, ydeco: 0.04 },
};

function genRegion(m, ox, oy, reg, c, r) {
  if (!reg) { // océan / bord du monde
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) m.set(ox + x, oy + y, 'D');
    return;
  }
  const pr = PROFILES[reg.theme] || PROFILES.village;
  const s = reg.seed || (c * 7 + r * 13 + 1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
    const X = ox + x, Y = oy + y;
    let k = 'G';
    const n1 = fbm(X / 14, Y / 14, s, 3), n2 = fbm(X / 9, Y / 9, s + 50, 3), n3 = fbm(X / 22, Y / 22, s + 90, 2);
    if (pr.sec && n2 > pr.sec) k = 'S'; else if (n2 < 0.36) k = 'g';
    if (n3 < pr.water) k = 'W';
    else if (n1 > pr.tree) k = 'T';
    else if (pr.ridges && Math.abs(fbm(X / 18, Y / 18, s + 7, 2) - 0.5) < 0.025) k = 'M';
    else {
      const h = hash2(X, Y, s);
      if (h < pr.rock) k = 'R';
      else if (h < pr.rock + pr.bush) k = 'B';
      else if (h < pr.rock + pr.bush + pr.x) k = 'X';
      else if (h > 1 - pr.deco) k = 'F';
      else if (h > 1 - pr.deco - pr.ydeco) k = 'Y';
    }
    if (pr.grid && x % 8 === 4 && y % 6 !== 0 && y % 6 !== 5 && k !== 'W' && hash2(X, Y, 3) < 0.75) k = 'X';
    // bordures
    if (x < 2 || y < 2 || x >= RW - 2 || y >= RH - 2) k = 'M';
    m.set(X, Y, k);
  }
}

/** Ouvre les couloirs entre régions et pose les portes. */
function carveGates(m) {
  for (const g of GATES) {
    const A = findRegion(g.a), B = findRegion(g.b);
    const horiz = A.r === B.r; // voisins gauche/droite
    const cells = [];
    if (horiz) {
      const left = A.c < B.c ? A : B; const xb = (left.c + 1) * RW; const yc = left.r * RH + RH / 2 + (g.off || 0);
      for (let x = xb - 6; x < xb + 6; x++) for (let y = yc - 2; y <= yc + 1; y++) { m.set(x, y, 'P'); }
      for (let y = yc - 2; y <= yc + 1; y++) cells.push([xb - 1, y], [xb, y]);
    } else {
      const top = A.r < B.r ? A : B; const yb = (top.r + 1) * RH; const xc = top.c * RW + RW / 2 + (g.off || 0);
      for (let y = yb - 6; y < yb + 6; y++) for (let x = xc - 2; x <= xc + 1; x++) { m.set(x, y, 'P'); }
      for (let x = xc - 2; x <= xc + 1; x++) cells.push([x, yb - 1], [x, yb]);
    }
    g.cells = cells;
    g.horiz = horiz;
    for (const [x, y] of cells) m.props.push({ kind: g.type, x: x * TILE, y: y * TILE, w: 16, h: 16, solid: true, gate: g.id, z: 0 });
  }
}
function findRegion(id) {
  for (let r = 0; r < GRID.length; r++) for (let c = 0; c < GRID[r].length; c++) if (GRID[r][c] === id) return { r, c };
  throw new Error('région inconnue ' + id);
}

/** Taille (en tuiles) et zone solide de chaque type de repère. */
const LM = {
  house: { w: 3, h: 3, solid: [0, 1, 3, 2] }, temple: { w: 4, h: 4, solid: [0, 1, 4, 3] }, tree: { w: 4, h: 5, solid: [1, 3, 2, 2] },
  obelisk: { w: 1, h: 2, solid: [0, 1, 1, 1] }, monolith: { w: 1, h: 2, solid: [0, 1, 1, 1] }, stele: { w: 1, h: 1, solid: [0, 0, 1, 1] },
  sign: { w: 1, h: 1, solid: [0, 0, 1, 1] }, chest: { w: 1, h: 1, solid: [0, 0, 1, 1] }, mural: { w: 2, h: 2, solid: [0, 0, 2, 1] },
  pedestal: { w: 1, h: 1, solid: [0, 0, 1, 1] }, altar: { w: 2, h: 2, solid: [0, 0, 2, 2] }, warp: { w: 1, h: 1, solid: null },
  arcade: { w: 1, h: 2, solid: [0, 1, 1, 1] }, stall: { w: 2, h: 2, solid: [0, 1, 2, 1] }, cave: { w: 2, h: 2, solid: [0, 0, 2, 1] },
  tower: { w: 2, h: 4, solid: [0, 2, 2, 2] }, rack: { w: 1, h: 2, solid: [0, 0, 1, 2] }, crane: { w: 3, h: 4, solid: [0, 3, 1, 1] },
  well: { w: 2, h: 2, solid: [0, 0, 2, 2] }, anvil: { w: 1, h: 1, solid: [0, 0, 1, 1] }, book: { w: 1, h: 1, solid: [0, 0, 1, 1] },
  screen: { w: 2, h: 2, solid: [0, 0, 2, 1] }, dish: { w: 2, h: 2, solid: [0, 1, 2, 1] }, pot: { w: 1, h: 1, solid: [0, 0, 1, 1] },
  npc: { w: 1, h: 1, solid: null }, spot: { w: 1, h: 1, solid: null },
};

function placeLandmarks(m, reg, ox, oy) {
  const r = rng(reg.seed || 5);
  const centers = [];
  for (const L of reg.landmarks) {
    const kind = L.t;
    const d = LM[kind] || LM.spot;
    const tx = ox + L.x, ty = oy + L.y;
    // dégage la zone autour
    const pad = kind === 'npc' ? 1 : 2;
    for (let y = ty - pad; y < ty + d.h + pad; y++) for (let x = tx - pad; x < tx + d.w + pad; x++) {
      if (x <= ox + 1 || y <= oy + 1 || x >= ox + RW - 2 || y >= oy + RH - 2) continue;
      const k = m.kind(x, y); if (k !== 'P') m.set(x, y, hash2(x, y, 9) < 0.12 ? 'F' : 'G');
    }
    centers.push([tx + Math.floor(d.w / 2), ty + d.h]);
    const lm = Object.assign({ region: reg.id, tx, ty, map: 'overworld' }, L);
    m.landmarks.push(lm);
    if (kind !== 'npc' && kind !== 'spot') {
      const sol = d.solid;
      m.props.push({ kind: L.prop || kind, x: tx * TILE, y: ty * TILE, w: d.w * TILE, h: d.h * TILE, lm,
        solid: !!sol, box: sol ? [tx * TILE + sol[0] * TILE, ty * TILE + sol[1] * TILE, sol[2] * TILE, sol[3] * TILE] : null, region: reg.id, variant: L.variant || 0 });
    }
  }
  // chemins entre repères et portes de la région
  const gatePts = GATES.filter(g => g.a === reg.id || g.b === reg.id).map(g => {
    const [x, y] = g.cells[0];
    return [clamp(x, ox + 3, ox + RW - 4), clamp(y, oy + 3, oy + RH - 4)];
  });
  const hub = reg.hub ? [ox + reg.hub[0], oy + reg.hub[1]] : [ox + RW / 2, oy + RH / 2];
  for (const p of [...gatePts, ...centers]) carvePath(m, hub, p, r, ox, oy);
}

function carvePath(m, a, b, r, ox, oy) {
  let [x, y] = a; const [tx, ty] = b;
  let guard = 0;
  const horizFirst = r() < 0.5;
  while ((x !== tx || y !== ty) && guard++ < 400) {
    const dx = Math.sign(tx - x), dy = Math.sign(ty - y);
    if (dx && (horizFirst ? true : !dy || r() < 0.35)) x += dx; else if (dy) y += dy; else x += dx;
    if (r() < 0.08 && dy) y += dy;
    for (const [ax, ay] of [[x, y], [x + 1, y], [x, y + 1]]) {
      if (ax <= ox + 1 || ay <= oy + 1 || ax >= ox + RW - 2 || ay >= oy + RH - 2) continue;
      const k = m.kind(ax, ay);
      if (k === 'W') m.set(ax, ay, 'BR');
      else if (k !== 'BR' && !occupiedByProp(m, ax, ay)) m.set(ax, ay, 'P');
    }
  }
}
function occupiedByProp(m, tx, ty) {
  const px = tx * TILE + 8, py = ty * TILE + 8;
  return m.props.some(p => p.box && px >= p.box[0] && px < p.box[0] + p.box[2] && py >= p.box[1] && py < p.box[1] + p.box[3]);
}

function finalizeVariants(m) {
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) m.v[y * m.w + x] = Math.floor(hash2(x, y, 77) * 4);
  // les ponts : on évite les tuiles solides sous les props non solides (warp/npc)
  for (const p of m.props) if (!p.solid) { const tx = Math.floor(p.x / TILE), ty = Math.floor(p.y / TILE); if (SOLID[m.get(tx, ty)]) m.set(tx, ty, 'G'); }
  for (const L of m.landmarks) if (L.t === 'npc' || L.t === 'spot') { if (SOLID[m.get(L.tx, L.ty)]) m.set(L.tx, L.ty, 'G'); }
}

// ---------------------------------------------------------------- Donjons
const ROOM_W = 15, ROOM_H = 11;
function genDungeon(d) {
  const n = d.rooms.length;
  const w = n * (ROOM_W + 1) + 1, h = ROOM_H + 2;
  const m = new GameMap(d.id, w, h, 'dungeon');
  m.interior = true; m.region = d.region; m.title = d.title; m.music = 'dungeon';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) m.set(x, y, 'WL');
  d.rooms.forEach((room, i) => {
    const ox = 1 + i * (ROOM_W + 1), oy = 1;
    for (let y = 0; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) m.set(ox + x, oy + y, 'FL');
    // piliers décoratifs
    const rr = rng(i * 31 + d.id.length);
    if (room.layout !== 'open') for (const [px, py] of [[3, 2], [11, 2], [3, 8], [11, 8]]) if (rr() < 0.8) m.set(ox + px, oy + py, 'WL');
    if (room.water) for (let x = 5; x < 10; x++) { m.set(ox + x, oy + 5, 'W'); }
    if (room.water) m.set(ox + 7, oy + 5, 'BR');
    // porte vers la salle suivante
    if (i < n - 1) {
      const dx = ox + ROOM_W, dy = oy + Math.floor(ROOM_H / 2);
      m.set(dx, dy, 'FL'); m.set(dx, dy - 1, 'FL');
      m.props.push({ kind: 'gate_rune', x: dx * TILE, y: dy * TILE, w: 16, h: 16, solid: true, dgate: `${d.id}:${i}` });
      m.props.push({ kind: 'gate_rune', x: dx * TILE, y: (dy - 1) * TILE, w: 16, h: 16, solid: true, dgate: `${d.id}:${i}` });
    }
    // piédestal d'énigme au centre
    const cx = ox + 7, cy = oy + 4;
    if (room.puzzle) {
      const lm = { t: 'pedestal', id: `${d.id}_p${i}`, tx: cx, ty: cy, map: d.id, region: d.region, room: i, puzzle: room.puzzle, script: room.script };
      m.landmarks.push(lm);
      m.props.push({ kind: 'pedestal', x: cx * TILE, y: cy * TILE, w: 16, h: 16, solid: true, box: [cx * TILE, cy * TILE, 16, 16], lm });
    }
    if (room.mural) {
      const lm = { t: 'mural', id: `${d.id}_m${i}`, tx: ox + 2, ty: oy, map: d.id, region: d.region, script: room.mural };
      m.landmarks.push(lm);
      m.props.push({ kind: 'mural', x: (ox + 2) * TILE, y: (oy) * TILE, w: 32, h: 24, solid: true, box: [(ox + 2) * TILE, oy * TILE, 32, 16], lm });
    }
    if (room.final) {
      const lmC = { t: 'chest', id: `${d.id}_chest`, tx: ox + 5, ty: oy + 6, map: d.id, region: d.region, script: room.final.chest };
      const lmS = { t: 'pedestal', id: `${d.id}_seed`, tx: ox + 9, ty: oy + 6, map: d.id, region: d.region, script: room.final.seed, seed: true };
      m.landmarks.push(lmC, lmS);
      m.props.push({ kind: 'chest', x: lmC.tx * TILE, y: lmC.ty * TILE, w: 16, h: 16, solid: true, box: [lmC.tx * TILE, lmC.ty * TILE, 16, 16], lm: lmC });
      m.props.push({ kind: 'altar', x: (lmS.tx - 0) * TILE, y: (lmS.ty - 1) * TILE, w: 32, h: 24, solid: true, box: [lmS.tx * TILE, lmS.ty * TILE, 32, 8], lm: lmS, variant: 1 });
    }
    room.spawn = (room.mobs || []).map((k, j) => ({ kind: k, x: (ox + 4 + (j * 3) % 8) * TILE, y: (oy + 2 + (j * 5) % 7) * TILE }));
  });
  // entrée / sortie
  m.entry = { x: 2 * TILE, y: (1 + Math.floor(ROOM_H / 2)) * TILE };
  m.props.push({ kind: 'door', x: 0, y: (1 + Math.floor(ROOM_H / 2)) * TILE, w: 16, h: 16, solid: false, exit: true });
  m.set(0, 1 + Math.floor(ROOM_H / 2), 'DR');
  for (let i = 0; i < m.w * m.h; i++) m.v[i] = (i * 7) % 4;
  m.def = d;
  return m;
}

/**
 * Temple « à la Zelda » (8 temples à Graine-Mère), grille 3×3 de salles :
 *
 *   [ARCHIVES 0,0]   [GARDIEN 1,0]    [CRISTAUX 2,0]
 *        │ (bloc-réponse)   ║ (grande clé)      │ (énigme des archives, à distance)
 *   [RÉPONSES 0,1] ─🗝─ [HALL 1,1] ─(énigme 2)─ [BLOC 2,1]
 *                         │ (énigme 1)
 *                     [ENTRÉE 1,2]
 *
 * Parcours : énigme 1 → énigme 2 → bloc sur la dalle (petite clé) → porte à clé →
 * bloc sur VRAI/FAUX (idée reçue du cours) → énigme 3 (ouvre la salle des cristaux, au loin) →
 * cristaux dans l'ordre (séquence du cours) [+ énigme 4] → grande clé → Gardien → Graine-Mère.
 */
export const TEMPLE_ROOMS = { ENT: 0, HUB: 1, BLK: 2, ANS: 3, ARC: 4, SEQ: 5, BOSS: 6 };
function genTemple(d) {
  const T = TILE, RW_ = ROOM_W + 1, RH_ = ROOM_H + 1;
  const w = 3 * RW_ + 1, h = 3 * RH_ + 1;
  const m = new GameMap(d.id, w, h, 'dungeon');
  m.interior = true; m.region = d.region; m.title = d.title; m.music = 'dungeon';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) m.set(x, y, 'WL');
  const content = d.rooms.filter(r => !r.final), fin = d.rooms.find(r => r.final);
  const SIG = { steppe: 'gaz', bassin: 'limites', mines: 'mine', marais: 'donnees', citadelle: 'chaleur', desert: 'mirages', decharge: 'reparation', forge: 'poids' }[d.region] || 'gaz';
  const mir = ['bassin', 'marais', 'desert', 'forge'].includes(d.region); // plan en miroir un temple sur deux
  const R = TEMPLE_ROOMS;
  const defs = [
    { key: 'ENT', c: 1, r: 2, src: content[0] }, { key: 'HUB', c: 1, r: 1, src: content[1] }, { key: 'BLK', c: 2, r: 1 },
    { key: 'ANS', c: 0, r: 1 }, { key: 'ARC', c: 0, r: 0, src: content[2] }, { key: 'SEQ', c: 2, r: 0, src: content[3] }, { key: 'BOSS', c: 1, r: 0 },
  ];
  const mobPool = content.flatMap(r => r.mobs || []);
  const O = rm => ({ ox: 1 + rm.c * RW_, oy: 1 + rm.r * RH_ });
  defs.forEach((rm, i) => {
    if (mir) rm.c = 2 - rm.c;
    rm.idx = i; Object.assign(rm, O(rm));
    for (let y = 0; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) m.set(rm.ox + x, rm.oy + y, 'FL');
    if (['ENT', 'HUB', 'ARC', 'BOSS'].includes(rm.key)) for (const [px, py] of [[2, 2], [12, 2], [2, 8], [12, 8]]) m.set(rm.ox + px, rm.oy + py, 'WL');
    const src = rm.src || {};
    if (src.water && rm.key !== 'BLK' && rm.key !== 'ANS') { for (let x = 5; x < 10; x++) m.set(rm.ox + x, rm.oy + 6, 'W'); m.set(rm.ox + 7, rm.oy + 6, 'BR'); m.set(rm.ox + 8, rm.oy + 6, 'BR'); }
    if (src.puzzle) {
      const cx = rm.ox + 7, cy = rm.oy + (rm.key === 'SEQ' ? 5 : 4);
      const lm = { t: 'pedestal', id: `${d.id}_p${i}`, tx: cx, ty: cy, map: d.id, region: d.region, room: i, puzzle: src.puzzle, script: src.script };
      m.landmarks.push(lm);
      m.props.push({ kind: 'pedestal', x: cx * T, y: cy * T, w: 16, h: 16, solid: true, box: [cx * T, cy * T, 16, 16], lm });
    }
    if (src.mural) {
      const lm = { t: 'mural', id: `${d.id}_m${i}`, tx: rm.ox + 2, ty: rm.oy, map: d.id, region: d.region, script: src.mural };
      m.landmarks.push(lm);
      m.props.push({ kind: 'mural', x: (rm.ox + 2) * T, y: rm.oy * T, w: 32, h: 24, solid: true, box: [(rm.ox + 2) * T, rm.oy * T, 32, 16], lm });
    }
    let mobs = src.mobs || [];
    if (rm.key === 'ANS') mobs = mobPool.slice(i % 3, i % 3 + 1);
    if (rm.key === 'BLK') mobs = ['mirages', 'reparation'].includes(SIG) ? [] : mobPool.slice(0, 1);
    if (rm.key === 'SEQ' && !src.mobs) mobs = mobPool.slice(0, 2);
    const spots = [[4, 3], [10, 3], [5, 9], [9, 9], [12, 5]];
    rm.spawn = rm.key === 'BOSS' ? [] : mobs.map((k, j) => ({ kind: k, x: (rm.ox + spots[j % 5][0]) * T, y: (rm.oy + spots[j % 5][1]) * T }));
  });
  const room = k => defs[R[k]];
  // ---- portes (2 tuiles). Côté = 'E' (entre c et c+1) ou 'N' (entre r et r-1)
  const door = (a, b, prop) => {
    let tiles;
    if (a.r === b.r) { const l = a.c < b.c ? a : b; tiles = [[l.ox + ROOM_W, l.oy + 4], [l.ox + ROOM_W, l.oy + 5]]; }
    else { const lo = a.r > b.r ? a : b; tiles = [[lo.ox + 7, lo.oy - 1], [lo.ox + 8, lo.oy - 1]]; }
    for (const [x, y] of tiles) { m.set(x, y, 'FL'); if (prop) m.props.push(Object.assign({ x: x * T, y: y * T, w: 16, h: 16, solid: true }, prop)); }
  };
  const rune = key => ({ kind: 'gate_rune', dgate: key });
  door(room('ENT'), room('HUB'), content[0] ? rune(`${d.id}:${R.ENT}`) : null);
  door(room('ANS'), room('HUB'), { kind: 'lockdoor', lockdoor: d.id });         // Réponses ↔ Hall : petite clé
  door(room('HUB'), room('BLK'), content[1] ? rune(`${d.id}:${R.HUB}`) : null); // Hall ↔ salle signature : énigme 2
  door(room('HUB'), room('BOSS'), { kind: 'bigdoor', bigdoor: d.id });         // Hall ↔ Gardien : grande clé
  door(room('ANS'), room('ARC'), rune(`${d.id}:ans`));                          // Réponses ↔ Archives : bloc VRAI/FAUX
  door(room('BLK'), room('SEQ'), rune(`${d.id}:${R.ARC}`));                     // Signature ↔ Cristaux : énigme des archives (à distance)
  const chest = (k, tx, ty, script, appear) => { const lm = { t: 'chest', id: `${d.id}_${k}`, tx, ty, map: d.id, region: d.region, script }; m.landmarks.push(lm); m.props.push({ kind: 'chest', x: tx * T, y: ty * T, w: 16, h: 16, solid: true, box: [tx * T, ty * T, 16, 16], lm, appear }); return lm; };
  const mkBlock = (tx, ty, tag, extra) => Object.assign({ kind: 'block', x: tx * T, y: ty * T, w: 16, h: 16, solid: true, box: [tx * T, ty * T, 16, 16], home: { x: tx * T, y: ty * T }, tag, room: tag === 'ans' ? R.ANS : R.BLK }, extra);
  const mkPlate = (tx, ty, extra) => Object.assign({ kind: 'plate', x: tx * T, y: ty * T, w: 16, h: 16, solid: false, floor: true }, extra);
  // ---- SALLE SIGNATURE (une mécanique propre à chaque temple) → un coffre apparaît (petite clé)
  const sig = buildSignature(m, room('BLK'), SIG, mir, d, mkBlock, mkPlate);
  chest('key', sig.chest[0], sig.chest[1], 'key:' + d.id, SIG === 'mirages' ? null : 'mech_' + d.id);
  // ---- salle des RÉPONSES : pousser le bloc sur VRAI ou FAUX
  const A = room('ANS'), ansBlock = mkBlock(A.ox + 7, A.oy + 7, 'ans');
  const left = hash2(d.id.length, 3, 7) < 0.5;
  const pV = mkPlate(A.ox + (left ? 3 : 11), A.oy + 7, { tag: 'ans', label: 'VRAI', val: true }), pF = mkPlate(A.ox + (left ? 11 : 3), A.oy + 7, { tag: 'ans', label: 'FAUX', val: false });
  m.props.push(pV, pF, ansBlock);
  const steleA = { t: 'stele', id: `${d.id}_steleA`, tx: A.ox + 4, ty: A.oy + 1, map: d.id, region: d.region, script: 'zstele:ans' };
  m.landmarks.push(steleA); m.props.push({ kind: 'stele', x: steleA.tx * T, y: steleA.ty * T, w: 16, h: 16, solid: true, box: [steleA.tx * T, steleA.ty * T, 16, 16], lm: steleA });
  // ---- salle des CRISTAUX : les frapper dans l'ordre → la grande clé apparaît
  const Q = room('SEQ');
  const cpos = [[3, 3], [11, 3], [3, 8], [11, 8]];
  const crystals = cpos.map(([x, y], i) => ({ kind: 'crystal', x: (Q.ox + x) * T, y: (Q.oy + y) * T, w: 16, h: 16, solid: true, box: [(Q.ox + x) * T, (Q.oy + y) * T + 4, 16, 12], crystal: i }));
  m.props.push(...crystals);
  const steleS = { t: 'stele', id: `${d.id}_steleS`, tx: Q.ox + 7, ty: Q.oy + 1, map: d.id, region: d.region, script: 'zstele:seq' };
  m.landmarks.push(steleS); m.props.push({ kind: 'stele', x: steleS.tx * T, y: steleS.ty * T, w: 16, h: 16, solid: true, box: [steleS.tx * T, steleS.ty * T, 16, 16], lm: steleS });
  chest('bigkey', Q.ox + 7, Q.oy + 8, 'bigkey:' + d.id, 'bkchest_' + d.id);
  // ---- salle du GARDIEN : coffre de l'objet + autel de la graine
  const BO = room('BOSS');
  if (fin && fin.final) {
    const lmC = { t: 'chest', id: `${d.id}_chest`, tx: BO.ox + 5, ty: BO.oy + 7, map: d.id, region: d.region, script: fin.final.chest };
    const lmS = { t: 'pedestal', id: `${d.id}_seed`, tx: BO.ox + 9, ty: BO.oy + 7, map: d.id, region: d.region, script: fin.final.seed, seed: true };
    m.landmarks.push(lmC, lmS);
    m.props.push({ kind: 'chest', x: lmC.tx * T, y: lmC.ty * T, w: 16, h: 16, solid: true, box: [lmC.tx * T, lmC.ty * T, 16, 16], lm: lmC });
    m.props.push({ kind: 'altar', x: lmS.tx * T, y: (lmS.ty - 1) * T, w: 32, h: 24, solid: true, box: [lmS.tx * T, lmS.ty * T, 32, 8], lm: lmS, variant: 1 });
  }
  // ---- entrée / sortie (en bas de la salle d'entrée)
  const E = room('ENT');
  m.set(E.ox + 7, h - 1, 'DR');
  m.props.push({ kind: 'door', x: (E.ox + 7) * T, y: (h - 1) * T, w: 16, h: 16, solid: false, exit: true });
  m.entry = { x: (E.ox + 7) * T, y: (E.oy + 9) * T };
  for (let i = 0; i < m.w * m.h; i++) m.v[i] = (i * 7) % 4;
  m.def = d;
  m.temple = { id: d.id, mirror: mir, sig, rooms: defs, blocks: [...sig.blocks.map(b => ({ prop: b, plates: sig.plates, tag: 'sig', room: R.BLK })), { prop: ansBlock, plates: [pV, pF], tag: 'ans', room: R.ANS }], crystals, bossRoom: R.BOSS, guardianAt: { x: (BO.ox + 7) * T + 8, y: (BO.oy + 3) * T + 12 }, hasP3: !!content[2], p4: content[3] ? content[3].puzzle : null };
  return m;
}
/**
 * Salle « signature » : chaque temple a sa propre mécanique, liée à son thème.
 * Coordonnées locales pensées avec la porte du hall à l'ouest (x = 0) et la
 * porte des cristaux au nord (x = 7-8) ; elles sont retournées si le plan est en miroir.
 */
function buildSignature(m, rm, kind, mir, d, mkBlock, mkPlate) {
  const T = TILE, X = x => rm.ox + (mir ? ROOM_W - 1 - x : x), Y = y => rm.oy + y;
  const wall = (x, y) => m.set(X(x), Y(y), 'WL');
  const out = { kind, blocks: [], plates: [], chest: [X(12), Y(9)], tiles: [], hits: [], lever: null, mirages: [], bench: null };
  const stele = { t: 'stele', id: `${d.id}_steleK`, tx: X(4), ty: Y(1), map: d.id, region: d.region, script: 'zstele:sig' };
  m.landmarks.push(stele); m.props.push({ kind: 'stele', x: stele.tx * T, y: stele.ty * T, w: 16, h: 16, solid: true, box: [stele.tx * T, stele.ty * T, 16, 16], lm: stele });
  const hitProp = (x, y, sprite, extra) => { const p = Object.assign({ kind: sprite, x: X(x) * T, y: Y(y) * T, w: 16, h: 16, solid: true, box: [X(x) * T, Y(y) * T, 16, 16], hit: true }, extra); m.props.push(p); out.hits.push(p); return p; };
  const tile = (x, y, extra) => { const p = Object.assign({ kind: 'dalle', x: X(x) * T, y: Y(y) * T, w: 16, h: 16, solid: false, floor: true, step: true, state: 0 }, extra); m.props.push(p); out.tiles.push(p); return p; };
  switch (kind) {
    case 'gaz': { // Serre : pousser chaque gaz sur sa dalle de PRG
      const gases = [['CO₂', '×1'], ['CH₄', '×28'], ['N₂O', '×273']];
      const plateX = [10, 4, 7]; // ×1 à droite, ×28 à gauche, ×273 au milieu
      gases.forEach(([g, prg], i) => { const b = mkBlock(X(4 + 3 * i), Y(7), 'sig', { label: g, want: prg }); m.props.push(b); out.blocks.push(b); const p = mkPlate(X(plateX[i]), Y(3), { label: prg, accept: prg, tag: 'sig' }); m.props.push(p); out.plates.push(p); });
      break;
    }
    case 'limites': { // Observatoire : 9 dalles à régler sur dépassée / sûre en marchant dessus
      const L = [['Climat', 1], ['Biosphère', 1], ['Sols', 1], ['Eau douce', 1], ['Azote/phosphore', 1], ['Nouvelles entités', 1], ['Océans acides', 1], ['Ozone', 2], ['Aérosols', 2]];
      const order = [2, 7, 0, 5, 8, 1, 4, 6, 3];
      order.forEach((li, k) => tile([3, 7, 11][k % 3], [3, 6, 9][Math.floor(k / 3)], { label: L[li][0], want: L[li][1] }));
      out.chest = [X(13), Y(1)];
      break;
    }
    case 'mine': { // Fonderie : creuser un tunnel dans les filons (3 rochers à briser)
      for (let y = 0; y < ROOM_H; y++) if (y !== 5) wall(11, y);
      for (let x = 8; x <= 10; x++) { wall(x, 4); wall(x, 6); }
      const ores = [['Néodyme', 'Les terres rares comme le néodyme font les aimants des haut-parleurs et du vibreur.'], ['Indium', 'L’indium rend l’écran tactile ET transparent (oxyde d’indium-étain).'], ['Cobalt', 'Le cobalt et le lithium sont au cœur des batteries ; leur extraction pose de graves problèmes sociaux et environnementaux.']];
      ores.forEach(([n, f], i) => hitProp(9 + i, 5, 'ore', { label: n, fact: f, hp: 3 }));
      out.chest = [X(13), Y(5)];
      break;
    }
    case 'donnees': { // Relais : trier ses données (supprimer l'inutile), puis valider au levier
      const F = [['Photos en double', 1], ['Mémoire de stage', 0], ['Vieux mails pub', 1], ['Factures', 0], ['Vidéos 4K oubliées', 1], ['Photos de famille', 0], ['copie_de_copie.zip', 1], ['CV à jour', 0]];
      const order = [0, 3, 6, 1, 5, 2, 7, 4];
      order.forEach((fi, k) => tile([3, 10][k % 2], [3, 5, 7, 9][Math.floor(k / 2)], { label: F[fi][0], want: F[fi][1] ? 1 : 0, binary: true }));
      out.lever = hitProp(13, 5, 'lever', { lever: true, label: 'Valider' });
      out.chest = [X(13), Y(9)];
      break;
    }
    case 'chaleur': { // Machines : couper les serveurs inutiles pour faire baisser la température
      const S = [['Site zombie', 1], ['Messagerie', 0], ['Test oublié', 1], ['Copies ×5', 1], ['Site de l’école', 0], ['Zombie 2015', 1]];
      S.forEach(([n, waste], i) => hitProp([3, 7, 11][i % 3], [3, 7][Math.floor(i / 3)], 'server', { label: n, waste: !!waste, hp: 2, tall: true }));
      out.chest = [X(13), Y(9)];
      break;
    }
    case 'mirages': { // Oracle : certains murs sont des hallucinations (on passe à travers)
      for (let x = 8; x <= 14; x++) { wall(x, 3); wall(x, 10); }
      for (let y = 3; y <= 10; y++) wall(8, y);
      for (let y = 3; y <= 9; y++) wall(11, y);
      const fake = [[8, 7], [11, 4], [10, 10]];
      for (const [x, y] of fake) { m.set(X(x), Y(y), 'FL'); const p = { kind: 'mirage', x: X(x) * T, y: Y(y) * T, w: 16, h: 16, solid: false }; m.props.push(p); out.mirages.push(p); }
      for (const [x, y] of [[5, 8], [3, 4], [12, 1]]) wall(x, y); // vrais murs décoratifs
      out.chest = [X(13), Y(8)];
      break;
    }
    case 'reparation': { // Procès : briser des pots pour trouver 3 pièces, puis réparer au banc
      const pots = [[3, 4, 'Écran'], [11, 3, null], [5, 8, 'Batterie'], [9, 6, null], [12, 8, 'Port USB-C'], [2, 9, null]];
      pots.forEach(([x, y, part]) => hitProp(x, y, 'pot', { part, hp: 1 }));
      const bench = { t: 'bench', id: `${d.id}_bench`, tx: X(7), ty: Y(5), map: d.id, region: d.region, script: 'zbench' };
      m.landmarks.push(bench); m.props.push({ kind: 'anvil', x: bench.tx * T, y: bench.ty * T, w: 16, h: 16, solid: true, box: [bench.tx * T, bench.ty * T, 16, 16], lm: bench });
      out.bench = bench; out.chest = [X(13), Y(1)];
      break;
    }
    case 'poids': { // Atelier : détruire le superflu d'une page web (garder l'utile) pour passer sous le budget
      const B = [['Pub', 450, 1], ['Texte', 20, 0], ['Vidéo auto', 1200, 1], ['Carrousel', 600, 1], ['Bouton contact', 10, 0], ['Trackers', 300, 1], ['5 polices', 400, 1], ['Image compressée', 120, 0]];
      B.forEach(([n, ko, bloat], i) => hitProp([3, 6, 9, 12][i % 4], [3, 7][Math.floor(i / 4)], 'bloat', { label: n, ko, bloat: !!bloat, hp: 2 }));
      out.chest = [X(13), Y(9)];
      break;
    }
  }
  return out;
}

/** Index de salle d'un temple à partir d'une position en pixels. */
export function templeRoomAt(m, x, y) {
  const c = Math.floor((x / TILE - 1) / (ROOM_W + 1)), r = Math.floor((y / TILE - 1) / (ROOM_H + 1));
  const rm = m.temple.rooms.find(q => q.c === c && q.r === r); return rm ? rm.idx : -1;
}

function genCave(cv) {
  const w = 14, h = 11;
  const m = new GameMap(cv.id, w, h, 'cave');
  m.interior = true; m.region = cv.region; m.title = cv.title; m.music = 'dungeon';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1 || (hash2(x, y, 4) < 0.12 && x > 2 && y > 1 && x < w - 2 && y < h - 2);
    m.set(x, y, edge ? 'M' : (hash2(x, y, 5) < 0.2 ? 'g' : 'G'));
  }
  m.set(1, h - 2, 'DR');
  m.entry = { x: 2 * TILE, y: (h - 2) * TILE };
  m.props.push({ kind: 'door', x: 1 * TILE, y: (h - 2) * TILE, w: 16, h: 16, solid: false, exit: true });
  cv.items.forEach((it, i) => {
    const tx = 4 + i * 3, ty = 3;
    for (let y = ty - 1; y <= ty + 1; y++) for (let x = tx - 1; x <= tx + 1; x++) m.set(x, y, 'G');
    const lm = Object.assign({ tx, ty, map: cv.id, region: cv.region, id: `${cv.id}_${i}` }, it);
    m.landmarks.push(lm);
    const d = LM[it.t] || LM.chest;
    m.props.push({ kind: it.t, x: tx * TILE, y: ty * TILE, w: d.w * 16, h: d.h * 16, solid: true, box: [tx * TILE, ty * TILE + (d.h - 1) * 16, d.w * 16, 16], lm });
  });
  for (let i = 0; i < m.w * m.h; i++) m.v[i] = (i * 5) % 4;
  m.def = cv;
  return m;
}

/** Test de collision pixel. */
export function solidAt(m, px, py, gateOpen) {
  const tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  if (SOLID[m.get(tx, ty)]) return true;
  for (const p of m.props) {
    if (!p.solid) continue;
    if (p.gate && gateOpen(p)) continue;
    if (p.dgate && gateOpen(p)) continue;
    if (p.hidden) continue;
    const b = p.box || [p.x, p.y, p.w, p.h];
    if (px >= b[0] && px < b[0] + b[2] && py >= b[1] && py < b[1] + b[3]) return true;
  }
  return false;
}

/** Position de départ (en pixels) d'un repère. */
export function landmarkPos(lm) { return { x: lm.tx * TILE, y: lm.ty * TILE }; }
export function regionOrigin(id) { const { r, c } = findRegion(id); return { x: c * RW, y: r * RH }; }
export { K as KIND_INDEX };
