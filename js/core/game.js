// =============================================================
// game.js — boucle de jeu, rendu, scripts, quêtes, combat, suivi
// =============================================================
import { TILE, clamp, dist, lerp, rng, hash2, md, esc, wordCount, sleep } from './util.js';
import { input } from './input.js';
import { audio } from './audio.js';
import { tile, prop, icon, creature, text, palette } from './gfx.js';
import { buildWorld, solidAt, RW, RH, KINDS, SOLID, regionOrigin } from './world.js';
import { Player, Mob, NPC, Bubble, Pickup, Particles, FloatText } from './entities.js';
import { dialogue, toast, showBanner, modal, fanfare, alertBox, isBlocking, confirmBox } from './ui.js';
import { openPuzzle } from './puzzles.js';
import { saveState, logEvent } from './state.js';
import { REGIONS, GATES, DUNGEONS, CAVES, GRID } from '../content/world.js';
import { MOBS } from '../content/mobs.js';
import { CONTENT } from '../content/index.js';
import { CONFIG } from '../content/config.js';

export const VW = 400, VH = 240;
const ORDER = ['village', 'steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge', 'sanctuaire'];
export const SEED_REGIONS = ['steppe', 'bassin', 'mines', 'marais', 'citadelle', 'desert', 'decharge', 'forge'];

export class Game {
  constructor(canvas, settings, hooks = {}) {
    this.cv = canvas; this.ctx = canvas.getContext('2d'); this.ctx.imageSmoothingEnabled = false;
    this.settings = settings; this.hooks = hooks;
    this.world = buildWorld();
    this.cam = { x: 0, y: 0 }; this.shakeT = 0; this.shakeA = 0; this.flashC = null; this.flashT = 0;
    this.entities = []; this.particles = new Particles(); this.floats = [];
    this.greenVis = {}; this.greenAnim = {};
    this.time = 0; this.busy = 0; this.running = false; this.paused = false;
    this.spawnT = 0; this.saveT = 0; this.lastInput = performance.now();
    this.teacher = null; this.region = null; this.golemWeight = 3800;
    this.waterFrame = 0; this.minimap = null; this.seenGateMsg = {};
    this._buildMinimap();
  }

  // ================================================================ Démarrage
  start(state) {
    this.state = state;
    const S = state;
    for (const r of ORDER) { this.greenVis[r] = S.seeds[r] || (r === 'village' && this.seedCount() >= 8) ? 1 : 0; }
    this.greenVis.village = clamp(this.seedCount() / 8, 0, 1);
    if (!S.x) { // nouvelle partie : devant l'Arbre-Mère
      const o = regionOrigin('village'); S.x = (o.x + 32) * TILE + 8; S.y = (o.y + 21) * TILE + 12;
    }
    this.enterMap(S.map, S.x, S.y, true);
    this.running = true;
    this.trackSessionStart();
  }

  enterMap(mapId, x, y, silent) {
    const S = this.state;
    this.map = this.world.maps[mapId] || this.world.maps.overworld;
    S.map = this.map.id;
    this.player = new Player(x, y); this.player.dir = S.dir || 0;
    this.entities = [this.player];
    this.particles.list = []; this.floats = [];
    // PNJ
    for (const lm of this.map.landmarks) if (lm.t === 'npc') {
      const def = CONTENT.NPCS[lm.id]; if (!def) { console.warn('PNJ manquant', lm.id); continue; }
      this.entities.push(new NPC(def, lm));
    }
    if (this.map.interior) {
      this.region = this.map.region;
      this.roomSpawned = {};
      showBanner(this.map.title, REGIONS[this.region].name);
      audio.play('dungeon', this.isGreen(this.region) ? 1 : 0);
    } else {
      this.region = null; // forcera l'annonce de région
    }
    this.snapCamera();
    if (!silent) audio.sfx('warp');
  }

  // ================================================================ Boucle
  frame(dt) {
    if (!this.running) return;
    dt = Math.min(dt, 0.05);
    input.update();
    if (input.cur.size) this.lastInput = performance.now();
    const blocked = isBlocking() || this.busy > 0;
    if (!blocked && !this.paused) {
      this.update(dt);
      if (input.pressed('pause')) this.hooks.openMenu && this.hooks.openMenu('pause');
      else if (input.pressed('inventory')) this.hooks.openMenu && this.hooks.openMenu('inventory');
      else if (input.pressed('map')) this.hooks.openMenu && this.hooks.openMenu('map');
      else if (input.pressed('codex')) this.hooks.openMenu && this.hooks.openMenu('codex');
      else if (input.pressed('journal')) this.hooks.openMenu && this.hooks.openMenu('journal');
    }
    this.trackTime(dt, blocked);
    this.render(dt);
  }

  update(dt) {
    this.time += dt;
    this.waterFrame = Math.floor(this.time * 3) % 4;
    const p = this.player;
    for (const e of this.entities) if (!e.dead) e.update(this, dt);
    this.entities = this.entities.filter(e => !e.dead || e === p);
    this.particles.update(dt);
    this.floats = this.floats.filter(f => f.update(dt));
    // région courante (surface)
    if (!this.map.interior) {
      const reg = this.map.regionAt(Math.floor(p.x / TILE), Math.floor(p.y / TILE));
      if (reg && reg !== this.region) this.onEnterRegion(reg);
      this.visitChunk(p.x, p.y);
      this.checkGates();
      this.spawnT -= dt; if (this.spawnT <= 0) { this.spawnT = 1.6; this.spawnAmbient(); }
    } else this.updateDungeon(dt);
    // animations de reverdissement
    for (const [r, a] of Object.entries(this.greenAnim)) {
      a.t += dt; this.greenVis[r] = clamp(a.from + (a.to - a.from) * (a.t / a.dur), 0, 1);
      if (a.t >= a.dur) { delete this.greenAnim[r]; this._buildMinimap(); }
    }
    // météo
    this.weather(dt);
    // interaction
    if (input.pressed('interact')) this.interact();
    // auto-sauvegarde
    this.saveT -= dt; if (this.saveT <= 0) { this.saveT = 30; this.save(); }
    if (this.shakeT > 0) this.shakeT -= dt;
    if (this.flashT > 0) this.flashT -= dt;
  }

  // ================================================================ Collisions
  gateOpen = (p) => {
    if (p.gate) return !!this.state.gates[p.gate];
    if (p.dgate) return !!this.state.dgates[p.dgate];
    return false;
  };
  solid(x, y) { return solidAt(this.map, x, y, this.gateOpen); }
  move(e, dx, dy) {
    const hw = e.w / 2, h = e.h;
    const blocked = (x, y) => this.solid(x - hw, y - h) || this.solid(x + hw, y - h) || this.solid(x - hw, y - 1) || this.solid(x + hw, y - 1) || (e.w > 14 && (this.solid(x, y - h) || this.solid(x, y - 1)));
    if (dx) { if (!blocked(e.x + dx, e.y)) e.x += dx; else if (e === this.player && !dy) { // glissement aux coins
        if (!blocked(e.x + dx, e.y - 3)) { e.y -= 1; } else if (!blocked(e.x + dx, e.y + 3)) { e.y += 1; } } }
    if (dy) { if (!blocked(e.x, e.y + dy)) e.y += dy; else if (e === this.player && !dx) {
        if (!blocked(e.x - 3, e.y + dy)) { e.x -= 1; } else if (!blocked(e.x + 3, e.y + dy)) { e.x += 1; } } }
    e.x = clamp(e.x, 8, this.map.w * TILE - 8); e.y = clamp(e.y, 12, this.map.h * TILE - 2);
  }

  // ================================================================ Régions
  onEnterRegion(reg) {
    const first = !this.region;
    this.region = reg;
    const R = REGIONS[reg];
    const S = this.state;
    if (!S.flags['visite_' + reg]) { S.flags['visite_' + reg] = true; logEvent(S, 'region', { region: reg }); }
    showBanner(R.name, this.isGreen(reg) ? '🌿 Reverdi' : `Chapitre ${R.chapter}`);
    audio.play(R.music, this.greenVis[reg] > 0.5 ? 1 : 0);
    // Tue les mobs des autres régions
    this.entities = this.entities.filter(e => !(e instanceof Mob) || e.region === reg || e.def.boss);
    if (CONTENT.ON_ENTER[reg]) this.runActions(CONTENT.ON_ENTER[reg], { region: reg });
  }
  isGreen(r) { return r === 'village' ? this.seedCount() >= 8 : !!this.state.seeds[r]; }
  seedCount() { return Object.keys(this.state.seeds).length; }
  verdance() {
    // jauge globale : graines (70 %) + quêtes principales (30 %)
    const s = this.seedCount() / 8;
    const mainDone = CONTENT.QUESTS_LIST.filter(q => q.main && this.state.quests[q.id] && this.state.quests[q.id].status === 'done').length;
    const mainTot = CONTENT.QUESTS_LIST.filter(q => q.main).length;
    return Math.round((s * 0.7 + (mainDone / mainTot) * 0.3) * 100);
  }
  tunicColor() { const g = this.verdance() / 100; return g > 0.75 ? '#3fd66a' : g > 0.4 ? '#45b55a' : '#3f9a52'; }

  // ================================================================ Portes entre régions
  checkGates() {
    const p = this.player;
    for (const g of GATES) {
      if (this.state.gates[g.id]) continue;
      const [cx, cy] = g.cells[0];
      const gx = cx * TILE + 16, gy = cy * TILE + 8;
      const near = g.cells.some(([x, y]) => dist(p.x, p.y, x * TILE + 8, y * TILE + 8) < 26);
      if (!near) { this.seenGateMsg[g.id] = false; continue; }
      if (this.cond(g.req)) this.openGate(g);
      else if (!this.seenGateMsg[g.id]) { this.seenGateMsg[g.id] = true; toast('🔒 ' + esc(g.label), 'lock', 4200); }
    }
  }
  async openGate(g) {
    this.state.gates[g.id] = true; audio.sfx('unlock'); this.shake(3);
    for (const [x, y] of g.cells) this.particles.burst(x * TILE + 8, y * TILE + 8, '#bfffcf', 10, 50, 0.8);
    const msg = { gate_fog: 'Le Bouclier de Vérité dissipe le brouillard de désinformation !', gate_bridge: 'Le Sceau des Limites reconstruit le pont.', gate_rune: 'La barrière s’ouvre.', gate_chasm: 'Tu franchis le gouffre !', gate_mirage: 'La Lentille révèle le vrai chemin.', gate_door: 'Clic ! Les Pinces réparent le mécanisme.', gate_hallu: 'Le Cristal de Sobriété dissipe les hallucinations.', gate_log: 'Le passage vers l’ouest est dégagé.' }[g.type] || 'Passage ouvert.';
    toast('🔓 ' + msg, 'good', 4200);
    logEvent(this.state, 'gate', { gate: g.id });
    this.save();
  }

  // ================================================================ Interaction
  interact() {
    const p = this.player;
    const D = [[0, 1], [0, -1], [-1, 0], [1, 0]][p.dir];
    const fx = p.x + D[0] * 14, fy = p.y - 5 + D[1] * 14;
    // PNJ
    let best = null, bd = 22;
    for (const e of this.entities) if (e instanceof NPC) { const d = dist(fx, fy, e.x, e.y - 6); if (d < bd) { bd = d; best = e; } }
    if (best) return this.talkTo(best);
    // Props
    for (const pr of this.map.props) {
      if (pr.hidden) continue;
      const b = pr.box || [pr.x, pr.y, pr.w, pr.h];
      const pad = 6;
      if (fx >= b[0] - pad && fx < b[0] + b[2] + pad && fy >= b[1] - pad && fy < b[1] + b[3] + pad) {
        if (pr.exit) return this.exitInterior();
        if (pr.lm) return this.useLandmark(pr.lm, pr);
        if (pr.gate) { const g = GATES.find(x => x.id === pr.gate); if (g && !this.state.gates[g.id]) toast('🔒 ' + esc(g.label), 'lock'); return; }
        if (pr.dgate && !this.state.dgates[pr.dgate]) { toast('🔒 La porte s’ouvrira quand l’énigme de cette salle sera résolue.', 'lock'); return; }
      }
    }
    // sortie par la porte (en marchant dessus aussi)
  }

  async talkTo(npc) {
    this.busy++;
    try {
      const S = this.state;
      const tr = S.tracker.dialogues[npc.id] || (S.tracker.dialogues[npc.id] = { views: 0, bubbles: 0, read: 0, skimmed: 0, region: npc.lm.region });
      tr.views++;
      S.flags['parle_' + npc.id] = true;
      await this.runEntries(npc.def.talk, { npc, who: npc.def.name, portrait: npc.sprite(0) });
    } finally { this.busy--; }
  }

  async useLandmark(lm, pr) {
    this.busy++;
    try {
      const ctx = { lm, pr, region: lm.region };
      if (lm.puzzle) {
        const tr = this.state.tracker.puzzles[lm.puzzle];
        if (tr && tr.success) {
          if (lm.room !== undefined) this.state.dgates[`${lm.map}:${lm.room}`] = true;
          toast('✔ Énigme déjà résolue.', 'info');
        } else {
          if (lm.script) await this.runScript(lm.script, ctx);
          await this.runPuzzle(lm.puzzle, ctx);
        }
      } else await this.runScript(lm.s || lm.script, ctx);
    }
    finally { this.busy--; }
  }

  // ================================================================ Scripts
  /** Résout un identifiant de script : préfixes spéciaux ou entrée de SCRIPTS. */
  async runScript(sid, ctx = {}) {
    if (!sid) return;
    const [kind, arg] = sid.split(':');
    const C = CONTENT;
    switch (kind) {
      case 'mural': return this.showMural(arg, ctx);
      case 'video': return this.showVideo(arg, ctx);
      case 'dungeon': return this.enterDungeon(arg, ctx);
      case 'cave': return this.enterCave(arg, ctx);
      case 'chest': return this.openChest(arg, ctx);
      case 'seed': return this.takeSeed(arg, ctx);
      case 'warp': return this.useWarp(ctx);
      case 'altar': return this.useAltar(ctx);
      case 'arcade': return this.hooks.arcade && this.hooks.arcade(this);
      default: {
        const key = arg !== undefined ? sid : kind;
        const entries = C.SCRIPTS[key];
        if (!entries) { console.warn('Script manquant', sid); toast('…', 'info'); return; }
        return this.runEntries(entries, ctx);
      }
    }
  }

  async runEntries(entries, ctx) {
    const e = entries.find(x => !x.if || this.cond(x.if));
    if (!e) return;
    const lines = (e.say || []).map(l => this.line(l, ctx));
    let choice = null;
    if (lines.length || e.ask) {
      const ask = e.ask;
      if (ask && !lines.length) lines.push(this.line(ask.q, ctx));
      else if (ask) lines.push(this.line(ask.q, ctx));
      const r = await dialogue(lines, ask ? ask.options.map(o => o.t) : null);
      this.trackDialogue(ctx, r.stats);
      choice = r.choice;
    }
    if (e.act) await this.runActions(e.act, ctx);
    if (e.ask && choice !== null) {
      const o = e.ask.options[choice];
      if (o.say) { const r2 = await dialogue(o.say.map(l => this.line(l, ctx))); this.trackDialogue(ctx, r2.stats); }
      if (o.act) await this.runActions(o.act, ctx);
    }
  }
  line(l, ctx) {
    if (typeof l === 'string') return { who: ctx.who || '', t: this.fmt(l), portrait: ctx.portrait };
    if (l.who === '@') return { who: this.state.identity.prenom || 'Toi', t: this.fmt(l.t), portrait: creature('seed') };
    const npc = l.who && CONTENT.NPCS[l.who];
    return { who: npc ? npc.name : (l.who || ''), t: this.fmt(l.t), portrait: npc ? this.npcPortrait(npc) : ctx.portrait };
  }
  npcPortrait(def) { const ent = this.entities.find(e => e instanceof NPC && e.id === def.id); return ent ? ent.sprite(0) : null; }
  fmt(t) { return String(t).replace(/\{nom\}/g, this.state.identity.prenom || 'Gardien·ne').replace(/\{graines\}/g, this.state.graines).replace(/\{seeds\}/g, this.seedCount()); }

  /** Conditions : 'flag:x', '!flag:x', 'item:x', 'quest:id', 'done:id', 'step:id>=2', 'seeds>=3', 'a&b' */
  cond(c) {
    if (!c) return true;
    if (Array.isArray(c)) return c.every(x => this.cond(x));
    if (c.includes('|')) return c.split('|').some(x => this.cond(x));
    if (c.includes('&')) return c.split('&').every(x => this.cond(x));
    let neg = false; if (c[0] === '!') { neg = true; c = c.slice(1); }
    const S = this.state; let r = false;
    const m = c.match(/^(\w+):?([\w-]*)(?:(>=|==|<=|>|<)(\d+))?$/) || c.match(/^(seeds)(>=|==)(\d+)$/);
    const [k, a] = c.split(':');
    if (k === 'flag') r = !!S.flags[a];
    else if (k === 'item') r = !!S.items[a];
    else if (k === 'quest') r = !!S.quests[a];
    else if (k === 'done') r = !!(S.quests[a] && S.quests[a].status === 'done');
    else if (k === 'seed') r = !!S.seeds[a];
    else if (k === 'codex') r = !!S.codex[a];
    else if (k === 'puzzle') r = !!(S.tracker.puzzles[a] && S.tracker.puzzles[a].success);
    else if (k === 'teacher') r = !!this.teacher;
    else if (k.startsWith('step')) { const mm = c.match(/^step:([\w-]+)(>=|==|<)(\d+)$/); if (mm) { const st = S.quests[mm[1]] ? S.quests[mm[1]].step : -1; const v = +mm[3]; r = mm[2] === '>=' ? st >= v : mm[2] === '==' ? st === v : st < v; } }
    else if (k.startsWith('seeds')) { const mm = c.match(/^seeds(>=|==)(\d+)$/); if (mm) r = mm[1] === '>=' ? this.seedCount() >= +mm[2] : this.seedCount() === +mm[2]; }
    else if (k.startsWith('graines')) { const mm = c.match(/^graines>=(\d+)$/); if (mm) r = S.graines >= +mm[1]; }
    else if (k.startsWith('count')) { const mm = c.match(/^count:([\w]+)(>=)(\d+)$/); if (mm) { const pre = mm[1]; r = Object.keys(S.flags).filter(f => f.startsWith(pre)).length >= +mm[3]; } }
    return neg ? !r : r;
  }

  /** Exécute une liste d'actions (séquentiel). Une action « bloquante » qui échoue interrompt la suite. */
  async runActions(list, ctx = {}) {
    for (const a of list) {
      const ok = await this.action(a, ctx);
      if (ok === false) return false;
    }
    return true;
  }
  async action(a, ctx) {
    const S = this.state; const C = CONTENT;
    const [k, ...rest] = a.split(':'); const arg = rest.join(':');
    switch (k) {
      case 'flag': S.flags[arg] = true; break;
      case 'unflag': delete S.flags[arg]; break;
      case 'if': return this.cond(arg);
      case 'quest': this.startQuest(arg); break;
      case 'step': { const [id, n] = arg.split(':'); this.setStep(id, +n); break; }
      case 'done': await this.completeQuest(arg); break;
      case 'give': await this.giveItem(arg); break;
      case 'graines': this.addGraines(+arg); break;
      case 'pay': if (S.graines < +arg) { toast(`Il te faut ${+arg} graines (tu en as ${S.graines}).`, 'lock'); audio.sfx('wrong'); return false; } S.graines -= +arg; audio.sfx('coin'); break;
      case 'fruit': S.fruits += +arg || 1; toast(`🍎 +${+arg || 1} fruit`, 'good'); break;
      case 'kit': S.kits += +arg || 1; toast(`🧰 +${+arg || 1} kit de réparation`, 'good'); break;
      case 'heal': S.hp = S.maxHp; audio.sfx('heal'); toast('🌿 Feuilles restaurées', 'good'); break;
      case 'repair': S.weapon = 100; audio.sfx('heal'); toast('🔧 Bâton réparé (100 %)', 'good'); break;
      case 'heart': this.addHeartPiece(); break;
      case 'codex': this.unlockCodex(arg); break;
      case 'puzzle': return this.runPuzzle(arg, ctx);
      case 'video': return this.showVideo(arg, ctx);
      case 'mission': return this.showMission(arg, ctx);
      case 'open': return this.showOpen(arg, ctx);
      case 'mural': return this.showMural(arg, ctx);
      case 'script': return this.runScript(arg, ctx);
      case 'title': S.title = arg; toast(`🏅 Nouveau titre : <b>${esc(arg)}</b>`, 'good', 4000); audio.sfx('levelup'); break;
      case 'sfx': audio.sfx(arg); break;
      case 'toast': toast(md(arg), 'info', 4200); break;
      case 'say': await dialogue([this.line(arg, ctx)]); break;
      case 'plant': await this.plantSeed(arg || ctx.region); break;
      case 'boss': this.spawnBoss(arg, ctx); break;
      case 'fanfare': { const [ic, ti, su] = arg.split('|'); await fanfare(icon(ic), ti, su); break; }
      case 'warpto': { const [m, x, y] = arg.split(','); this.enterMap(m, +x * TILE + 8, +y * TILE + 12); break; }
      case 'ending': if (this.hooks.ending) await this.hooks.ending(this); break;
      case 'report': if (this.hooks.openMenu) this.hooks.openMenu('report'); break;
      case 'save': this.save(); break;
      case 'spawn': { const [kind, n] = arg.split(','); for (let i = 0; i < (+n || 1); i++) this.spawnMob(kind, this.player.x + (Math.random() - 0.5) * 120, this.player.y + 60 + Math.random() * 30, { region: this.region }); break; }
      case 'secret': S.tracker.secrets[arg] = true; audio.sfx('secret'); break;
      default: console.warn('Action inconnue', a);
    }
    return true;
  }

  // ================================================================ Quêtes
  startQuest(id) {
    const S = this.state; const q = CONTENT.QUESTS[id];
    if (!q) { console.warn('Quête inconnue', id); return; }
    if (S.quests[id]) return;
    S.quests[id] = { step: 0, status: 'active', started: Date.now() };
    audio.sfx('quest');
    toast(`${q.main ? '⭐ Quête principale' : '📜 Quête secondaire'} : <b>${esc(q.title)}</b><br><small>${esc(this.stepText(id))}</small>`, 'quest', 5000);
    logEvent(S, 'quest_start', { quest: id });
  }
  setStep(id, n) {
    const S = this.state; if (!S.quests[id]) this.startQuest(id);
    const st = S.quests[id]; if (st.status === 'done' || st.step >= n) return;
    st.step = n; toast(`📜 <b>${esc(CONTENT.QUESTS[id].title)}</b><br><small>${esc(this.stepText(id))}</small>`, 'quest', 4000);
  }
  stepText(id) { const q = CONTENT.QUESTS[id], st = this.state.quests[id]; if (!q || !st) return ''; const s = q.steps[Math.min(st.step, q.steps.length - 1)]; return typeof s === 'string' ? s : s.t; }
  async completeQuest(id) {
    const S = this.state; const q = CONTENT.QUESTS[id];
    if (!S.quests[id]) S.quests[id] = { step: 0, status: 'active', started: Date.now() };
    if (S.quests[id].status === 'done') return;
    S.quests[id].status = 'done'; S.quests[id].done = Date.now(); S.quests[id].step = q.steps.length;
    audio.sfx('quest');
    toast(`✅ Quête terminée : <b>${esc(q.title)}</b>`, 'good', 4500);
    logEvent(S, 'quest_done', { quest: id });
    if (q.reward) {
      if (q.reward.graines) this.addGraines(q.reward.graines);
      if (q.reward.heart) this.addHeartPiece();
      if (q.reward.kit) { S.kits++; }
    }
    this.save();
  }
  /** Objectif à suivre : dernière quête principale active, sinon secondaire. */
  currentObjective() {
    const S = this.state; let best = null;
    for (const q of CONTENT.QUESTS_LIST) {
      const st = S.quests[q.id]; if (!st || st.status !== 'active') continue;
      if (!best || (q.main && !best.q.main) || (q.main === best.q.main && st.started > best.st.started)) best = { q, st };
    }
    if (!best) return null;
    const s = best.q.steps[Math.min(best.st.step, best.q.steps.length - 1)];
    return { quest: best.q, text: typeof s === 'string' ? s : s.t, at: typeof s === 'string' ? null : s.at };
  }
  targetPos(at) {
    if (!at) return null;
    // PNJ ou repère sur la carte courante, sinon entrée du donjon correspondant
    for (const lm of this.map.landmarks) if (lm.id === at) return { x: lm.tx * TILE + 8, y: lm.ty * TILE + 8 };
    if (this.map.interior) { const d = this.map.props.find(p => p.exit); return d ? { x: d.x + 8, y: d.y + 8 } : null; }
    for (const m of Object.values(this.world.maps)) if (m.interior) for (const lm of m.landmarks) if (lm.id === at) {
      const ent = this.world.overworld.landmarks.find(l => (l.s || '') === 'dungeon:' + m.id || (l.s || '') === 'cave:' + m.id);
      if (ent) return { x: ent.tx * TILE + 24, y: ent.ty * TILE + 40 };
    }
    return null;
  }

  // ================================================================ Objets
  async giveItem(id) {
    const S = this.state; const it = CONTENT.ITEMS[id];
    if (S.items[id]) return;
    S.items[id] = true; audio.sfx('item');
    logEvent(S, 'item', { item: id });
    await fanfare(icon(it.icon), it.name, it.desc);
    this.save();
  }
  hasItem(id) { return !!this.state.items[id]; }
  addGraines(n) { this.state.graines += n; if (n > 0) { audio.sfx('coin'); this.float('+' + n + ' 🌱', this.player.x, this.player.y - 20, '#9aff7a'); } }
  addHeartPiece() {
    const S = this.state; S.heartPieces++;
    if (S.heartPieces % 4 === 0) { S.maxHp += 2; S.hp = S.maxHp; toast('💚 4 fragments réunis : <b>+1 feuille de vie !</b>', 'good', 4500); audio.sfx('levelup'); }
    else toast(`💚 Fragment de feuille (${S.heartPieces % 4}/4)`, 'good');
  }
  unlockCodex(id) {
    const S = this.state; const c = CONTENT.CODEX[id];
    if (!c) { console.warn('Codex manquant', id); return; }
    if (S.codex[id]) return;
    S.codex[id] = Date.now(); audio.sfx('codex');
    toast(`📖 Codex : <b>${esc(c.title)}</b>`, 'codex', 3500);
  }
  attackPower() { const w = this.state.weapon; return w <= 0 ? 0.5 : 1; }
  wearWeapon(n) {
    const S = this.state; const before = S.weapon; S.weapon = Math.max(0, S.weapon - n);
    if (before > 30 && S.weapon <= 30) toast('⚠ Ton bâton s’use (Obsolescents !). Répare-le : kit (inventaire) ou réparatrice.', 'lock', 5000);
    if (before > 0 && S.weapon <= 0) toast('⚠ Bâton hors d’usage : dégâts réduits de moitié. Répare-le plutôt que d’en racheter un !', 'bad', 5000);
  }
  useFruit() { const S = this.state; if (S.fruits <= 0 || S.hp >= S.maxHp) return false; S.fruits--; S.hp = Math.min(S.maxHp, S.hp + 4); audio.sfx('heal'); return true; }
  useKit() { const S = this.state; if (S.kits <= 0 || S.weapon >= 100) return false; S.kits--; S.weapon = 100; audio.sfx('heal'); this.track('reparation'); return true; }

  // ================================================================ Énigmes, vidéos, missions, questions ouvertes
  async runPuzzle(id, ctx = {}) {
    const def = CONTENT.PUZZLES[id];
    if (!def) { console.warn('Énigme manquante', id); return false; }
    const S = this.state;
    const tr = S.tracker.puzzles[id] || (S.tracker.puzzles[id] = { title: def.title, region: def.region || ctx.region || this.region, kind: def.kind || 'enigme', main: def.main !== false, attempts: 0, hints: 0, success: false, abandoned: 0, timeMs: 0, firstTry: null, opens: 0 });
    if (tr.success && def.once !== false && !ctx.replay) {
      // déjà réussie : on rejoue juste les récompenses non bloquantes
      return true;
    }
    tr.opens++;
    if (globalThis.__AUTO) S.flags.teacher_used = true; // mode test = signalé comme mode enseignant
    audio.play('puzzle', 1);
    const res = await openPuzzle(def, {
      teacher: !!this.teacher,
      onQcm: (qid, ok, answer, attemptNo, setId, qtext) => this.trackQcm(qid, ok, answer, attemptNo, setId, qtext, def),
    });
    this.resumeMusic();
    tr.attempts += res.attempts; tr.hints += res.hints; tr.timeMs += res.timeMs; S.tracker.hintsUsed += res.hints;
    if (res.success) {
      if (tr.firstTry === null) tr.firstTry = (tr.abandoned === 0 && res.firstTry) || (def.type === 'qcm' || def.type === 'choice' ? res.hints === 0 : false);
      if (def.type === 'qcm' || def.type === 'choice') { const qs = Object.values(S.tracker.qcm).filter(q => q.set === id); tr.firstTry = qs.length ? qs.filter(q => q.firstOk).length / qs.length : tr.firstTry; }
      tr.success = true; tr.details = res.details;
      if (res.details && res.details.teacherSolved) tr.teacher = true;
      logEvent(S, 'puzzle', { id, ok: true });
      if (ctx.lm && ctx.lm.room !== undefined && this.map.def) { S.dgates[`${this.map.id}:${ctx.lm.room}`] = true; audio.sfx('door'); toast('🚪 Une porte s’ouvre…', 'good'); }
      if (def.onWin) await this.runActions(def.onWin, ctx);
      this.save();
      return true;
    } else {
      tr.abandoned++; logEvent(S, 'puzzle', { id, ok: false });
      toast('Tu pourras revenir quand tu veux.', 'info');
      this.save();
      return false;
    }
  }
  resumeMusic() {
    if (this.map.interior) audio.play('dungeon', this.isGreen(this.region) ? 1 : 0);
    else if (this.region) audio.play(REGIONS[this.region].music, this.greenVis[this.region] > 0.5 ? 1 : 0);
  }

  async showVideo(id, ctx = {}) {
    const v = CONTENT.VIDEOS[id]; if (!v) return false;
    const S = this.state;
    const tr = S.tracker.videos[id] || (S.tracker.videos[id] = { opened: 0, done: false, loaded: false });
    tr.opened++;
    if (globalThis.__AUTO) { const first = !tr.done; tr.done = true; if (v.codex) v.codex.forEach(c => this.unlockCodex(c)); if ((first || v.retry) && v.onDone) await this.runActions(v.onDone, ctx); return true; }
    const src = `https://www.youtube-nocookie.com/embed/${v.yt}?rel=0&cc_load_policy=1&hl=fr${v.start ? '&start=' + v.start : ''}&autoplay=1`;
    const m = modal(`
      <div class="video-meta"><b>${esc(v.title)}</b> — ${esc(v.source)} · ${esc(v.duration)}</div>
      <div class="video-box"><button class="btn video-load">▶ Charger la vidéo<br><small>(YouTube, chargée uniquement à ta demande)</small></button></div>
      <div class="intel"><div class="intel-h">À retenir pendant le visionnage :</div>${v.intel.map(i => `<div class="intel-i">${md(i)}</div>`).join('')}</div>
      <div class="row end"><button class="btn ghost v-later">Plus tard</button><button class="btn v-done" disabled>J’ai regardé ✔</button></div>`,
      { title: 'Pierre de projection', icon: '📽', wide: true });
    const box = m.body.querySelector('.video-box'), done = m.body.querySelector('.v-done');
    let t0 = null, timer = null;
    const need = v.required === false ? 5 : CONFIG.videoMinSeconds;
    m.body.querySelector('.video-load').addEventListener('click', () => {
      tr.loaded = true; audio.setVolumes({ music: 0 });
      box.innerHTML = `<iframe src="${src}" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      t0 = performance.now();
      timer = setInterval(() => { const s = Math.floor((performance.now() - t0) / 1000); if (s >= need || this.teacher) { done.disabled = false; done.textContent = 'J’ai regardé ✔'; clearInterval(timer); } else done.textContent = `J’ai regardé (${need - s} s)`; }, 500);
    });
    if (tr.done || this.teacher) done.disabled = false;
    m.body.querySelector('.v-later').addEventListener('click', () => m.close(false));
    done.addEventListener('click', () => m.close(true));
    const r = await m.done; clearInterval(timer);
    audio.setVolumes({ music: this.settings.music });
    if (r) {
      const first = !tr.done; tr.done = true;
      if (v.codex) v.codex.forEach(c => this.unlockCodex(c));
      if ((first || v.retry) && v.onDone) await this.runActions(v.onDone, ctx);
      this.save();
      return true;
    }
    return false;
  }

  async showMission(id, ctx = {}) {
    const ms = CONTENT.MISSIONS[id]; if (!ms) return false;
    const S = this.state; const prev = S.tracker.missions[id];
    if (globalThis.__AUTO) { S.tracker.missions[id] = { title: ms.title, values: ms.fields.map(() => '42'), labels: ms.fields.map(f => f.q), at: Date.now() }; if (ms.feedback) ms.feedback(['42', '3', '5']); if (ms.onDone && !prev) await this.runActions(ms.onDone, ctx); return true; }
    const m = modal(`
      <div class="prose">${md(ms.intro)}</div>
      ${ms.link ? `<p><a class="btn ghost" href="${ms.link}" target="_blank" rel="noopener">🌍 ${esc(ms.linkLabel || 'Ouvrir l’outil')} ↗</a></p>` : ''}
      <div class="inputs">${ms.fields.map((f, i) => `<label class="ifield"><span>${md(f.q)}</span>
        ${f.type === 'text' ? `<textarea data-i="${i}" rows="3">${esc(prev ? prev.values[i] ?? '' : '')}</textarea>` : `<input type="number" step="any" data-i="${i}" value="${esc(prev ? prev.values[i] ?? '' : '')}" placeholder="${esc(f.ph || '')}">`}
        ${f.unit ? `<em>${esc(f.unit)}</em>` : ''}</label>`).join('')}</div>
      <div class="m-feedback"></div>
      <div class="row end"><button class="btn ghost m-later">Plus tard</button><button class="btn m-ok">Enregistrer</button></div>`,
      { title: 'Mission terrain : ' + ms.title, icon: '🧭', wide: true });
    const fb = m.body.querySelector('.m-feedback');
    m.body.querySelector('.m-later').addEventListener('click', () => m.close(null));
    m.body.querySelector('.m-ok').addEventListener('click', () => {
      const vals = [...m.body.querySelectorAll('[data-i]')].map(x => x.value.trim());
      if (ms.fields.some((f, i) => !f.optional && !vals[i])) { fb.innerHTML = '<span class="bad">Complète les champs demandés.</span>'; return; }
      m.close(vals);
    });
    const vals = await m.done;
    if (!vals) return false;
    S.tracker.missions[id] = { title: ms.title, values: vals, labels: ms.fields.map(f => f.q), at: Date.now() };
    if (ms.feedback) { const html = ms.feedback(vals); if (html) await alertBox('Analyse', md(html)); }
    if (ms.onDone && !prev) await this.runActions(ms.onDone, ctx);
    this.save();
    return true;
  }

  async showOpen(id, ctx = {}) {
    const q = CONTENT.QUESTIONS[id]; if (!q) return false;
    const S = this.state; const prev = S.tracker.open[id];
    if (globalThis.__AUTO) { S.tracker.open[id] = { title: q.title, q: q.q, text: 'Réponse automatique de test avec plusieurs mots pour vérifier le comptage.', words: 11, timeMs: 5000, at: Date.now() }; if (q.onDone && !prev) await this.runActions(q.onDone, ctx); return true; }
    const t0 = performance.now();
    const m = modal(`
      <div class="prose">${md(q.context || '')}</div>
      <div class="open-q">${md(q.q)}</div>
      <textarea class="open-a" rows="7" placeholder="Ta réponse…">${esc(prev ? prev.text : '')}</textarea>
      <div class="open-meta"><span class="wc">0 mot</span> · ${CONFIG.openMinWords} mots conseillés · ta réponse sera lue par ton enseignant·e</div>
      <div class="row end"><button class="btn ghost o-later">Plus tard</button><button class="btn o-ok">Envoyer à la stèle</button></div>`,
      { title: q.title || 'Question de réflexion', icon: '✍', wide: true });
    const ta = m.body.querySelector('.open-a'), wc = m.body.querySelector('.wc');
    const upd = () => { const n = wordCount(ta.value); wc.textContent = n + ' mot' + (n > 1 ? 's' : ''); wc.className = 'wc ' + (n >= CONFIG.openMinWords ? 'good' : ''); };
    ta.addEventListener('input', upd); upd(); setTimeout(() => ta.focus(), 80);
    m.body.querySelector('.o-later').addEventListener('click', () => m.close(null));
    m.body.querySelector('.o-ok').addEventListener('click', async () => {
      const n = wordCount(ta.value);
      if (n < 3) { wc.textContent = 'Écris au moins une phrase.'; wc.className = 'wc bad'; return; }
      if (n < CONFIG.openMinWords && !(await confirmBox(`Ta réponse fait ${n} mots (${CONFIG.openMinWords} conseillés). L’envoyer quand même ?`, 'Envoyer', 'Compléter'))) return;
      m.close(ta.value.trim());
    });
    const txt = await m.done;
    if (!txt) return false;
    S.tracker.open[id] = { title: q.title, q: q.q, text: txt, words: wordCount(txt), timeMs: (prev ? prev.timeMs : 0) + performance.now() - t0, at: Date.now() };
    toast('✍ Réponse enregistrée. Tu pourras la modifier depuis le Journal.', 'good');
    if (q.onDone && !prev) await this.runActions(q.onDone, ctx);
    this.save();
    return true;
  }

  async showMural(id, ctx = {}) {
    const mu = CONTENT.MURALS[id]; if (!mu) return false;
    if (globalThis.__AUTO) { const S = this.state; const first = !S.flags['vu_' + id]; S.flags['vu_' + id] = true; if (mu.codex) mu.codex.forEach(c => this.unlockCodex(c)); if (first && mu.onView) await this.runActions(mu.onView, ctx); return true; }
    const m = modal(`<div class="mural-chart"><canvas width="560" height="280"></canvas></div>
      <div class="prose">${md(mu.text)}</div>
      ${mu.source ? `<div class="source">Source : ${md(mu.source)}</div>` : ''}
      <div class="row end"><button class="btn" autofocus>Compris</button></div>`, { title: mu.title, icon: '🖼', wide: true });
    const cv = m.body.querySelector('canvas'); this.hooks.drawChart && this.hooks.drawChart(cv, mu.chart);
    m.body.querySelector('.btn').addEventListener('click', () => m.close(true));
    await m.done;
    const S = this.state; const first = !S.flags['vu_' + id]; S.flags['vu_' + id] = true;
    if (mu.codex) mu.codex.forEach(c => this.unlockCodex(c));
    if (first && mu.onView) await this.runActions(mu.onView, ctx);
    return true;
  }

  // ================================================================ Donjons, grottes, coffres, autels
  async enterDungeon(id, ctx) {
    const d = DUNGEONS[id];
    if (!this.cond(d.req)) { await dialogue([{ who: d.title, t: d.lockMsg }]); return; }
    const S = this.state;
    S.returnPos = { x: this.player.x, y: this.player.y + 18 };
    const m = this.world.maps[id];
    this.fadeTo(() => this.enterMap(id, m.entry.x + 8, m.entry.y + 12));
    if (!S.flags['entre_' + id]) { S.flags['entre_' + id] = true; logEvent(S, 'dungeon', { id }); }
  }
  async enterCave(id) {
    const cv = CAVES[id];
    if (!this.cond(cv.req)) { await dialogue([{ who: cv.title, t: cv.lockMsg }]); return; }
    const S = this.state;
    S.returnPos = { x: this.player.x, y: this.player.y + 18 };
    if (!S.tracker.secrets[id]) { S.tracker.secrets[id] = true; audio.sfx('secret'); toast('✨ Secret découvert : <b>' + esc(cv.title) + '</b>', 'good'); }
    const m = this.world.maps[id];
    this.fadeTo(() => this.enterMap(id, m.entry.x + 8, m.entry.y + 4));
  }
  exitInterior() {
    const S = this.state; const rp = S.returnPos || { x: this.player.x, y: this.player.y };
    this.fadeTo(() => { this.enterMap('overworld', rp.x, rp.y); this.region = null; });
  }
  fadeTo(fn) {
    this.busy++; this.fade = { t: 0, dir: 1 };
    setTimeout(() => { fn(); this.fade = { t: 0, dir: -1 }; setTimeout(() => { this.fade = null; this.busy--; }, 260); }, 260);
  }
  async openChest(id, ctx) {
    const S = this.state; const key = ctx.lm ? ctx.lm.id : id;
    if (S.chests[key]) { toast('Le coffre est vide.', 'info'); return; }
    const c = CONTENT.CHESTS[id]; if (!c) { console.warn('coffre ?', id); return; }
    if (c.if && !this.cond(c.if)) { await dialogue([{ who: 'Coffre', t: c.lockMsg || 'Le coffre est scellé.' }]); return; }
    S.chests[key] = true; audio.sfx('door');
    await this.runActions(c.act, ctx);
    this.save();
  }
  async takeSeed(region, ctx) {
    const S = this.state;
    if (S.seeds[region]) { toast('La Graine-Mère a déjà été replantée.', 'info'); return; }
    const chestId = this.map.landmarks.find(l => l.t === 'chest');
    if (chestId && !S.chests[chestId.id]) { toast('Ouvre d’abord le coffre de la salle.', 'lock'); return; }
    await fanfare(creature('seed'), 'Graine-Mère', `La graine de la région **${REGIONS[region].name}** palpite de vie. Replante-la sur l’autel, à la sortie !`);
    S.flags['graine_' + region] = true;
    this.exitInterior();
    await sleep(700);
    await this.plantSeed(region);
  }
  async plantSeed(region) {
    const S = this.state; if (S.seeds[region]) return;
    S.seeds[region] = Date.now();
    S.maxHp += 2; S.hp = S.maxHp;
    logEvent(S, 'seed', { region });
    // animation : vague de reverdissement depuis l'autel
    this.greenAnim[region] = { from: 0, to: 1, t: 0, dur: this.settings.reduceMotion ? 0.5 : 5.5 };
    if (this.seedCount() >= 0) this.greenAnim.village = { from: this.greenVis.village || 0, to: clamp(this.seedCount() / 8, 0, 1), t: 0, dur: 3 };
    audio.sfx('grow'); this.shake(2);
    const R = REGIONS[region];
    const o = regionOrigin(region); const sx = (o.x + R.seedSpot[0]) * TILE, sy = (o.y + R.seedSpot[1]) * TILE;
    for (let i = 0; i < 60; i++) this.particles.add({ x: sx + (Math.random() - 0.5) * 30, y: sy + (Math.random() - 0.5) * 20, vx: (Math.random() - 0.5) * 80, vy: -40 - Math.random() * 60, life: 2, max: 2, col: ['#9aff7a', '#fff', '#ffdd55', '#ff9ad0'][i % 4], size: 2, grav: 30 });
    setTimeout(() => audio.play(R.music, 1), 1500);
    await sleep(this.settings.reduceMotion ? 300 : 2400);
    await fanfare(creature('seed'), `${R.name} reverdit !`, `Graine-Mère replantée (${this.seedCount()} / 8). **+1 feuille de vie**. L’Arbre-Mère du village grandit…`);
    if (CONTENT.ON_SEED[region]) await this.runActions(CONTENT.ON_SEED[region], { region });
    this.save();
  }
  async useWarp(ctx) {
    const S = this.state; const id = ctx.lm.id;
    if (!S.warps[id]) { S.warps[id] = true; S.lastWarp = id; audio.sfx('warp'); toast('🌀 Racine éveillée : tu pourras t’y téléporter.', 'good'); this.save(); }
    S.lastWarp = id;
    const list = this.world.overworld.landmarks.filter(l => l.t === 'warp' && S.warps[l.id] && l.id !== id);
    if (!list.length) { await dialogue([{ who: 'Racine', t: 'Les Racines relient les régions. Éveille-en d’autres pour voyager instantanément.' }]); return; }
    const opts = list.map(l => REGIONS[l.region].name);
    const r = await dialogue([{ who: 'Racine', t: 'Où veux-tu voyager ?' }], [...opts, 'Rester ici']);
    if (r.choice === null || r.choice >= list.length) return;
    const t = list[r.choice];
    this.fadeTo(() => { this.enterMap('overworld', t.tx * TILE + 8, t.ty * TILE + 30); this.region = null; S.lastWarp = t.id; });
  }
  async useAltar(ctx) {
    const reg = ctx.lm.region;
    if (this.state.seeds[reg]) await dialogue([{ who: 'Autel', t: 'La Graine-Mère y pousse. La région respire à nouveau.' }]);
    else await dialogue([{ who: 'Autel', t: 'Un autel vide et craquelé. Une Graine-Mère devrait y être replantée… Elle se trouve sans doute au cœur du temple de la région.' }]);
  }

  // ================================================================ Donjons : salles et boss
  updateDungeon(dt) {
    const m = this.map; if (!m.def || !m.def.rooms) return;
    const room = clamp(Math.floor((this.player.x / TILE - 1) / 16), 0, m.def.rooms.length - 1);
    if (room !== this.curRoom) {
      this.curRoom = room;
      const R = m.def.rooms[room];
      if (!this.roomSpawned[room] && R.spawn && !this.state.dgates[`${m.id}:${room}`]) {
        this.roomSpawned[room] = true;
        R.spawn.forEach(s => this.spawnMob(s.kind, s.x + 8, s.y + 12, { region: m.region, elite: Math.random() < 0.08 }));
      }
      if (R.boss && !this.state.flags.omnium_vaincu && !this.bossSpawned) { this.bossSpawned = true; this.startOmnium(room); }
    }
    // condition spéciale : salle du boss (8 graines)
    if (m.id === 'd_index') {
      const k = 'd_index:1';
      if (this.state.dgates[k] && this.seedCount() < 8 && !this.teacher) { delete this.state.dgates[k]; toast('🔒 Il faut les 8 Graines-Mères pour affronter l’Omnium.', 'lock', 5000); }
    }
  }
  async startOmnium(room) {
    const ox = (1 + room * 16) * TILE;
    audio.play('boss', 0); audio.sfx('boss'); this.shake(8);
    await dialogue((CONTENT.SCRIPTS.omnium_intro || []).map(l => this.line(l, { who: 'L’Omnium' })));
    const b = this.spawnMob('omnium', ox + 7.5 * TILE, 4 * TILE, { region: this.region });
    this.boss = b;
  }
  bossPhase(b, ph) {
    audio.sfx('boss'); this.shake(6);
    const lines = CONTENT.SCRIPTS['omnium_phase' + ph];
    if (lines) { this.busy++; dialogue(lines.map(l => this.line(l, { who: 'L’Omnium' }))).finally(() => this.busy--); }
  }
  spawnBoss(kind, ctx) {
    if (kind === 'golem') {
      if (this.entities.some(e => e instanceof Mob && e.kind === 'golemboss')) return;
      const spot = this.map.landmarks.find(l => l.id === 'arene_golem');
      this.golemWeight = 3800; this.golemLayers = [...CONTENT.GOLEM_LAYERS];
      const b = this.spawnMob('golemboss', spot.tx * TILE, spot.ty * TILE, { region: this.region });
      b.hpMax = b.hp = this.golemLayers.length;
      audio.play('boss', 0); audio.sfx('boss'); this.shake(6);
      toast('⚔ Le <b>Golem Obésiciel</b> (3 800 Ko) surgit ! Frappe-le pour retirer ses couches de gras.', 'bad', 5000);
    }
  }
  golemLayerHit(b) {
    const L = this.golemLayers.shift();
    if (L) { this.golemWeight = Math.max(80, this.golemWeight - L.ko); this.float(`−${L.ko} Ko : ${L.label}`, b.x, b.y - 40, '#ffd84a'); toast(`🔥 ${esc(L.label)} retiré·e·s : −${L.ko} Ko → <b>${this.golemWeight} Ko</b>. ${esc(L.tip)}`, 'good', 4200); }
  }

  // ================================================================ Mobs
  spawnMob(kind, x, y, opts = {}) {
    const m = new Mob(kind, x, y, opts);
    m.region = opts.region || this.region; m.bossMinion = !!opts.bossMinion;
    // éviter les murs
    if (this.solid(m.x, m.y - 4)) { for (let k = 0; k < 12; k++) { const a = k * 0.6, r = 10 + k * 4; const nx = x + Math.cos(a) * r, ny = y + Math.sin(a) * r; if (!this.solid(nx, ny - 4)) { m.x = nx; m.y = ny; m.home = { x: nx, y: ny }; break; } } }
    this.entities.push(m);
    return m;
  }
  countMobs(f) { return this.entities.filter(e => e instanceof Mob && !e.dead && (!f || f(e))).length; }
  spawnAmbient() {
    const reg = this.region; if (!reg) return;
    const R = REGIONS[reg]; if (!R.mobs) return;
    if (reg === 'village' && !this.state.flags.tuto_fini && !this.state.flags.tuto_combat) return;
    const max = Math.max(1, Math.round(R.mobs.max * (this.isGreen(reg) ? 0.5 : 1)));
    const p = this.player;
    // retrait des mobs lointains
    for (const e of this.entities) if (e instanceof Mob && !e.def.boss && !e.bossMinion && dist(e.x, e.y, p.x, p.y) > 360) e.dead = true;
    if (this.countMobs(e => !e.def.boss) >= max) return;
    const o = regionOrigin(reg);
    for (let tries = 0; tries < 20; tries++) {
      const a = Math.random() * Math.PI * 2, r = 150 + Math.random() * 80;
      const x = p.x + Math.cos(a) * r, y = p.y + Math.sin(a) * r;
      const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
      if (tx < o.x + 3 || ty < o.y + 3 || tx > o.x + RW - 4 || ty > o.y + RH - 4) continue;
      if (this.solid(x, y - 4) || this.solid(x + 6, y - 4) || this.solid(x - 6, y - 4)) continue;
      if (this.map.landmarks.some(l => l.t === 'npc' && dist(l.tx * TILE, l.ty * TILE, x, y) < 48)) continue;
      const kinds = R.mobs.kinds; let kind = kinds[Math.floor(Math.random() * kinds.length)];
      if ((kind === 'greenwasher' || kind === 'hallu') && !this.hasItem('bouclier') && reg !== 'steppe') kind = 'co2';
      const elite = this.state.flags.tuto_fini && Math.random() < 1 / 12;
      this.spawnMob(kind, x, y, { region: reg, elite });
      return;
    }
  }
  onMobKilled(m) {
    const S = this.state; S.tracker.combat.kills++;
    if (m.kind === 'golemboss') return this.golemDefeated();
    if (m.kind === 'omnium') return this.omniumDefeated();
    if (Math.random() < (m.def.drop || 0.3) + (m.elite ? 0.5 : 0)) {
      const r = Math.random();
      const kind = r < 0.6 ? 'graine' : r < 0.85 ? 'fruit' : r < 0.93 ? 'kit' : 'graine';
      this.entities.push(new Pickup(m.x, m.y, kind, kind === 'graine' ? (m.elite ? 5 : 1 + Math.floor(Math.random() * 2)) : 1));
    }
    if (m.def.lore && !S.flags['lore_' + m.kind]) { S.flags['lore_' + m.kind] = true; toast(`🐾 <b>${esc(m.def.name)}</b> — ${esc(m.def.lore)}`, 'info', 6000); }
    if (S.flags.tuto_combat && !S.flags.tuto_kills_ok && m.region === 'village') {
      S.flags.tuto_kills = (S.flags.tuto_kills || 0) + 1;
      if (S.flags.tuto_kills >= 3) { S.flags.tuto_kills_ok = true; toast('✔ Les fumerolles sont dissipées. Retourne voir Sylve.', 'good', 4500); this.setStep('main_village', 2); }
    }
  }
  async golemDefeated() {
    const S = this.state; S.flags.golem_vaincu = true; this.golemWeight = 80;
    this.entities.forEach(e => { if (e instanceof Mob && e.kind === 'blob') e.dead = true; });
    audio.sfx('levelup'); this.resumeMusic();
    await fanfare(creature('blob'), 'Golem dégraissé !', 'De **3 800 Ko** à **moins de 100 Ko** : le poids d’une page qui charge partout, même sur un vieux téléphone. Retourne voir Maître Sobre.');
    if (CONTENT.ON_EVENT.golem) await this.runActions(CONTENT.ON_EVENT.golem, {});
    this.save();
  }
  async omniumDefeated() {
    const S = this.state; S.flags.omnium_vaincu = true; this.boss = null;
    this.entities.forEach(e => { if (e instanceof Mob) e.dead = true; });
    audio.sfx('explode'); this.shake(10);
    await sleep(800);
    if (CONTENT.ON_EVENT.omnium) await this.runActions(CONTENT.ON_EVENT.omnium, {});
    this.save();
  }
  onPlayerHitBy(m) { this.state.tracker.combat.hits++; }

  // ================================================================ Bulles d'idées & défis
  shootBubble(mob, pool, boss = false) {
    const st = this.pickStatement(pool, mob.region || this.region);
    if (!st) return;
    const p = this.player; const a = Math.atan2(p.y - mob.y, p.x - mob.x); const sp = boss ? 85 : 70;
    this.entities.push(new Bubble(mob.x, mob.y - 4, Math.cos(a) * sp, Math.sin(a) * sp, st, mob));
    audio.sfx('bubble');
  }
  pickStatement(pool, region) {
    const all = CONTENT.STATEMENTS;
    let list = all.filter(s => (pool === 'myth' ? s.v === false : pool === 'fact' ? s.v === true : true) && (!s.r || s.r === region || s.r === '*'));
    if (!list.length) list = all;
    // privilégie les énoncés peu vus
    const tr = this.state.tracker.statements;
    list.sort((a, b) => ((tr[a.id] || {}).seen || 0) - ((tr[b.id] || {}).seen || 0) + (Math.random() - 0.5) * 0.8);
    return list[0];
  }
  canChallenge() { return !isBlocking() && this.busy === 0 && this.state.flags.tuto_fini; }
  async bubbleHit(b) {
    const S = this.state; const st = b.stmt;
    S.tracker.combat.bubblesTaken++;
    const t = S.tracker.statements[st.id] || (S.tracker.statements[st.id] = { seen: 0, ok: 0, ko: 0 }); t.seen++;
    this.player.hurt(this, 1, b);
    toast(st.v ? `💬 <b>Fait :</b> ${esc(st.t)}` : `💬 <b>Idée reçue :</b> « ${esc(st.t)} »<br><small>✗ ${esc(st.x)}</small>`, st.v ? 'info' : 'myth', 6500);
    if (st.codex) this.unlockCodex(st.codex);
  }
  /** Parade au bouclier : éclair VRAI / FAUX. */
  async parryChallenge(b) {
    if (isBlocking() || this.busy) { b.reflected = true; return; }
    this.busy++;
    const S = this.state; const st = b.stmt;
    const t = S.tracker.statements[st.id] || (S.tracker.statements[st.id] = { seen: 0, ok: 0, ko: 0 }); t.seen++;
    try {
      const m = modal(`<div class="parry"><div class="parry-q">« ${esc(st.t)} »</div>
        <div class="parry-timer"><div></div></div>
        <div class="row center"><button class="btn big tf" data-v="1">✔ VRAI <small>(V ou ←)</small></button><button class="btn big tf" data-v="0">✗ FAUX <small>(F ou →)</small></button></div></div>`,
        { title: 'Parade de vérité !', icon: '🛡', closable: false, cls: 'parry-modal', noFocus: true });
      const bar = m.body.querySelector('.parry-timer div');
      const T = 9000; const t0 = performance.now();
      const iv = setInterval(() => { const k = 1 - (performance.now() - t0) / T; bar.style.width = Math.max(0, k * 100) + '%'; if (k <= 0) { clearInterval(iv); m.close(null); } }, 50);
      const keyH = e => { if (e.code === 'ArrowLeft' || e.code === 'KeyV') m.close(true); if (e.code === 'ArrowRight' || e.code === 'KeyF') m.close(false); };
      addEventListener('keydown', keyH);
      m.body.querySelectorAll('.tf').forEach(x => x.addEventListener('click', () => m.close(x.dataset.v === '1')));
      const ans = await m.done; clearInterval(iv); removeEventListener('keydown', keyH);
      const ok = ans === st.v;
      this.trackQcm('stmt_' + st.id, ok, ans === null ? '(temps écoulé)' : (ans ? 'VRAI' : 'FAUX'), t.ok + t.ko + 1, 'combat', st.t, { kind: 'combat', region: this.region });
      if (ok) {
        t.ok++; S.tracker.combat.parryOk++;
        audio.sfx('parry');
        b.reflected = true; b.dead = false; b.vx = -b.vx * 1.6; b.vy = -b.vy * 1.6; b.life = 2; this.entities.push(b);
        if (b.owner && !b.owner.dead) { b.owner.stun = 2; if (b.owner.def.beh === 'boss_omnium') b.owner.parries = (b.owner.parries || 0) + 1; }
        toast(`🛡 <b>Bien vu !</b> ${esc(st.x)}`, 'good', 5500);
        if (Math.random() < 0.5) this.entities.push(new Pickup(this.player.x + 10, this.player.y, 'graine', 1));
        if (st.codex) this.unlockCodex(st.codex);
      } else {
        t.ko++; S.tracker.combat.parryKo++;
        audio.sfx('wrong'); this.player.inv = 0; this.player.hurt(this, 1, b);
        toast(`✗ <b>${st.v ? 'C’était VRAI' : 'C’était FAUX'}.</b> ${esc(st.x)}`, 'bad', 6500);
      }
    } finally { this.busy--; input.clear(); }
  }
  /** Défi d'élite : QCM chronométré, le temps se fige. */
  async eliteChallenge(mob) {
    this.busy++;
    const S = this.state;
    try {
      const pool = CONTENT.COMBAT_QCM.filter(q => !q.r || q.r === mob.region || q.r === '*');
      const tr = S.tracker.qcm;
      pool.sort((a, b) => ((tr['elite_' + a.id] || {}).attempts || 0) - ((tr['elite_' + b.id] || {}).attempts || 0) + (Math.random() - 0.5));
      const q = pool[0]; if (!q) return;
      audio.sfx('boss');
      const opts = q.options.map((t, k) => ({ t, k })).sort(() => Math.random() - 0.5);
      const m = modal(`<div class="parry"><div class="elite-h">⚡ Un ${esc(mob.def.name)} d’élite te défie ! Le temps se fige…</div>
        <div class="parry-q">${md(q.q)}</div><div class="parry-timer"><div></div></div>
        <div class="qcm-opts">${opts.map(o => `<button class="opt" data-k="${o.k}">${md(o.t)}</button>`).join('')}</div></div>`,
        { title: 'Défi d’élite', icon: '⚡', closable: false, cls: 'parry-modal', noFocus: true });
      const bar = m.body.querySelector('.parry-timer div'); const T = 15000; const t0 = performance.now();
      const iv = setInterval(() => { const k = 1 - (performance.now() - t0) / T; bar.style.width = Math.max(0, k * 100) + '%'; if (k <= 0) { clearInterval(iv); m.close(null); } }, 50);
      m.body.querySelectorAll('.opt').forEach(x => x.addEventListener('click', () => m.close(+x.dataset.k)));
      const k = await m.done; clearInterval(iv);
      const ok = k === q.a;
      this.trackQcm('elite_' + q.id, ok, k === null ? '(temps écoulé)' : q.options[k], ((tr['elite_' + q.id] || {}).attempts || 0) + 1, 'combat', q.q, { kind: 'combat', region: mob.region });
      if (ok) { S.tracker.combat.eliteOk++; audio.sfx('parry'); mob.stun = 3; mob.hurt(this, Math.ceil(mob.hp / 2), this.player); toast(`⚡ <b>Exact !</b> ${esc(q.explain || '')}`, 'good', 6000); }
      else { S.tracker.combat.eliteKo++; audio.sfx('wrong'); mob.elite = true; toast(`✗ <b>Raté.</b> Réponse : ${esc(q.options[q.a])}. ${esc(q.explain || '')}`, 'bad', 7000); }
    } finally { this.busy--; input.clear(); }
  }

  // ================================================================ Joueur
  async playerDied() {
    const S = this.state;
    if (this.dying) return; this.dying = true;
    S.tracker.combat.deaths++; logEvent(S, 'death', { region: this.region });
    audio.sfx('death');
    this.busy++;
    await sleep(600);
    await alertBox('Tu t’es évanoui·e…', `<p>Les Racines de Verdance te ramènent en lieu sûr. <b>Aucune progression n’est perdue.</b></p><p class="muted">Astuce : mange un fruit (inventaire, touche I) et utilise le bouclier (Maj) contre les attaques.</p>`, 'Se relever');
    this.busy--;
    S.hp = S.maxHp; this.dying = false;
    if (this.boss) { this.boss = null; this.bossSpawned = false; }
    if (this.map.interior) { this.enterMap(this.map.id, this.map.entry.x + 8, this.map.entry.y + 12); return; }
    const w = this.world.overworld.landmarks.find(l => l.id === S.lastWarp) || this.world.overworld.landmarks.find(l => l.id === 'warp_village');
    this.enterMap('overworld', w.tx * TILE + 8, w.ty * TILE + 30); this.region = null;
  }
  collect(pk) {
    const S = this.state;
    if (pk.kind === 'graine') this.addGraines(pk.amount);
    else if (pk.kind === 'fruit') { if (S.hp < S.maxHp) { S.hp = Math.min(S.maxHp, S.hp + 2); audio.sfx('heal'); } else { S.fruits++; audio.sfx('pickup'); this.float('+1 🍎', pk.x, pk.y - 16, '#ff9a9a'); } }
    else if (pk.kind === 'kit') { S.kits++; audio.sfx('pickup'); this.float('+1 🧰', pk.x, pk.y - 16, '#fff'); }
  }
  cutBush(tx, ty) {
    const k = this.map.kind(tx, ty);
    if (k !== 'B') return;
    this.map.set(tx, ty, 'G'); audio.sfx('hit');
    this.particles.burst(tx * TILE + 8, ty * TILE + 8, this.isGreen(this.region) ? '#5fbf4a' : '#4a3f38', 10, 50, 0.5, 80);
    if (Math.random() < 0.25) this.entities.push(new Pickup(tx * TILE + 8, ty * TILE + 12, Math.random() < 0.7 ? 'graine' : 'fruit', 1));
  }

  // ================================================================ Effets
  shake(a) { if (this.settings.reduceMotion) return; this.shakeT = 0.25; this.shakeA = a; }
  flash(c) { if (this.settings.reduceMotion) return; this.flashC = c; this.flashT = 0.15; }
  sparks(x, y, col, n = 6) { this.particles.burst(x, y, col, this.settings.reduceMotion ? 2 : n, 70, 0.35); }
  dust(x, y) { this.particles.burst(x, y - 2, '#d8c8a8', this.settings.reduceMotion ? 1 : 5, 25, 0.4); }
  float(t, x, y, c) { this.floats.push(new FloatText(t, x, y, c)); }
  weather(dt) {
    if (this.settings.reduceMotion) return;
    const g = this.map.interior ? 0 : (this.greenVis[this.region] || 0);
    const c = this.cam;
    if (this.map.interior) { if (Math.random() < dt * 3) this.particles.add({ x: c.x + Math.random() * VW, y: c.y + Math.random() * VH, vx: 0, vy: -6, life: 3, max: 3, col: 'rgba(200,200,255,0.5)', size: 1 }); return; }
    if (g < 0.5) { // braises qui montent
      if (Math.random() < dt * 14) this.particles.add({ x: c.x + Math.random() * VW, y: c.y + VH + 4, vx: (Math.random() - 0.5) * 8, vy: -14 - Math.random() * 18, life: 6, max: 6, col: Math.random() < 0.5 ? '#ff7a2a' : '#8a7a70', size: 1 + (Math.random() < 0.3 ? 1 : 0), drift: 6 });
    } else { // pétales / lucioles
      const theme = REGIONS[this.region] ? REGIONS[this.region].theme : 'village';
      if (Math.random() < dt * 8) this.particles.add({ x: c.x + Math.random() * VW, y: c.y - 4, vx: 6 + Math.random() * 8, vy: 10 + Math.random() * 8, life: 9, max: 9, col: theme === 'steppe' ? '#ffffff' : ['#ff9ad0', '#ffffff', '#ffe27a', '#9aff7a'][Math.floor(Math.random() * 4)], size: 1 + (Math.random() < 0.4 ? 1 : 0), drift: 10 });
    }
  }

  // ================================================================ Suivi
  track(type, data = {}) { logEvent(this.state, type, data); }
  trackQcm(qid, ok, answer, attemptNo, setId, qtext, def = {}) {
    const S = this.state;
    const q = S.tracker.qcm[qid] || (S.tracker.qcm[qid] = { set: setId, q: String(qtext || '').slice(0, 220), attempts: 0, firstOk: null, ok: false, answers: [], kind: def.kind || (setId === 'combat' ? 'combat' : (def.main === false ? 'side' : 'main')), region: def.region || this.region });
    q.attempts++;
    if (q.firstOk === null) q.firstOk = ok;
    if (ok) q.ok = true;
    if (q.answers.length < 6) q.answers.push({ a: String(answer).slice(0, 120), ok });
  }
  trackDialogue(ctx, stats) {
    if (!ctx.npc) return;
    const tr = this.state.tracker.dialogues[ctx.npc.id]; if (!tr) return;
    for (const s of stats) {
      tr.bubbles++;
      // lecture « réelle » : au moins ~25 ms par caractère (≈ 2 400 car/min), plafonné
      const need = Math.min(2500, 350 + s.chars * 22) / (this.settings.textSpeed >= 3 ? 2 : 1);
      if (s.ms >= need) tr.read++; else tr.skimmed++;
    }
  }
  trackTime(dt, blocked) {
    const S = this.state; if (!S || document.hidden) return;
    const ms = dt * 1000; const idle = performance.now() - this.lastInput > 120000 && !blocked;
    S.tracker.totalTime += ms;
    if (idle) { S.tracker.idleTime += ms; return; }
    const r = this.region || (this.map && this.map.region) || 'village';
    S.tracker.regionTime[r] = (S.tracker.regionTime[r] || 0) + ms;
  }
  trackSessionStart() { const S = this.state; S.tracker.lastPlay = Date.now(); }
  visitChunk(x, y) {
    const k = `${Math.floor(x / TILE / 8)}_${Math.floor(y / TILE / 8)}`;
    if (!this.state.tracker.chunks[k]) { this.state.tracker.chunks[k] = 1; this._minimapDirty = true; }
  }
  explorationRate() {
    const tot = this.walkableChunks || 1; return Math.min(1, Object.keys(this.state.tracker.chunks).length / tot);
  }
  save() { if (this.state) { this.state.x = this.player ? this.player.x : this.state.x; this.state.y = this.player ? this.player.y : this.state.y; this.state.dir = this.player ? this.player.dir : 0; if (this.map && this.map.interior) { /* on sauvegarde la position de retour */ } saveState(this.state); } }

  // ================================================================ Marques PNJ
  npcMark(npc) {
    const e = npc.def.talk.find(x => !x.if || this.cond(x.if));
    if (e && e.mark) return e.mark;
    if (!this.state.flags['parle_' + npc.id]) return 'talk';
    return null;
  }

  // ================================================================ Rendu
  snapCamera() {
    const p = this.player; this.cam.x = clamp(p.x - VW / 2, 0, this.map.w * TILE - VW); this.cam.y = clamp(p.y - VH / 2, 0, this.map.h * TILE - VH);
    if (this.map.w * TILE < VW) this.cam.x = (this.map.w * TILE - VW) / 2;
    if (this.map.h * TILE < VH) this.cam.y = (this.map.h * TILE - VH) / 2;
  }
  render(dt) {
    const ctx = this.ctx, m = this.map, p = this.player;
    if (!m) return;
    // caméra lissée
    const tx = clamp(p.x - VW / 2, 0, Math.max(0, m.w * TILE - VW)), ty = clamp(p.y - VH / 2 - 8, 0, Math.max(0, m.h * TILE - VH));
    this.cam.x = lerp(this.cam.x, m.w * TILE < VW ? (m.w * TILE - VW) / 2 : tx, Math.min(1, dt * 10));
    this.cam.y = lerp(this.cam.y, m.h * TILE < VH ? (m.h * TILE - VH) / 2 : ty, Math.min(1, dt * 10));
    const cam = { x: Math.round(this.cam.x), y: Math.round(this.cam.y) };
    if (this.shakeT > 0) { cam.x += Math.round((Math.random() - 0.5) * this.shakeA); cam.y += Math.round((Math.random() - 0.5) * this.shakeA); }
    ctx.fillStyle = '#0b0b12'; ctx.fillRect(0, 0, VW, VH);
    this.drawTiles(ctx, cam);
    // props + entités triés par profondeur
    const draw = [];
    for (const pr of m.props) {
      if (pr.hidden) continue;
      if ((pr.gate || pr.dgate) && this.gateOpen(pr)) continue;
      if (pr.x + pr.w < cam.x - 16 || pr.x > cam.x + VW + 16 || pr.y + pr.h < cam.y - 16 || pr.y > cam.y + VH + 80) continue;
      draw.push({ y: pr.y + pr.h - (pr.kind === 'tree' ? 4 : 0) - (pr.gate || pr.dgate ? 16 : 0), f: () => this.drawProp(ctx, cam, pr) });
    }
    for (const e of this.entities) draw.push({ y: e.y, f: () => e.draw(ctx, cam, this) });
    draw.sort((a, b) => a.y - b.y);
    for (const d of draw) d.f();
    this.particles.draw(ctx, cam);
    for (const f of this.floats) f.draw(ctx, cam);
    this.drawAtmosphere(ctx, cam);
    this.drawHUD(ctx, cam);
    if (this.flashT > 0) { ctx.fillStyle = this.flashC; ctx.fillRect(0, 0, VW, VH); }
    if (this.fade) { this.fade.t += dt; const a = this.fade.dir > 0 ? clamp(this.fade.t / 0.25, 0, 1) : clamp(1 - this.fade.t / 0.25, 0, 1); ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, VW, VH); }
  }

  drawTiles(ctx, cam) {
    const m = this.map;
    const x0 = Math.floor(cam.x / TILE), y0 = Math.floor(cam.y / TILE), x1 = x0 + Math.ceil(VW / TILE) + 1, y1 = y0 + Math.ceil(VH / TILE) + 1;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (x < 0 || y < 0 || x >= m.w || y >= m.h) continue;
      const k = KINDS[m.t[y * m.w + x]], v = m.v[y * m.w + x];
      let theme = m.theme, g = 1;
      if (!m.interior) {
        const r = m.regionAt(x, y);
        if (!r) { theme = 'marais'; g = 1; }
        else {
          theme = REGIONS[r].theme; const gv = this.greenVis[r] || 0;
          if (gv <= 0) g = 0; else if (gv >= 1) g = 1;
          else { const o = regionOrigin(r); const sp = REGIONS[r].seedSpot; const d = Math.hypot(x - (o.x + sp[0]), y - (o.y + sp[1])); g = clamp((gv * 70 - d) / 5, 0, 1); }
        }
      } else g = this.isGreen(m.region) ? 1 : 0.3;
      const X = x * TILE - cam.x, Y = y * TILE - cam.y;
      if (g <= 0.02) ctx.drawImage(tile(theme, false, k, v, this.waterFrame), X, Y);
      else if (g >= 0.98) ctx.drawImage(tile(theme, true, k, v, this.waterFrame), X, Y);
      else { ctx.drawImage(tile(theme, false, k, v, this.waterFrame), X, Y); ctx.globalAlpha = g; ctx.drawImage(tile(theme, true, k, v, this.waterFrame), X, Y); ctx.globalAlpha = 1; }
    }
  }

  drawProp(ctx, cam, pr) {
    let g = 1, variant = pr.variant || 0, frame = Math.floor(this.time * 2) % 2;
    const reg = pr.region || (pr.lm && pr.lm.region) || this.map.region;
    if (reg) g = this.map.interior ? 1 : (this.greenVis[reg] || 0);
    let kind = pr.kind;
    if (kind === 'tree') variant = this.seedCount() + (this.state.flags.omnium_vaincu ? 1 : 0);
    if (kind === 'chest' && pr.lm && this.state.chests[pr.lm.id]) kind = 'chestopen';
    if (kind === 'obelisk' && pr.lm) variant = CONTENT.BOUNDARIES[+pr.lm.id.split('_')[1]].ok ? 1 : 0;
    if (kind === 'pedestal' && pr.lm) variant = (pr.lm.puzzle && this.state.tracker.puzzles[pr.lm.puzzle] && this.state.tracker.puzzles[pr.lm.puzzle].success) || (pr.lm.seed && this.state.seeds[pr.lm.region]) ? 1 : 0;
    if (kind === 'altar' && pr.lm && !pr.lm.seed) variant = this.state.seeds[pr.lm.region] ? 1 : 0;
    if (kind === 'warp' && pr.lm) variant = this.state.warps[pr.lm.id] ? 1 : 0;
    if (kind.startsWith('gate_')) frame = Math.floor(this.time * 4) % 4;
    const c = prop(kind, g, variant, frame);
    const yoff = kind === 'altar' && pr.lm && pr.lm.seed ? 0 : 0;
    ctx.drawImage(c, Math.round(pr.x - cam.x), Math.round(pr.y - cam.y + yoff - (c.height - pr.h)));
    // graine sur l'autel
    if (kind === 'altar' && pr.lm && !pr.lm.seed && this.state.seeds[pr.lm.region]) ctx.drawImage(creature('seed'), Math.round(pr.x + 8 - cam.x), Math.round(pr.y - 6 - cam.y + Math.sin(this.time * 2) * 1.5));
    if (kind === 'altar' && pr.lm && pr.lm.seed && !this.state.seeds[pr.lm.region]) ctx.drawImage(creature('seed'), Math.round(pr.x + 8 - cam.x), Math.round(pr.y - 8 - cam.y + Math.sin(this.time * 3) * 2));
    // repère de quête sur un prop
    if (pr.lm && this.propMark(pr.lm)) ctx.drawImage(icon('quest'), Math.round(pr.x + pr.w / 2 - 5 - cam.x), Math.round(pr.y - (c.height - pr.h) - 12 - cam.y + Math.sin(this.time * 5) * 1.5), 10, 10);
  }
  propMark(lm) {
    const obj = this.currentObjective(); if (!obj || !obj.at) return false;
    return obj.at === lm.id;
  }

  drawAtmosphere(ctx, cam) {
    const m = this.map;
    if (m.interior) {
      const lit = this.hasItem('lanterne') || this.isGreen(m.region);
      const p = this.player; const X = p.x - cam.x, Y = p.y - 8 - cam.y; const r = lit ? 150 : 95;
      const gr = ctx.createRadialGradient(X, Y, r * 0.3, X, Y, r);
      gr.addColorStop(0, 'rgba(0,0,10,0)'); gr.addColorStop(1, `rgba(0,0,10,${m.theme === 'cave' && !lit ? 0.92 : 0.72})`);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, VW, VH);
      return;
    }
    const g = this.greenVis[this.region] || 0;
    if (g < 1) { ctx.fillStyle = `rgba(255,95,30,${0.16 * (1 - g)})`; ctx.fillRect(0, 0, VW, VH); }
    // vignette
    const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.45, VW / 2, VH / 2, VH * 0.95);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(20,5,0,${0.45 - g * 0.2})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
  }

  drawHUD(ctx, cam) {
    const S = this.state;
    // Feuilles de vie
    const full = Math.floor(S.hp / 2), half = S.hp % 2, tot = S.maxHp / 2;
    for (let i = 0; i < tot; i++) {
      const ic = i < full ? 'leaf_full' : (i === full && half ? 'leaf_half' : 'leaf_empty');
      ctx.drawImage(icon(ic), 4 + (i % 10) * 11, 4 + Math.floor(i / 10) * 11, 11, 11);
    }
    // Graines + verdance
    const y2 = 4 + Math.ceil(tot / 10) * 11 + 2;
    ctx.drawImage(icon('coin'), 4, y2, 10, 10); text(ctx, String(S.graines), 16, y2 + 1, '#d8ff9a', 8);
    const vd = this.verdance();
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(VW / 2 - 50, 4, 100, 9);
    ctx.fillStyle = '#2a1a10'; ctx.fillRect(VW / 2 - 48, 6, 96, 5);
    const grd = ctx.createLinearGradient(VW / 2 - 48, 0, VW / 2 + 48, 0); grd.addColorStop(0, '#ff7a2a'); grd.addColorStop(0.5, '#d8d84a'); grd.addColorStop(1, '#4fd65a');
    ctx.fillStyle = grd; ctx.fillRect(VW / 2 - 48, 6, 96 * vd / 100, 5);
    text(ctx, `Verdance ${vd}%`, VW / 2, 14, '#fff', 7, 'center');
    // Arme usée
    if (S.weapon < 100) { const w = S.weapon; ctx.drawImage(icon('baton'), 4, y2 + 12, 10, 10); ctx.fillStyle = '#300'; ctx.fillRect(16, y2 + 16, 30, 3); ctx.fillStyle = w > 30 ? '#7fdf6a' : w > 0 ? '#ffb03a' : '#ff3a3a'; ctx.fillRect(16, y2 + 16, 30 * w / 100, 3); }
    // Mini-carte (région courante)
    if (this.settings.minimap && !this.map.interior && this.region) this.drawMinimap(ctx);
    if (this.map.interior) text(ctx, this.map.title, VW - 4, 4, '#ffefb0', 7, 'right');
    // Objectif
    const obj = this.currentObjective();
    if (obj) {
      const t = obj.text.length > 62 ? obj.text.slice(0, 60) + '…' : obj.text;
      ctx.fillStyle = 'rgba(10,10,20,0.55)'; const tw = Math.min(VW - 8, t.length * 4.8 + 16);
      ctx.fillRect(VW / 2 - tw / 2, VH - 14, tw, 12);
      text(ctx, (obj.quest.main ? '★ ' : '• ') + t, VW / 2, VH - 12, obj.quest.main ? '#ffe27a' : '#cfe8ff', 7, 'center');
      const tp = this.targetPos(obj.at);
      if (tp) this.drawArrow(ctx, cam, tp);
    }
    // Indication d'interaction
    const hint = this.interactHint();
    if (hint) { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(VW / 2 - 50, VH - 30, 100, 12); text(ctx, hint, VW / 2, VH - 28, '#fff', 7, 'center'); }
    if (this.teacher) text(ctx, 'MODE ENSEIGNANT', 4, VH - 10, '#ff9a4a', 7);
  }
  drawArrow(ctx, cam, tp) {
    const sx = tp.x - cam.x, sy = tp.y - cam.y;
    if (sx > 12 && sx < VW - 12 && sy > 20 && sy < VH - 20) {
      if (!this.map.landmarks.some(l => l.t === 'npc' && Math.abs(l.tx * TILE + 8 - tp.x) < 2 && Math.abs(l.ty * TILE + 8 - tp.y) < 2)) {
        const b = Math.sin(this.time * 6) * 2; ctx.fillStyle = '#ffe27a'; ctx.beginPath(); ctx.moveTo(sx, sy - 6 + b); ctx.lineTo(sx - 4, sy - 12 + b); ctx.lineTo(sx + 4, sy - 12 + b); ctx.fill();
      }
      return;
    }
    const cx = VW / 2, cy = VH / 2, a = Math.atan2(sy - cy, sx - cx);
    const r = Math.min((VW / 2 - 14) / Math.abs(Math.cos(a) || 0.001), (VH / 2 - 20) / Math.abs(Math.sin(a) || 0.001));
    const ax = cx + Math.cos(a) * r, ay = cy + Math.sin(a) * r;
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(a);
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-5, -6); ctx.lineTo(-5, 6); ctx.fill();
    ctx.fillStyle = '#ffe27a'; ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.fill();
    ctx.restore();
  }
  interactHint() {
    const p = this.player; const D = [[0, 1], [0, -1], [-1, 0], [1, 0]][p.dir];
    const fx = p.x + D[0] * 14, fy = p.y - 5 + D[1] * 14;
    const key = input.lastDevice === 'touch' ? '✋' : input.lastDevice === 'gamepad' ? 'B' : 'E';
    for (const e of this.entities) if (e instanceof NPC && dist(fx, fy, e.x, e.y - 6) < 22) return `${key} : Parler`;
    for (const pr of this.map.props) {
      if (!pr.lm && !pr.exit) continue;
      const b = pr.box || [pr.x, pr.y, pr.w, pr.h];
      if (fx >= b[0] - 6 && fx < b[0] + b[2] + 6 && fy >= b[1] - 6 && fy < b[1] + b[3] + 6) {
        if (pr.exit) return `${key} : Sortir`;
        const t = pr.lm.t;
        return `${key} : ` + ({ temple: 'Entrer', cave: 'Entrer', chest: 'Ouvrir', mural: 'Examiner', monolith: 'Regarder', stele: 'Lire', sign: 'Lire', book: 'Lire', pedestal: 'Activer', warp: 'Racine', arcade: 'Jouer', altar: 'Examiner', obelisk: 'Examiner', screen: 'Examiner', tree: 'Toucher', tower: 'Monter', dish: 'Examiner' }[t] || 'Examiner');
      }
    }
    return null;
  }

  _buildMinimap() {
    const ow = this.world.overworld;
    const c = document.createElement('canvas'); c.width = ow.w; c.height = ow.h;
    const x = c.getContext('2d'); const img = x.createImageData(ow.w, ow.h);
    let walk = new Set();
    for (let ty = 0; ty < ow.h; ty++) for (let tx = 0; tx < ow.w; tx++) {
      const k = KINDS[ow.t[ty * ow.w + tx]]; const r = ow.regionAt(tx, ty);
      const th = r ? REGIONS[r].theme : 'marais'; const pal = palette(th, r ? (this.greenVis[r] || 0) > 0.5 : true);
      let col = pal.ground[0];
      if (k === 'W' || k === 'D') col = k === 'D' ? '#102030' : pal.water; else if (k === 'P' || k === 'BR') col = pal.path; else if (k === 'M') col = pal.wall; else if (k === 'T' || k === 'B') col = pal.leaf; else if (k === 'S') col = pal.alt; else if (k === 'X' || k === 'R') col = '#555';
      const n = parseInt(col.slice(1), 16); const i = (ty * ow.w + tx) * 4;
      img.data[i] = (n >> 16) & 255; img.data[i + 1] = (n >> 8) & 255; img.data[i + 2] = n & 255; img.data[i + 3] = 255;
      if (r && !SOLID[ow.t[ty * ow.w + tx]]) walk.add(`${Math.floor(tx / 8)}_${Math.floor(ty / 8)}`);
    }
    x.putImageData(img, 0, 0);
    this.minimap = c; this.walkableChunks = walk.size;
  }
  drawMinimap(ctx) {
    const reg = this.region; const o = regionOrigin(reg);
    const W = 64, H = 48, X = VW - W - 4, Y = 4;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(X - 2, Y - 2, W + 4, H + 4);
    ctx.drawImage(this.minimap, o.x, o.y, RW, RH, X, Y, W, H);
    // brouillard
    const ch = this.state.tracker.chunks;
    ctx.fillStyle = 'rgba(10,10,18,0.85)';
    for (let cy = 0; cy < RH / 8; cy++) for (let cx = 0; cx < RW / 8; cx++) if (!ch[`${o.x / 8 + cx}_${o.y / 8 + cy}`]) ctx.fillRect(X + cx * 8, Y + cy * 8, 8, 8);
    // repères
    for (const e of this.entities) if (e instanceof NPC && this.npcMark(e) === 'quest') { ctx.fillStyle = '#ffe27a'; ctx.fillRect(X + e.x / TILE - o.x - 1, Y + e.y / TILE - o.y - 1, 2, 2); }
    const p = this.player; ctx.fillStyle = Math.floor(this.time * 4) % 2 ? '#fff' : '#4fd65a';
    ctx.fillRect(X + p.x / TILE - o.x - 1, Y + p.y / TILE - o.y - 1, 3, 3);
  }
}
