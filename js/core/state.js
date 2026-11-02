// =============================================================
// state.js — état de la partie, sauvegarde localStorage, suivi (tracker)
// =============================================================
import { CONFIG } from '../content/config.js';

const SAVE_KEY = 'verdance.save.v1';
const REPORTS_KEY = 'verdance.reports.v1';
const SETTINGS_KEY = 'verdance.settings.v1';

export function newState(identity) {
  return {
    version: 1,
    id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    identity, // { prenom, nom, groupe } — texte libre
    created: Date.now(), updated: Date.now(),
    map: 'overworld', x: 0, y: 0, dir: 0,
    hp: 6, maxHp: 6, graines: 0, fruits: 0, kits: 1, weapon: 100, heartPieces: 0,
    items: {}, seeds: {}, flags: {}, quests: {}, codex: {}, chests: {}, gates: {}, dgates: {},
    title: 'Initié·e', lastWarp: 'warp_village', warps: {},
    returnPos: null, ended: false,
    tracker: newTracker(),
  };
}

export function newTracker() {
  return {
    regionTime: {},      // ms actives par région
    idleTime: 0,         // ms sans aucune entrée (> 2 min)
    totalTime: 0,
    sessions: 1,
    firstPlay: Date.now(), lastPlay: Date.now(),
    dialogues: {},       // npcId -> { views, bubbles, read, skimmed }
    qcm: {},             // questionId -> { set, attempts, firstOk, ok, answers: [] }
    puzzles: {},         // puzzleId -> { title, region, attempts, hints, success, abandoned, timeMs, firstTry }
    open: {},            // questionId -> { text, words, timeMs, at }
    missions: {},        // missionId -> { values, at }
    videos: {},          // videoId -> { opened, done }
    combat: { kills: 0, parryOk: 0, parryKo: 0, eliteOk: 0, eliteKo: 0, hits: 0, deaths: 0, bubblesTaken: 0 },
    statements: {},      // statementId -> { seen, parryOk, parryKo }
    chunks: {},          // exploration
    secrets: {},
    log: [],             // journal d'évènements (limité)
    hintsUsed: 0,
  };
}

export function saveState(s) {
  s.updated = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); return true; } catch (e) { console.warn('Sauvegarde impossible', e); return false; }
}
export function loadState() {
  try { const r = localStorage.getItem(SAVE_KEY); if (!r) return null; const s = JSON.parse(r); return s && s.version === 1 ? s : null; } catch (e) { return null; }
}
export function clearState() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* */ } }

export function loadSettings() {
  const def = { music: 0.55, sfx: 0.8, master: 0.8, textSize: 1, textSpeed: 1, reduceMotion: false, colorblind: false, difficulty: 'normal', minimap: true };
  try { return Object.assign(def, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) { return def; }
}
export function saveSettings(st) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(st)); } catch (e) { /* */ } }

/** Bilans générés : on garde le JSON pour régénérer le PDF à la demande. */
export function listReports() { try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'); } catch (e) { return []; } }
export function storeReport(rep) {
  const l = listReports(); l.unshift(rep);
  while (l.length > (CONFIG.maxStoredReports || 12)) l.pop();
  try { localStorage.setItem(REPORTS_KEY, JSON.stringify(l)); } catch (e) {
    // si plein : on retire les plus anciens
    while (l.length > 1) { l.pop(); try { localStorage.setItem(REPORTS_KEY, JSON.stringify(l)); break; } catch (e2) { /* */ } }
  }
}
export function deleteReport(id) { const l = listReports().filter(r => r.reportId !== id); try { localStorage.setItem(REPORTS_KEY, JSON.stringify(l)); } catch (e) { /* */ } }

export function logEvent(s, type, data) {
  const L = s.tracker.log; L.push({ t: Date.now(), type, ...data });
  if (L.length > 400) L.splice(0, L.length - 400);
}
