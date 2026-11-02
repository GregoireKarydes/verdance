// =============================================================
// gen-solutions.mjs — génère SOLUTIONS.md à partir du contenu du jeu
// Usage : node tools/gen-solutions.mjs   (à relancer après toute modification du contenu)
// Les réponses sont lues directement dans js/content/ : le guide reste toujours à jour.
// =============================================================
import { writeFileSync } from 'node:fs';
import { CONTENT } from '../js/content/index.js';
import { REGIONS, DUNGEONS, CAVES } from '../js/content/world.js';

const ORDER = ['village', 'steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge', 'sanctuaire'];
const out = [];
const w = (s = '') => out.push(s);
const clean = s => String(s ?? '').replace(/\n+/g, ' ').replace(/\|/g, '/').trim();
const fmt = n => String(+(+n).toFixed(4)).replace('.', ',');

// ---------- Où se trouve chaque énigme ?
const where = {};
for (const d of Object.values(DUNGEONS)) {
  const temple = d.rooms.some(r => r.final) && d.id !== 'd_index';
  const names = ['salle d’entrée', 'grand hall', 'salle des archives', 'salle des cristaux'];
  d.rooms.filter(r => !r.final).forEach((r, i) => { if (r.puzzle) where[r.puzzle] = temple ? `${d.title}, ${names[i]} (piédestal)` : `${d.title}, salle ${i + 1} (piédestal)`; });
}
for (const [id, n] of Object.entries(CONTENT.NPCS)) {
  const js = JSON.stringify(n.talk || []);
  for (const m of js.matchAll(/puzzle:([a-z0-9_]+)/g)) if (!where[m[1]]) where[m[1]] = `auprès de ${n.name}`;
}
for (const R of Object.values(REGIONS)) for (const L of R.landmarks || []) {
  const s = L.s || ''; const m = s.match(/puzzle:([a-z0-9_]+)/); if (m && !where[m[1]]) where[m[1]] = `${R.name} (${L.t})`;
}
for (const [vid, v] of Object.entries(CONTENT.VIDEOS)) {
  for (const m of JSON.stringify(v.onDone || []).matchAll(/puzzle:([a-z0-9_]+)/g)) if (!where[m[1]]) where[m[1]] = `après la vidéo « ${v.title} » (pierre de projection)`;
}
for (const [sid, sc] of Object.entries(CONTENT.SCRIPTS)) {
  const js = JSON.stringify(sc);
  for (const m of js.matchAll(/puzzle:([a-z0-9_]+)/g)) if (!where[m[1]]) where[m[1]] = `script « ${sid} »`;
}

// ---------- Résolution d'une énigme selon son type
function solve(P) {
  const L = [];
  switch (P.type) {
    case 'qcm':
      P.questions.forEach((q, i) => L.push(`${i + 1}. ${clean(q.q)}  \n   → **${clean(q.options[q.a])}**${q.explain ? ` — ${clean(q.explain)}` : ''}`));
      break;
    case 'fill':
      P.answers.forEach((a, i) => L.push(`- Trou ${i + 1} : **${clean(a)}**`));
      L.push('', `> Texte complet : ${clean(P.text.replace(/\{(\d+)\}/g, (_, k) => `**${P.answers[+k]}**`))}`);
      break;
    case 'input':
      P.fields.forEach(f => L.push(`- ${clean(f.q)} → **${f.accept ? f.accept[0] : fmt(f.num)}${f.unit ? ' ' + f.unit : ''}**${f.tol ? ` (accepté de ${fmt(f.num - f.tol)} à ${fmt(f.num + f.tol)})` : ''}`));
      break;
    case 'lock':
      P.dials.forEach(d => L.push(`- ${clean(d.label)} : **${d.values[d.a]}**`));
      break;
    case 'order':
      L.push(clean(P.label || 'Dans cet ordre :'));
      P.items.forEach((t, i) => L.push(`${i + 1}. ${clean(t)}`));
      break;
    case 'match':
      P.cats.forEach((c, ci) => { const its = P.items.filter(x => x.cat === ci); if (its.length) L.push(`- **${clean(c)}** : ${its.map(x => clean(x.t)).join(' ; ')}`); });
      break;
    case 'choice':
      (P.nodes || []).forEach((n, i) => { const ok = n.options.filter(o => o.ok); L.push(`${i + 1}. ${n.who ? clean(n.who) + ' — ' : ''}${clean(n.text)}  \n   → **${ok.map(o => clean(o.t)).join('** ou **') || '(toutes les réponses font avancer)'}**`); });
      break;
    case 'budget': {
      const n = P.cards.length; let best = null;
      for (let m = 0; m < (1 << n); m++) {
        const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i);
        const r = P.rule(s); if (r && r.ok) { const c = s.reduce((a, i) => a + (P.cards[i].cost || 0), 0); if (!best || s.length < best.s.length || (s.length === best.s.length && c < best.c)) best = { s, c }; }
      }
      if (best) { L.push('Sélectionne exactement :'); best.s.forEach(i => L.push(`- ${clean(P.cards[i].t)}`)); }
      else L.push('_(pas de solution trouvée automatiquement : voir l’explication)_');
      break;
    }
    case 'sliders': {
      const vals = P.sliders.map(s => { const a = []; for (let v = s.min; v <= s.max + 1e-9; v += (s.step || 1)) a.push(+v.toFixed(4)); return a; });
      let best = null, tries = 0;
      const rec = (i, cur) => {
        if (best && tries > 4e6) return; if (i === vals.length) { tries++; const r = P.calc(cur); if (r && r.ok) { const d = cur.reduce((a, v, k) => a + Math.abs(v - (P.sliders[k].init ?? P.sliders[k].min)) / ((P.sliders[k].max - P.sliders[k].min) || 1), 0); if (!best || d < best.d) best = { v: [...cur], d }; } return; }
        for (const v of vals[i]) { cur[i] = v; rec(i + 1, cur); }
      };
      rec(0, []);
      if (best) { L.push('Une solution possible :'); best.v.forEach((v, i) => L.push(`- ${clean(P.sliders[i].label)} : **${fmt(v)}**`)); }
      else L.push('_(pas de solution trouvée automatiquement : voir l’explication)_');
      break;
    }
    case 'fresque':
      L.push('**Étape 1 — les colonnes :**');
      P.columns.forEach((c, ci) => L.push(`- **${clean(c.t)}** : ${P.cards.filter(x => x.c === ci).map(x => clean(x.t)).join(' ; ')}`));
      L.push('', '**Étape 2 — la chaîne, dans l’ordre :**');
      P.chain.items.forEach((t, i) => L.push(`${i + 1}. ${clean(t)}`));
      L.push('', '**Étape 3 —** lire les messages et (facultatif) écrire sa réflexion.');
      break;
    default: L.push('_(type d’énigme non pris en charge par le générateur)_');
  }
  return L;
}

// ---------- Document
w('# Verdance — Guide des solutions');
w();
w('> **Pour qui ?** Pour l’enseignant·e, et pour les élèves **vraiment bloqués**. Essaie d’abord l’indice 💡 dans l’énigme, le **Codex** (touche C) et l’aide de Pousse (touche **H**).');
w('> Utiliser ce guide ne bloque rien, mais une énigme réussie après plusieurs essais ou avec des indices rapporte moins de points qu’une réussite au premier essai.');
w('>');
w('> Ce fichier est **généré automatiquement** à partir du contenu du jeu : `node tools/gen-solutions.mjs`. Ne le modifie pas à la main.');
w();
w('## Sommaire');
w();
ORDER.forEach(r => w(`- [${REGIONS[r].name}](#${r})`));
w(`- [Temples : clé, porte verrouillée et Gardien](#temples)`);
w(`- [Combats : idées reçues (VRAI / FAUX)](#combats)`);
w(`- [Défis d’élite](#elite)`);
w(`- [Questions ouvertes et missions terrain](#ouvertes)`);
w(`- [Passages, objets clés, grottes et coffres à revisiter](#passages)`);
w(`- [Fin du jeu : mon engagement](#engagement)`);
w();
w('## Parcours conseillé');
w();
w('Village → Steppes (ouest) → Bassin (nord des Steppes) → Mines (nord du Bassin) et Marais (sud du village), dans l’ordre que tu veux → Citadelle (nord du village) → Décharge (est du village) → Désert (nord de la Citadelle) → Forge (nord de la Décharge) → Sanctuaire (8 graines).');
w();

for (const r of ORDER) {
  const R = REGIONS[r], C = CONTENT.STORY.CHAPTERS[r];
  w(`<a id="${r}"></a>`);
  w(`## ${C ? `Chapitre ${C.n} — ` : ''}${R.name}`);
  w();
  for (const q of CONTENT.QUESTS_LIST.filter(q => q.region === r)) {
    w(`### ${q.main ? '⭐ Quête principale' : '📜 Quête secondaire'} : ${q.title}`);
    w();
    q.steps.forEach((s, i) => w(`${i + 1}. ${clean(typeof s === 'string' ? s : s.t)}`));
    w();
  }
  const pz = Object.values(CONTENT.PUZZLES).filter(p => p.region === r);
  if (pz.length) {
    w(`### 🧩 Énigmes et quiz`);
    w();
    for (const P of pz) {
      w(`#### ${P.icon || '🧩'} ${clean(P.title)}`);
      if (where[P.id]) w(`_Où : ${where[P.id]}_`);
      w();
      solve(P).forEach(l => w(l));
      if (P.explain) { w(); w(`> 💡 **À retenir :** ${clean(P.explain)}`); }
      w();
    }
  }
}

w('<a id="temples"></a>');
w('## Temples (style « Zelda ») : marche à suivre');
w();
w('Les 8 temples à Graine-Mère partagent la même ossature (une grille de 3 × 3 salles, en miroir un temple sur deux), mais chacun a sa **salle signature** :');
w();
w('```');
w('[ARCHIVES]      [GARDIEN]       [CRISTAUX]');
w('    |  (VRAI/FAUX)    ║ (grande clé)     | (énigme des archives)');
w('[RÉPONSES] -🗝- [GRAND HALL] -(énigme 2)- [BLOC]');
w('                   | (énigme 1)');
w('               [ENTRÉE]');
w('```');
w();
w('1. **Entrée** : énigme du piédestal → la porte nord s’ouvre.');
w('2. **Grand hall** : énigme du piédestal → la porte est s’ouvre.');
w('3. **Salle signature** (à côté du hall, mécanique propre à chaque temple, voir le tableau ci-dessous) : réussis-la, un coffre apparaît : **petite clé**.');
w('4. Retourne au hall : la **porte à serrure** (de l’autre côté) s’ouvre avec la petite clé.');
w('5. **Salle des réponses** : lis la stèle (E). Si l’affirmation est vraie, pousse le bloc sur **VRAI**, sinon sur **FAUX**. En cas d’erreur, le bloc revient et une nouvelle affirmation apparaît : les réponses sont dans le tableau des idées reçues ci-dessous.');
w('6. **Archives** (nord) : énigme du piédestal (s’il y en a une). Elle ouvre **à distance** la porte nord de la salle du bloc.');
w('7. **Salle des cristaux** : frappe les 4 cristaux **dans l’ordre** de la séquence (voir le tableau). S’il y a un piédestal, résous aussi son énigme. Un coffre apparaît : **grande clé**.');
w('8. Au hall, la **grande porte** (nord) s’ouvre avec la grande clé : **le Gardien**. Frappe-le ; à mi-vie il se protège : pare ses bulles (Maj) en répondant juste, puis frappe son **point faible**.');
w('9. Ouvre le coffre du Gardien, puis prends la Graine-Mère sur l’autel.');
w();
const SIGS = {
  steppe: 'La balance des gaz : pousse **CO₂ sur ×1**, **CH₄ sur ×28**, **N₂O sur ×273**. Astuce : monte d’abord le N₂O d’un cran et décale-le, puis place les autres.',
  bassin: 'Les dalles des limites : marche sur chaque dalle pour la mettre en **rouge (dépassée)** : Climat, Biosphère, Sols, Eau douce, Azote/phosphore, Nouvelles entités, Océans acides ; et en **vert (sûre)** : Ozone, Aérosols.',
  mines: 'Le filon : frappe les 3 rochers du tunnel (Néodyme, Indium, Cobalt) pour atteindre le coffre.',
  marais: 'Le grand tri : **rouge = supprimer** Photos en double, Vieux mails pub, Vidéos 4K oubliées, copie_de_copie.zip ; **vert = garder** Mémoire de stage, Factures, Photos de famille, CV à jour. Puis frappe le levier.',
  citadelle: 'La salle qui chauffe : éteins **Site zombie, Test oublié, Copies ×5, Zombie 2015** ; laisse **Messagerie** et **Site de l’école** allumés (≤ 27 °C).',
  desert: 'Le couloir des mirages : les murs qui **scintillent** sont faux. Traverse-les pour atteindre le coffre.',
  decharge: 'L’atelier de réparation : brise les pots pour trouver **Écran, Batterie, Port USB-C**, puis appuie sur E devant l’établi.',
  forge: 'La page obèse : détruis **Pub, Vidéo auto, Carrousel, Trackers, 5 polices** ; garde **Texte, Bouton contact, Image compressée** (≤ 200 Ko).',
};
w('| Temple | Salle signature |');
w('|---|---|');
for (const r of ORDER) { if (!SIGS[r]) continue; const d = Object.values(DUNGEONS).find(x => x.region === r && x.rooms.some(q => q.final)); w(`| ${d ? d.title : r} | ${SIGS[r]} |`); }
w();
w('| Temple | Séquence des cristaux (dans l’ordre) |');
w('|---|---|');
for (const r of ORDER) { const sq = CONTENT.STORY.SEQUENCES[r]; if (!sq) continue; const d = Object.values(DUNGEONS).find(x => x.region === r && x.rooms.some(q => q.final)); w(`| ${d ? d.title : r} (${REGIONS[r].name}) | ${sq.theme} : **${sq.steps.join(' → ')}** |`); }
w();
w('<a id="combats"></a>');
w('## Combats : idées reçues (parade VRAI / FAUX)');
w();
w('Lève le bouclier (**Maj**) face à une bulle, puis réponds. `*` = toutes les régions.');
w();
w('| Région | Affirmation | Réponse | Pourquoi |');
w('|---|---|---|---|');
for (const s of CONTENT.STATEMENTS) w(`| ${s.r === '*' ? '*' : (REGIONS[s.r] ? REGIONS[s.r].name : s.r)} | ${clean(s.t)} | **${s.v ? 'VRAI' : 'FAUX'}** | ${clean(s.x)} |`);
w();

w('<a id="elite"></a>');
w('## Défis d’élite (monstres dorés)');
w();
w('| Région | Question | Bonne réponse |');
w('|---|---|---|');
for (const q of CONTENT.COMBAT_QCM) w(`| ${q.r === '*' || !q.r ? '*' : (REGIONS[q.r] ? REGIONS[q.r].name : q.r)} | ${clean(q.q)} | **${clean(q.options[q.a])}** |`);
w();

w('<a id="ouvertes"></a>');
w('## Questions ouvertes et missions terrain');
w();
w('Il n’y a **pas de réponse unique** : c’est ton raisonnement qui est évalué par l’enseignant·e. Pour bien répondre : au moins 25 mots, **un argument + un exemple concret + un chiffre vu dans le jeu** (Codex).');
w();
for (const q of Object.values(CONTENT.QUESTIONS)) w(`- **${clean(q.title)}** — ${clean(q.q)}`);
w();
w('**Missions terrain** (avec un vrai outil en ligne, résultat personnel) :');
w();
for (const m of Object.values(CONTENT.MISSIONS)) w(`- **${clean(m.title)}**${m.link ? ` — [${clean(m.linkLabel || 'outil')}](${m.link})` : ''} : ${m.fields.map(f => clean(f.q)).join(' ; ')}`);
w();

w('<a id="passages"></a>');
w('## Passages, objets clés et grottes secrètes');
w();
w('| Passage | Il faut |');
w('|---|---|');
for (const g of CONTENT.GATES) w(`| ${REGIONS[g.a].name} ↔ ${REGIONS[g.b].name} | ${clean(g.label)} (\`${g.req}\`) |`);
w();
w('| Grotte | Région | Il faut |');
w('|---|---|---|');
for (const c of Object.values(CAVES)) w(`| ${clean(c.title)} | ${REGIONS[c.region].name} | ${clean(c.lockMsg)} (\`${c.req}\`) |`);
w();

w('| Coffre à revisiter | Région | Il faut |');
w('|---|---|---|');
for (const R of Object.values(REGIONS)) for (const L of R.landmarks || []) if (L.t === 'chest' && (L.s || '').startsWith('chest:')) { const C = CONTENT.CHESTS[L.s.slice(6)]; if (C && C.if) w(`| ${L.id} (x ${L.x}, y ${L.y}) | ${R.name} | \`${C.if}\` |`); }
w();
w('<a id="engagement"></a>');
w('## Fin du jeu : mon engagement');
w();
w('Après le plan d’action final, l’élève choisit **une à trois actions** et les formule avec ses mots (au moins 8 mots), avec une échéance. Il n’y a pas de « bonne » réponse : l’engagement figure dans le bilan PDF.');
w();
writeFileSync(new URL('../SOLUTIONS.md', import.meta.url), out.join('\n'));
console.log('SOLUTIONS.md écrit :', out.length, 'lignes');
