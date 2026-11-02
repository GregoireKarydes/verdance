// =============================================================
// content/index.js — rassemble tout le contenu pédagogique du jeu
// (le moteur n'importe QUE ce fichier)
// =============================================================
import * as common from './common.js';
import * as village from './r_village.js';
import * as steppe from './r_steppe.js';
import * as bassin from './r_bassin.js';
import * as mines from './r_mines.js';
import * as marais from './r_marais.js';
import * as citadelle from './r_citadelle.js';
import * as desert from './r_desert.js';
import * as decharge from './r_decharge.js';
import * as forge from './r_forge.js';
import * as sanctuaire from './r_sanctuaire.js';
import { GATES, CAVES, DUNGEONS, REGIONS } from './world.js';
import { INVENTORY_IDS } from './inventory.js';

const R = [village, steppe, bassin, mines, marais, citadelle, desert, decharge, forge, sanctuaire];
const merge = key => Object.assign({}, ...R.map(r => r[key] || {}));

const QUESTS_LIST = R.flatMap(r => r.QUESTS || []);
const PUZZLES = merge('PUZZLES');
for (const [k, v] of Object.entries(PUZZLES)) v.id = k; // identifiant utilisé pour le suivi des QCM
const ON_SEED = merge('ON_SEED');
for (const k of Object.keys(REGIONS)) ON_SEED[k] = [...(ON_SEED[k] || []), 'script:titres'];

export const CONTENT = {
  NPCS: merge('NPCS'),
  SCRIPTS: {
    ...merge('SCRIPTS'),
    titres: [
      { if: 'seeds>=6&!flag:t6', act: ['flag:t6', 'title:Expert·e'] },
      { if: 'seeds>=4&!flag:t4', act: ['flag:t4', 'title:Stratège'] },
      { if: 'seeds>=2&!flag:t2', act: ['flag:t2', 'title:Analyste'] },
      { act: [] },
    ],
  },
  QUESTS: Object.fromEntries(QUESTS_LIST.map(q => [q.id, q])),
  QUESTS_LIST,
  PUZZLES,
  CODEX: merge('CODEX'),
  MURALS: merge('MURALS'),
  STATEMENTS: R.flatMap(r => r.STATEMENTS || []),
  COMBAT_QCM: R.flatMap(r => r.COMBAT || []),
  ON_ENTER: merge('ON_ENTER'),
  ON_SEED,
  ON_EVENT: merge('ON_EVENT'),
  ITEMS: common.ITEMS, CHESTS: common.CHESTS, VIDEOS: common.VIDEOS, MISSIONS: common.MISSIONS, QUESTIONS: common.QUESTIONS,
  BOUNDARIES: common.BOUNDARIES, GOLEM_LAYERS: common.GOLEM_LAYERS, ECO_SLASH: common.ECO_SLASH,
  INTRO: common.INTRO, EPILOGUE: common.EPILOGUE, ABOUT: common.ABOUT,
  GATES, SECRETS_LIST: CAVES, DUNGEONS,
  INVENTORY_IDS,
  /** Vérifie que chaque élément de l'inventaire de l'ancien site est rattaché à du contenu. */
  coverage() {
    const where = {};
    const label = (kind, id, obj) => {
      if (kind === 'NPCS') return `PNJ « ${obj.name} » (${REGIONS[npcRegion(id)] ? REGIONS[npcRegion(id)].name : ''})`;
      if (kind === 'PUZZLES') return `Énigme « ${obj.title} »`;
      if (kind === 'CODEX') return `Codex « ${obj.title} »`;
      if (kind === 'MURALS') return `Fresque « ${obj.title} »`;
      if (kind === 'VIDEOS') return `Projection « ${obj.title} »`;
      if (kind === 'MISSIONS') return `Mission terrain « ${obj.title} »`;
      if (kind === 'QUESTIONS') return `Question ouverte « ${obj.title} »`;
      if (kind === 'STATEMENTS') return `Bulle de combat « ${obj.t.slice(0, 40)}… »`;
      return kind + ' ' + id;
    };
    for (const kind of ['NPCS', 'PUZZLES', 'CODEX', 'MURALS', 'VIDEOS', 'MISSIONS', 'QUESTIONS']) {
      for (const [id, obj] of Object.entries(this[kind])) for (const inv of obj.inv || []) (where[inv] = where[inv] || []).push(label(kind, id, obj));
    }
    for (const s of this.STATEMENTS) for (const inv of s.inv || []) (where[inv] = where[inv] || []).push(label('STATEMENTS', s.id, s));
    const covered = INVENTORY_IDS.filter(i => where[i]);
    const missing = INVENTORY_IDS.filter(i => !where[i]);
    return { all: INVENTORY_IDS, covered, missing, where };
  },
};

function npcRegion(id) {
  for (const [rid, r] of Object.entries(REGIONS)) if (r.landmarks.some(l => l.t === 'npc' && l.id === id)) return rid;
  return null;
}
