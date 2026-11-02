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
  for (const d of Object.values(DUNGEONS)) maps[d.id] = genDungeon(d);
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
