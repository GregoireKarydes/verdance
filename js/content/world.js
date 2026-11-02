// =============================================================
// content/world.js — géographie de Verdance
// Coordonnées des repères en tuiles, relatives à la région (64×48).
// t = type de repère, id = PNJ ou identifiant, s = script (voir content/scripts/*.js)
// =============================================================

/** Disposition des régions (null = océan). */
export const GRID = [
  ['mines', 'desert', 'sanctuaire'],
  ['bassin', 'citadelle', 'forge'],
  ['steppe', 'village', 'decharge'],
  [null, 'marais', null],
];

/** Passages entre régions et ce qu'il faut pour les ouvrir. */
export const GATES = [
  { id: 'g_vs', a: 'village', b: 'steppe', type: 'gate_log', req: 'flag:tuto_fini', label: 'Un tronc calciné bloque le passage.' },
  { id: 'g_sb', a: 'steppe', b: 'bassin', type: 'gate_fog', req: 'item:bouclier', label: 'Un brouillard de désinformation… Il faudrait un bouclier contre les idées reçues.' },
  { id: 'g_bm', a: 'bassin', b: 'mines', type: 'gate_bridge', req: 'item:sceau', label: 'Le pont est effondré. Le Sceau des Limites pourrait le restaurer.' },
  { id: 'g_vm', a: 'village', b: 'marais', type: 'gate_rune', req: 'item:sceau', label: 'Une barrière runique. Elle réagit au Sceau des Limites.' },
  { id: 'g_vc', a: 'village', b: 'citadelle', type: 'gate_chasm', req: 'item:grappin&item:lanterne', label: 'Un gouffre obscur. Il faut de la lumière ET un moyen de le franchir.' },
  { id: 'g_vd', a: 'village', b: 'decharge', type: 'gate_chasm', req: 'item:grappin', label: 'Un gouffre. Un grappin permettrait de passer.' },
  { id: 'g_cd', a: 'citadelle', b: 'desert', type: 'gate_mirage', req: 'item:lentille', label: 'Un mirage brouille le chemin. Une lentille de mesure révélerait le vrai passage.' },
  { id: 'g_df', a: 'decharge', b: 'forge', type: 'gate_door', req: 'item:pinces', label: 'Une porte au mécanisme cassé. Il faudrait des pinces pour la réparer.' },
  { id: 'g_ds', a: 'desert', b: 'sanctuaire', type: 'gate_hallu', req: 'item:cristal', label: 'Un mur d’hallucinations. Seule la sobriété peut le dissiper.' },
  { id: 'g_fs', a: 'forge', b: 'sanctuaire', type: 'gate_rune', req: 'item:plan', label: 'Une porte de bâtisseurs. Il faut le Plan du Bâtisseur.' },
];

export const REGIONS = {
  village: {
    id: 'village', name: 'Village de la Souche', theme: 'village', music: 'village', seed: 101, hub: [32, 26], chapter: 0,
    intro: 'Le Village de la Souche', seedSpot: [32, 20],
    landmarks: [
      { t: 'tree', id: 'arbre_mere', x: 30, y: 13, s: 'arbre_mere' },
      { t: 'npc', id: 'sylve', x: 35, y: 20 },
      { t: 'npc', id: 'holo', x: 27, y: 21 },
      { t: 'house', x: 12, y: 9, variant: 0 }, { t: 'house', x: 46, y: 9, variant: 1 },
      { t: 'house', x: 12, y: 32, variant: 2 }, { t: 'house', x: 46, y: 32, variant: 3 },
      { t: 'stall', x: 38, y: 30 }, { t: 'npc', id: 'baya', x: 39, y: 33 },
      { t: 'npc', id: 'joss', x: 14, y: 13 }, { t: 'npc', id: 'mina', x: 48, y: 13 }, { t: 'npc', id: 'ferdi', x: 14, y: 36 },
      { t: 'well', x: 22, y: 24 }, { t: 'warp', id: 'warp_village', x: 32, y: 25, s: 'warp' },
      { t: 'stele', id: 'stele_souche', x: 37, y: 25, s: 'stele_souche' },
      { t: 'sign', id: 'panneau_village', x: 26, y: 27, s: 'panneau_village' },
      { t: 'cave', id: 'cave_village', x: 52, y: 38, s: 'cave:cave_village' },
      { t: 'chest', id: 'coffre_village', x: 6, y: 42, s: 'chest:coffre_village' },
    ],
    mobs: { kinds: ['co2', 'co2', 'spam'], max: 3 },
  },

  steppe: {
    id: 'steppe', name: 'Steppes de l’Holocène', theme: 'steppe', music: 'steppe', seed: 202, hub: [32, 24], chapter: 1, seedSpot: [31, 22],
    landmarks: [
      { t: 'mural', id: 'fresque_holocene', x: 15, y: 10, s: 'mural:holocene' },
      { t: 'mural', id: 'fresque_acceleration', x: 22, y: 10, s: 'mural:acceleration' },
      { t: 'npc', id: 'aidan', x: 19, y: 15 },
      { t: 'monolith', id: 'proj_rockstrom', x: 30, y: 9, s: 'video:rockstrom' },
      { t: 'temple', id: 'temple_serre', x: 42, y: 22, s: 'dungeon:d_serre' },
      { t: 'npc', id: 'dame_serre', x: 47, y: 27 },
      { t: 'npc', id: 'voyageuse', x: 11, y: 30 },
      { t: 'npc', id: 'f_alim', x: 8, y: 19 }, { t: 'npc', id: 'f_biens', x: 50, y: 11 },
      { t: 'npc', id: 'f_transport', x: 54, y: 36 }, { t: 'npc', id: 'f_habitat', x: 26, y: 38 },
      { t: 'npc', id: 'vigie_cote', x: 40, y: 41 },
      { t: 'cave', id: 'cave_records', x: 54, y: 18, s: 'cave:cave_records' },
      { t: 'altar', id: 'altar_steppe', x: 30, y: 21, s: 'altar' },
      { t: 'warp', id: 'warp_steppe', x: 34, y: 27, s: 'warp' },
      { t: 'chest', id: 'coffre_steppe', x: 6, y: 6, s: 'chest:coffre_steppe' },
    ],
    mobs: { kinds: ['co2', 'co2', 'co2', 'ch4', 'n2o', 'greenwasher'], max: 5 },
  },

  bassin: {
    id: 'bassin', name: 'Bassin des 9 Sceaux', theme: 'bassin', music: 'bassin', seed: 303, hub: [32, 30], chapter: 2, seedSpot: [32, 22],
    landmarks: [
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
        const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
        return { t: 'obelisk', id: 'obelisk_' + i, x: Math.round(32 + Math.cos(a) * 12), y: Math.round(18 + Math.sin(a) * 8), s: 'obelisk:' + i, variant: 0 };
      }),
      { t: 'altar', id: 'altar_bassin', x: 31, y: 17, s: 'altar' },
      { t: 'npc', id: 'neva', x: 36, y: 31 },
      { t: 'temple', id: 'temple_observatoire', x: 44, y: 32, s: 'dungeon:d_observatoire' },
      { t: 'house', x: 6, y: 6, variant: 4 }, { t: 'house', x: 14, y: 6, variant: 5 },
      { t: 'npc', id: 'pol', x: 8, y: 13 }, { t: 'npc', id: 'marga', x: 13, y: 14 }, { t: 'npc', id: 'indi', x: 18, y: 13 },
      { t: 'pedestal', id: 'ped_tribunal', x: 13, y: 17, s: 'tribunal' },
      { t: 'monolith', id: 'proj_limites', x: 52, y: 8, s: 'video:limites' },
      { t: 'npc', id: 'pecheur', x: 54, y: 24 },
      { t: 'npc', id: 'ozonie', x: 8, y: 34 },
      { t: 'cave', id: 'cave_ozone', x: 4, y: 40, s: 'cave:cave_ozone' },
      { t: 'warp', id: 'warp_bassin', x: 28, y: 31, s: 'warp' },
    ],
    mobs: { kinds: ['greenwasher', 'greenwasher', 'lumber', 'co2'], max: 5 },
  },

  mines: {
    id: 'mines', name: 'Mines d’Abysse', theme: 'mines', music: 'mines', seed: 404, hub: [32, 38], chapter: 3, seedSpot: [32, 26],
    landmarks: [
      { t: 'mural', id: 'fresque_mendeleiev', x: 18, y: 7, s: 'mural:mendeleiev' },
      { t: 'npc', id: 'cobalt', x: 23, y: 11 },
      { t: 'monolith', id: 'proj_arte', x: 30, y: 7, s: 'video:arte' },
      { t: 'npc', id: 'lithia', x: 38, y: 13 }, { t: 'anvil', x: 36, y: 14 },
      { t: 'stall', x: 9, y: 24 }, { t: 'npc', id: 'fixie', x: 10, y: 27 },
      { t: 'stall', x: 46, y: 28 }, { t: 'npc', id: 'neuf', x: 47, y: 31 },
      { t: 'screen', id: 'machine_1985', x: 48, y: 8, s: 'machine:1985' },
      { t: 'screen', id: 'machine_2003', x: 51, y: 8, s: 'machine:2003' },
      { t: 'screen', id: 'machine_2022', x: 54, y: 8, s: 'machine:2022' },
      { t: 'npc', id: 'vieux_pc', x: 52, y: 13 },
      { t: 'npc', id: 'comptine', x: 8, y: 38 },
      { t: 'temple', id: 'temple_fonderie', x: 30, y: 28, s: 'dungeon:d_fonderie' },
      { t: 'altar', id: 'altar_mines', x: 31, y: 23, s: 'altar' },
      { t: 'cave', id: 'cave_mine_urbaine', x: 55, y: 38, s: 'cave:cave_mine_urbaine' },
      { t: 'warp', id: 'warp_mines', x: 28, y: 40, s: 'warp' },
    ],
    mobs: { kinds: ['golem', 'cart', 'gear', 'golem'], max: 5 },
  },

  marais: {
    id: 'marais', name: 'Marais des Réseaux', theme: 'marais', music: 'marais', seed: 505, hub: [32, 18], chapter: 4, seedSpot: [32, 22],
    landmarks: [
      { t: 'tower', id: 'tour_guet', x: 29, y: 4, s: 'tour_guet' },
      { t: 'npc', id: 'vigie', x: 33, y: 9 },
      { t: 'dish', id: 'centrale', x: 10, y: 9, s: 'mural:electricite' },
      { t: 'npc', id: 'baud', x: 15, y: 13 },
      { t: 'npc', id: 'ondin', x: 50, y: 40 },
      { t: 'house', x: 6, y: 30, variant: 1 }, { t: 'npc', id: 'archiva', x: 10, y: 35 },
      { t: 'npc', id: 'ecrania', x: 45, y: 13 },
      { t: 'monolith', id: 'proj_numerique', x: 23, y: 28, s: 'video:numerique' },
      { t: 'temple', id: 'temple_relais', x: 40, y: 24, s: 'dungeon:d_relais' },
      { t: 'npc', id: 'calculette', x: 54, y: 20 },
      { t: 'altar', id: 'altar_marais', x: 31, y: 20, s: 'altar' },
      { t: 'cave', id: 'cave_cables', x: 56, y: 32, s: 'cave:cave_cables' },
      { t: 'warp', id: 'warp_marais', x: 28, y: 17, s: 'warp' },
    ],
    mobs: { kinds: ['vampire', 'spam', 'jelly', 'spam'], max: 5 },
  },

  citadelle: {
    id: 'citadelle', name: 'Citadelle des Serveurs', theme: 'citadelle', music: 'citadelle', seed: 606, hub: [32, 34], chapter: 5, seedSpot: [32, 30],
    landmarks: [
      { t: 'temple', id: 'temple_machines', x: 40, y: 18, s: 'dungeon:d_machines' },
      { t: 'npc', id: 'calorine', x: 20, y: 30 }, { t: 'rack', x: 16, y: 27 }, { t: 'rack', x: 24, y: 27 },
      { t: 'npc', id: 'racko', x: 33, y: 38 },
      { t: 'npc', id: 'webarchiviste', x: 12, y: 12 },
      { t: 'npc', id: 'courtiere', x: 48, y: 12 }, { t: 'stall', x: 46, y: 8 },
      { t: 'npc', id: 'calculo', x: 52, y: 32 },
      { t: 'stele', id: 'stele_bordage', x: 27, y: 20, s: 'stele_bordage' },
      { t: 'altar', id: 'altar_citadelle', x: 31, y: 29, s: 'altar' },
      { t: 'cave', id: 'cave_serveur', x: 6, y: 40, s: 'cave:cave_serveur' },
      { t: 'warp', id: 'warp_citadelle', x: 28, y: 36, s: 'warp' },
    ],
    mobs: { kinds: ['zombie', 'flame', 'zombie', 'spam'], max: 5 },
  },

  desert: {
    id: 'desert', name: 'Désert des Oracles', theme: 'desert', music: 'desert', seed: 707, hub: [32, 36], chapter: 6, seedSpot: [32, 28],
    landmarks: [
      { t: 'tower', id: 'tour_oracle_a', x: 26, y: 3 }, { t: 'tower', id: 'tour_oracle_b', x: 36, y: 3 },
      { t: 'npc', id: 'gargantua', x: 32, y: 10 },
      { t: 'npc', id: 'mini', x: 24, y: 16 },
      { t: 'npc', id: 'source', x: 11, y: 30 },
      { t: 'npc', id: 'lex', x: 50, y: 12 },
      { t: 'npc', id: 'ayla', x: 48, y: 34 },
      { t: 'npc', id: 'puce', x: 14, y: 12 },
      { t: 'npc', id: 'promptia', x: 40, y: 30 },
      { t: 'monolith', id: 'proj_ia', x: 19, y: 21, s: 'video:ia' },
      { t: 'temple', id: 'temple_labyrinthe', x: 30, y: 18, s: 'dungeon:d_labyrinthe' },
      { t: 'altar', id: 'altar_desert', x: 31, y: 27, s: 'altar' },
      { t: 'cave', id: 'cave_oasis', x: 6, y: 40, s: 'cave:cave_oasis' },
      { t: 'warp', id: 'warp_desert', x: 28, y: 38, s: 'warp' },
    ],
    mobs: { kinds: ['hallu', 'promptspam', 'mirage', 'hallu'], max: 5 },
  },

  decharge: {
    id: 'decharge', name: 'Décharge de Ferraille', theme: 'decharge', music: 'decharge', seed: 808, hub: [30, 26], chapter: 7, seedSpot: [30, 30],
    landmarks: [
      { t: 'crane', x: 42, y: 6 },
      { t: 'temple', id: 'temple_proces', x: 26, y: 12, s: 'dungeon:d_proces' },
      { t: 'npc', id: 'durabilis', x: 31, y: 17 },
      { t: 'npc', id: 'obsolete', x: 35, y: 19 },
      { t: 'stall', x: 10, y: 10 }, { t: 'npc', id: 'fixie2', x: 11, y: 13 },
      { t: 'npc', id: 'ewan', x: 50, y: 30 },
      { t: 'npc', id: 'fairphonia', x: 16, y: 34 },
      { t: 'npc', id: 'barometre', x: 44, y: 20 },
      { t: 'npc', id: 'maire', x: 54, y: 40 }, { t: 'house', x: 54, y: 34, variant: 2 },
      { t: 'altar', id: 'altar_decharge', x: 29, y: 29, s: 'altar' },
      { t: 'cave', id: 'cave_epave', x: 6, y: 40, s: 'cave:cave_epave' },
      { t: 'warp', id: 'warp_decharge', x: 26, y: 27, s: 'warp' },
    ],
    mobs: { kinds: ['rat', 'printer', 'gear', 'rat'], max: 5 },
  },

  forge: {
    id: 'forge', name: 'Forge des Bâtisseurs', theme: 'forge', music: 'forge', seed: 909, hub: [32, 26], chapter: 8, seedSpot: [32, 18],
    landmarks: [
      { t: 'npc', id: 'sobre', x: 32, y: 20 },
      { t: 'book', id: 'livre_greenit', x: 7, y: 7, s: 'livre:greenit' }, { t: 'book', id: 'livre_designers', x: 9, y: 7, s: 'livre:designers' },
      { t: 'book', id: 'livre_afnor', x: 11, y: 7, s: 'livre:afnor' }, { t: 'book', id: 'livre_rgesn', x: 13, y: 7, s: 'livre:rgesn' },
      { t: 'npc', id: 'reference', x: 10, y: 11 },
      { t: 'pedestal', id: 'atelier_spec', x: 24, y: 23, s: 'atelier:spec' },
      { t: 'pedestal', id: 'atelier_design', x: 20, y: 34, s: 'atelier:design' },
      { t: 'pedestal', id: 'atelier_dev', x: 44, y: 34, s: 'atelier:dev' },
      { t: 'sign', id: 'atelier_host', x: 40, y: 23, s: 'atelier:host' },
      { t: 'npc', id: 'epure', x: 18, y: 31 }, { t: 'npc', id: 'rusta', x: 47, y: 31 },
      { t: 'npc', id: 'valeur', x: 50, y: 11 },
      { t: 'npc', id: 'truffe', x: 40, y: 41 },
      { t: 'arcade', id: 'arcade', x: 26, y: 9, s: 'arcade' },
      { t: 'npc', id: 'apollon', x: 55, y: 22 },
      { t: 'npc', id: 'cmsia', x: 8, y: 30 },
      { t: 'npc', id: 'niveaux', x: 36, y: 12 },
      { t: 'monolith', id: 'proj_eco', x: 28, y: 15, s: 'video:eco' },
      { t: 'temple', id: 'temple_atelier', x: 44, y: 4, s: 'dungeon:d_atelier' },
      { t: 'spot', id: 'arene_golem', x: 32, y: 38 },
      { t: 'altar', id: 'altar_forge', x: 31, y: 16, s: 'altar' },
      { t: 'cave', id: 'cave_apollo', x: 56, y: 40, s: 'cave:cave_apollo' },
      { t: 'warp', id: 'warp_forge', x: 28, y: 26, s: 'warp' },
    ],
    mobs: { kinds: ['blob', 'carousel', 'tracker', 'blob'], max: 5 },
  },

  sanctuaire: {
    id: 'sanctuaire', name: 'Sanctuaire de la Mesure', theme: 'sanctuaire', music: 'sanctuaire', seed: 1010, hub: [32, 32], chapter: 9, seedSpot: [32, 24],
    landmarks: [
      { t: 'npc', id: 'indexa', x: 32, y: 28 },
      { t: 'npc', id: 'kpi', x: 44, y: 20 },
      { t: 'monolith', id: 'proj_concept', x: 20, y: 20, s: 'video:concept' },
      { t: 'temple', id: 'temple_index', x: 30, y: 8, s: 'dungeon:d_index' },
      { t: 'stele', id: 'stele_mesure', x: 26, y: 30, s: 'stele_mesure' },
      { t: 'cave', id: 'cave_sanctuaire', x: 54, y: 38, s: 'cave:cave_sanctuaire' },
      { t: 'warp', id: 'warp_sanctuaire', x: 36, y: 34, s: 'warp' },
    ],
    mobs: { kinds: ['greenwasher', 'hallu', 'blob', 'zombie'], max: 4 },
  },
};

/** Donjons / escape games. rooms[i].puzzle = id d'énigme (content/puzzles/*). */
export const DUNGEONS = {
  d_serre: { id: 'd_serre', region: 'steppe', title: 'Temple de la Serre', req: 'flag:serre_ouvert', lockMsg: 'La porte est scellée. Dame Serre en garde la clé.',
    rooms: [{ puzzle: 'serre_trous', mobs: ['co2', 'co2'], mural: 'mural:effet_serre' }, { puzzle: 'serre_vannes', mobs: ['ch4', 'co2'], water: 1 }, { puzzle: 'serre_temperature', mobs: ['n2o', 'co2', 'co2'] }, { final: { chest: 'chest:bouclier', seed: 'seed:steppe' }, layout: 'open' }] },
  d_observatoire: { id: 'd_observatoire', region: 'bassin', title: 'Observatoire des Limites', req: 'flag:observatoire_ouvert', lockMsg: 'Néva n’a pas encore ouvert l’Observatoire.',
    rooms: [{ puzzle: 'obs_terminal', mobs: ['greenwasher'] }, { puzzle: 'obs_cadrans', mobs: ['lumber', 'greenwasher'], mural: 'mural:limites' }, { final: { chest: 'chest:sceau', seed: 'seed:bassin' }, layout: 'open' }] },
  d_fonderie: { id: 'd_fonderie', region: 'mines', title: 'La Fonderie', req: 'flag:fonderie_ouverte', lockMsg: 'Le contremaître Cobalt garde l’entrée de la Fonderie.',
    rooms: [{ puzzle: 'fond_smartphone', mobs: ['golem'] }, { puzzle: 'fond_terminal', mobs: ['cart', 'gear'] }, { puzzle: 'fond_acv', mobs: ['golem', 'gear'], mural: 'mural:acv' }, { puzzle: 'fond_jauges', mobs: ['golem'] }, { final: { chest: 'chest:lanterne', seed: 'seed:mines' }, layout: 'open' }] },
  d_relais: { id: 'd_relais', region: 'marais', title: 'Le Relais', req: 'flag:relais_ouvert', lockMsg: 'Le Relais est verrouillé. La vigie de la tour en a le code.',
    rooms: [{ puzzle: 'relais_reseau', mobs: ['spam', 'spam'], water: 1 }, { puzzle: 'relais_streaming', mobs: ['jelly', 'vampire'] }, { puzzle: 'relais_quiz', mobs: ['spam', 'jelly'] }, { final: { chest: 'chest:grappin', seed: 'seed:marais' }, layout: 'open' }] },
  d_machines: { id: 'd_machines', region: 'citadelle', title: 'Salle des Machines', req: 'flag:machines_ouvert', lockMsg: 'Racko refuse l’accès tant que tu n’as pas parlé à Calorine.',
    rooms: [{ puzzle: 'dc_pue', mobs: ['flame', 'flame'] }, { puzzle: 'dc_hebergeur', mobs: ['zombie', 'zombie'] }, { puzzle: 'dc_chaleur', mobs: ['flame', 'zombie'], mural: 'mural:datacenters' }, { final: { chest: 'chest:lentille', seed: 'seed:citadelle' }, layout: 'open' }] },
  d_labyrinthe: { id: 'd_labyrinthe', region: 'desert', title: 'Labyrinthe de l’Oracle', req: 'flag:labyrinthe_ouvert', lockMsg: 'Gargantua bloque l’entrée de son labyrinthe.',
    rooms: [{ puzzle: 'ia_train_inf', mobs: ['hallu'], mural: 'mural:ia' }, { puzzle: 'ia_bon_modele', mobs: ['promptspam', 'hallu'] }, { puzzle: 'ia_rebond', mobs: ['mirage', 'hallu'] }, { puzzle: 'ia_aiact', mobs: ['hallu', 'promptspam'] }, { final: { chest: 'chest:cristal', seed: 'seed:desert' }, layout: 'open' }] },
  d_proces: { id: 'd_proces', region: 'decharge', title: 'Le Procès de l’Obsolescence', req: 'flag:proces_ouvert', lockMsg: 'Le tribunal n’ouvre que quand la Juge Durabilis le décide.',
    rooms: [{ puzzle: 'proces_preuves', mobs: ['rat', 'printer'] }, { puzzle: 'proces_lois', mobs: ['gear', 'printer'] }, { puzzle: 'proces_verdict', mobs: [] }, { final: { chest: 'chest:pinces', seed: 'seed:decharge' }, layout: 'open' }] },
  d_atelier: { id: 'd_atelier', region: 'forge', title: 'L’Atelier du Bâtisseur', req: 'flag:atelier_ouvert', lockMsg: 'Maître Sobre ouvrira l’Atelier quand tu auras vaincu le Golem Obésiciel.',
    rooms: [{ puzzle: 'atelier_3u', mobs: ['blob', 'carousel'] }, { puzzle: 'atelier_budget', mobs: ['tracker', 'blob'] }, { puzzle: 'atelier_quiz', mobs: ['blob', 'blob'] }, { final: { chest: 'chest:plan', seed: 'seed:forge' }, layout: 'open' }] },
  d_index: { id: 'd_index', region: 'sanctuaire', title: 'Le Sceau de l’Index', req: 'flag:index_ouvert', lockMsg: 'Indexa doit d’abord t’initier à la mesure.',
    rooms: [{ puzzle: 'index_calc', mobs: ['blob'] }, { puzzle: 'index_kpi', mobs: ['zombie', 'hallu'] }, { boss: true, layout: 'open' }] },
};

/** Grottes secrètes. req = condition d'entrée. items = contenus (coffres, livres). */
export const CAVES = {
  cave_village: { id: 'cave_village', region: 'village', title: 'Grenier oublié', req: 'item:lanterne', lockMsg: 'Il fait trop noir pour entrer. Une lanterne aiderait.',
    items: [{ t: 'book', s: 'secret:archives' }, { t: 'chest', s: 'chest:heart_village' }] },
  cave_records: { id: 'cave_records', region: 'steppe', title: 'Grotte des Records', req: 'item:lanterne', lockMsg: 'La grotte est plongée dans le noir. Reviens avec une lanterne.',
    items: [{ t: 'book', s: 'secret:records' }, { t: 'chest', s: 'chest:graines_records' }] },
  cave_ozone: { id: 'cave_ozone', region: 'bassin', title: 'Abri du Ciel Réparé', req: 'flag:ozone_vu', lockMsg: 'L’entrée est envahie de ronces. Ozonie sait peut-être comment passer.',
    items: [{ t: 'book', s: 'secret:ozone' }, { t: 'chest', s: 'chest:heart_ozone' }] },
  cave_mine_urbaine: { id: 'cave_mine_urbaine', region: 'mines', title: 'La Mine Urbaine', req: 'item:lanterne', lockMsg: 'Trop sombre… La Fonderie cache peut-être une lanterne.',
    items: [{ t: 'book', s: 'secret:mine_urbaine' }, { t: 'chest', s: 'chest:graines_mine' }] },
  cave_cables: { id: 'cave_cables', region: 'marais', title: 'Grotte des Câbles', req: 'item:grappin', lockMsg: 'Un ravin sépare l’entrée. Un grappin serait utile.',
    items: [{ t: 'book', s: 'secret:cables' }, { t: 'chest', s: 'chest:heart_cables' }] },
  cave_serveur: { id: 'cave_serveur', region: 'citadelle', title: 'Le Serveur Oublié', req: 'item:lentille', lockMsg: 'Ce mur semble… faux ? Une lentille révélerait le passage.',
    items: [{ t: 'book', s: 'secret:serveur' }, { t: 'chest', s: 'chest:graines_serveur' }] },
  cave_oasis: { id: 'cave_oasis', region: 'desert', title: 'L’Oasis Cachée', req: 'item:cristal', lockMsg: 'Un mirage bloque l’entrée.',
    items: [{ t: 'book', s: 'secret:oasis' }, { t: 'chest', s: 'chest:heart_oasis' }] },
  cave_epave: { id: 'cave_epave', region: 'decharge', title: 'L’Épave de 1985', req: 'item:pinces', lockMsg: 'Une grille rouillée. Il faudrait des pinces.',
    items: [{ t: 'book', s: 'secret:epave' }, { t: 'chest', s: 'chest:heart_epave' }] },
  cave_apollo: { id: 'cave_apollo', region: 'forge', title: 'La Salle Apollo', req: 'item:pinces', lockMsg: 'Un panneau vissé. Des pinces feraient l’affaire.',
    items: [{ t: 'book', s: 'secret:apollo' }, { t: 'chest', s: 'chest:graines_apollo' }] },
  cave_sanctuaire: { id: 'cave_sanctuaire', region: 'sanctuaire', title: 'La Bibliothèque Verte', req: 'item:plan', lockMsg: 'Une porte gravée de plans. Il faut le Plan du Bâtisseur.',
    items: [{ t: 'book', s: 'secret:bibliotheque' }, { t: 'chest', s: 'chest:heart_sanctuaire' }] },
};
