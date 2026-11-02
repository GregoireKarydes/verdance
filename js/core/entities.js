// =============================================================
// entities.js — joueur, mobs, PNJ, projectiles, particules
// =============================================================
import { TILE, clamp, dist, rng } from './util.js';
import { playerSprite, humanoid, creature, icon, text } from './gfx.js';
import { input } from './input.js';
import { audio } from './audio.js';
import { MOBS } from '../content/mobs.js';

const DIRS = [[0, 1], [0, -1], [-1, 0], [1, 0]];

// ---------------------------------------------------------------- Base
export class Entity {
  constructor(x, y) { this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.w = 10; this.h = 8; this.dead = false; this.t = 0; }
  get box() { return [this.x - this.w / 2, this.y - this.h, this.w, this.h]; }
  overlaps(o, pad = 0) {
    const a = this.box, b = o.box;
    return a[0] - pad < b[0] + b[2] && a[0] + a[2] + pad > b[0] && a[1] - pad < b[1] + b[3] && a[1] + a[3] + pad > b[1];
  }
}

// ---------------------------------------------------------------- Joueur
export class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.dir = 0; this.frame = 0; this.anim = 0;
    this.attackT = 0; this.attackCd = 0; this.rollT = 0; this.rollCd = 0; this.inv = 0;
    this.shield = false; this.kx = 0; this.ky = 0; this.stepT = 0; this.hitSet = new Set();
  }
  update(g, dt) {
    this.t += dt;
    const S = g.state;
    this.attackCd -= dt; this.rollCd -= dt; this.inv -= dt;
    const ax = input.axis();
    this.shield = input.down('shield') && this.attackT <= 0 && this.rollT <= 0;
    let speed = 72 * (this.shield ? 0.45 : 1);
    if (g.teacher && g.teacher.fast) speed *= 1.8;
    // Roulade
    if (input.pressed('roll') && this.rollCd <= 0 && this.attackT <= 0) {
      this.rollT = 0.28; this.rollCd = 0.65; audio.sfx('roll');
      const d = (ax.x || ax.y) ? ax : { x: DIRS[this.dir][0], y: DIRS[this.dir][1] };
      this.rx = d.x; this.ry = d.y; g.dust(this.x, this.y);
    }
    // Attaque
    if (input.pressed('attack') && this.attackCd <= 0 && this.rollT <= 0) {
      this.attackT = 0.22; this.attackCd = 0.34; this.hitSet.clear(); audio.sfx('swing');
    }
    let mx = 0, my = 0;
    if (this.rollT > 0) { this.rollT -= dt; mx = this.rx * 170; my = this.ry * 170; }
    else if (this.attackT > 0) { this.attackT -= dt; mx = ax.x * 20; my = ax.y * 20; this._attackHits(g); }
    else {
      mx = ax.x * speed; my = ax.y * speed;
      if (ax.x || ax.y) {
        if (!this.shield) {
          if (Math.abs(ax.x) > Math.abs(ax.y)) this.dir = ax.x < 0 ? 2 : 3; else this.dir = ax.y < 0 ? 1 : 0;
        }
        this.anim += dt * 8; this.frame = Math.floor(this.anim) % 2;
        this.stepT -= dt; if (this.stepT <= 0) { this.stepT = 0.32; audio.sfx('step'); }
      } else this.frame = 0;
    }
    // Recul
    mx += this.kx; my += this.ky; this.kx *= 0.85; this.ky *= 0.85;
    if (Math.abs(this.kx) < 1) this.kx = 0; if (Math.abs(this.ky) < 1) this.ky = 0;
    g.move(this, mx * dt, my * dt);
  }
  attackBox() {
    const [dx, dy] = DIRS[this.dir];
    const cx = this.x + dx * 12, cy = this.y - 5 + dy * 11;
    return [cx - 9, cy - 9, 18, 18];
  }
  _attackHits(g) {
    const b = this.attackBox();
    for (const e of g.entities) {
      if (!(e instanceof Mob) || e.dead || this.hitSet.has(e)) continue;
      const m = e.box;
      if (b[0] < m[0] + m[2] && b[0] + b[2] > m[0] && b[1] < m[1] + m[3] && b[1] + b[3] > m[1]) {
        this.hitSet.add(e); e.hurt(g, g.attackPower(), this);
      }
    }
    // Buissons coupables
    const [dx, dy] = DIRS[this.dir];
    const tx = Math.floor((this.x + dx * 12) / TILE), ty = Math.floor((this.y - 4 + dy * 12) / TILE);
    g.cutBush(tx, ty);
  }
  hurt(g, dmg, src) {
    if (this.inv > 0 || this.rollT > 0) return false;
    if (g.teacher && g.teacher.god) return false;
    const d = g.settings.difficulty;
    if (d === 'exploration') dmg = 0;
    else if (d === 'apprentissage') dmg = dmg >= 2 ? Math.ceil(dmg / 2) : (Math.random() < 0.5 ? dmg : 0);
    else if (d === 'heroique') dmg = Math.ceil(dmg * 1.5);
    this.inv = d === 'apprentissage' || d === 'exploration' ? 1.6 : 1.0;
    if (src) { const a = Math.atan2(this.y - src.y, this.x - src.x); this.kx = Math.cos(a) * 220; this.ky = Math.sin(a) * 220; }
    if (dmg > 0) { g.state.hp = Math.max(0, g.state.hp - dmg); audio.sfx('hurt'); g.shake(4); g.flash('rgba(255,40,40,0.25)'); }
    if (g.state.hp <= 0) g.playerDied();
    return true;
  }
  draw(ctx, cam, g) {
    if (this.inv > 0 && Math.floor(this.inv * 20) % 2 === 0 && this.rollT <= 0) return;
    const act = this.attackT > 0 ? 'attack' : 'walk';
    const tunic = g.tunicColor();
    const spr = playerSprite(this.dir, this.frame, act, tunic);
    const X = Math.round(this.x - 8 - cam.x), Y = Math.round(this.y - 16 - cam.y);
    // ombre
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(X + 3, Y + 14, 10, 3);
    if (this.rollT > 0) { ctx.save(); ctx.translate(X + 8, Y + 10); ctx.rotate((this.rollT / 0.28) * Math.PI * 2 * (this.rx >= 0 ? 1 : -1)); ctx.drawImage(spr, -8, -10); ctx.restore(); }
    else ctx.drawImage(spr, X, Y);
    // Bâton
    if (this.attackT > 0) {
      const p = 1 - this.attackT / 0.22; const [dx, dy] = DIRS[this.dir];
      const base = Math.atan2(dy, dx), a = base - 1.2 + p * 2.4;
      const cx = X + 8, cy = Y + 9;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      ctx.fillStyle = '#8a5a2a'; ctx.fillRect(2, -1, 13, 2); ctx.fillStyle = '#5fdf6a'; ctx.fillRect(13, -2, 4, 4);
      ctx.restore();
      if (!g.settings.reduceMotion) { ctx.strokeStyle = 'rgba(200,255,200,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 15, base - 1.2, a); ctx.stroke(); }
    }
    // Bouclier
    if (this.shield && g.hasItem('bouclier')) {
      const [dx, dy] = DIRS[this.dir];
      ctx.drawImage(icon('bouclier'), X + dx * 8, Y + 2 + dy * 6);
    }
  }
}

// ---------------------------------------------------------------- Mobs
export class Mob extends Entity {
  constructor(kind, x, y, opts = {}) {
    super(x, y);
    const d = MOBS[kind]; this.kind = kind; this.def = d;
    this.hpMax = this.hp = d.hp * (opts.elite ? 2 : 1); this.elite = !!opts.elite; this.small = !!opts.small;
    if (this.small) { this.hpMax = this.hp = 1; }
    const sz = d.size || 16; this.size = sz; this.w = sz === 16 ? 11 : sz * 0.7; this.h = sz === 16 ? 9 : sz * 0.5;
    this.state = 'wander'; this.wt = 0; this.wx = 0; this.wy = 0; this.shootT = 1 + Math.random() * 2; this.flash = 0; this.stun = 0;
    this.chargeT = 0; this.home = { x, y }; this.challenged = false; this.frame = 0; this.dirX = 1;
    this.r = rng((x * 13 + y * 7) | 0);
    this.phase = 0; this.layers = opts.layers || null; this.spawned = 0;
  }
  get visible() { return true; }
  update(g, dt) {
    this.t += dt; this.flash -= dt;
    if (this.stun > 0) { this.stun -= dt; this.vx *= 0.8; this.vy *= 0.8; g.move(this, this.vx * dt, this.vy * dt); return; }
    const p = g.player, d = this.def;
    const dd = dist(this.x, this.y, p.x, p.y);
    this.frame = Math.floor(this.t * 4) % 2;
    let spd = d.speed * (this.small ? 1.25 : 1) * (this.elite ? 1.15 : 1);
    if (g.settings.difficulty === 'exploration') spd *= 0.8; else if (g.settings.difficulty === 'apprentissage') spd *= 0.85;
    let mx = 0, my = 0;
    const toP = () => { const a = Math.atan2(p.y - this.y, p.x - this.x); return [Math.cos(a), Math.sin(a)]; };
    const wander = () => {
      this.wt -= dt; if (this.wt <= 0) { this.wt = 1 + this.r() * 2; const a = this.r() * Math.PI * 2; this.wx = Math.cos(a) * (this.r() < 0.3 ? 0 : 1); this.wy = Math.sin(a) * (this.r() < 0.3 ? 0 : 1); }
      mx = this.wx * spd * 0.5; my = this.wy * spd * 0.5;
      if (dist(this.x, this.y, this.home.x, this.home.y) > 120) { const a = Math.atan2(this.home.y - this.y, this.home.x - this.x); mx = Math.cos(a) * spd * 0.6; my = Math.sin(a) * spd * 0.6; }
    };
    // Défi des élites
    if (this.elite && !this.challenged && dd < 44 && g.canChallenge()) { this.challenged = true; g.eliteChallenge(this); return; }
    switch (d.beh) {
      case 'chase': case 'splitter': case 'exploder':
        if (dd < 100) { const [cx, cy] = toP(); mx = cx * spd; my = cy * spd; } else wander();
        break;
      case 'wander': wander(); if (dd < 50) { const [cx, cy] = toP(); mx = cx * spd * 0.6; my = cy * spd * 0.6; } break;
      case 'shooter':
        if (dd < 130) {
          const [cx, cy] = toP();
          if (dd < 55) { mx = -cx * spd; my = -cy * spd; } else if (dd > 90) { mx = cx * spd * 0.7; my = cy * spd * 0.7; }
          else { mx = -cy * spd * 0.5; my = cx * spd * 0.5; }
          this.shootT -= dt;
          if (this.shootT <= 0) { this.shootT = 2.6 + this.r() * 1.4; g.shootBubble(this, d.quotes || 'myth'); }
        } else wander();
        break;
      case 'charger':
        if (this.chargeT > 0) { this.chargeT -= dt; mx = this.cx * spd * 4; my = this.cy * spd * 4; }
        else if (dd < 90 && this.r() < dt * 1.2) { const [cx, cy] = toP(); this.cx = cx; this.cy = cy; this.chargeT = 0.5; this.flash = 0.2; }
        else if (dd < 110) { const [cx, cy] = toP(); mx = cx * spd * 0.4; my = cy * spd * 0.4; } else wander();
        break;
      case 'boss_golem': this._bossGolem(g, dt, dd, toP); return;
      case 'boss_omnium': this._bossOmnium(g, dt, dd, toP); return;
      case 'boss_guardian': this._bossGuardian(g, dt, dd, toP); return;
    }
    if (mx) this.dirX = Math.sign(mx);
    this.vx = mx; this.vy = my;
    g.move(this, mx * dt, my * dt);
    // Contact
    if (this.overlaps(p, -1)) {
      if (d.beh === 'exploder') { this.explode(g); return; }
      if (p.hurt(g, d.dmg, this)) {
        if (d.wear) g.wearWeapon(d.wear);
        g.onPlayerHitBy(this);
      }
    }
  }
  _bossGolem(g, dt, dd, toP) {
    // Se déplace lentement, invoque des obésiciels, chaque coup retire une couche
    const [cx, cy] = toP();
    if (this.stun <= 0) g.move(this, cx * this.def.speed * dt, cy * this.def.speed * dt);
    this.shootT -= dt;
    if (this.shootT <= 0) { this.shootT = 4; if (g.countMobs() < 6) { g.spawnMob('blob', this.x + (this.r() - 0.5) * 40, this.y + 20, { small: true }); } }
    if (this.overlaps(g.player, -2)) g.player.hurt(g, this.def.dmg, this);
  }
  _bossGuardian(g, dt, dd, toP) {
    // Phase 0 : charges ; phase 1 (mi-vie) : bouclier + bulles d'idées reçues. Une parade réussie l'étourdit : point faible exposé.
    if (!this.phase && this.hp <= this.hpMax / 2) { this.phase = 1; this.shootT = 1; audio.sfx('shield'); g.float('Bouclier ! Pare ses bulles', this.x, this.y - 40, '#6ad8ff'); }
    const [cx, cy] = toP(); const spd = this.def.speed * (g.easy() ? 0.85 : 1);
    this.dirX = cx >= 0 ? 1 : -1;
    if (this.phase === 0) {
      if (this.chargeT > 0) { this.chargeT -= dt; g.move(this, this.cx * spd * 3.2 * dt, this.cy * spd * 3.2 * dt); }
      else { g.move(this, cx * spd * dt, cy * spd * dt); this.shootT -= dt; if (this.shootT <= 0 && dd < 120) { this.shootT = g.easy() ? 3 : 2.2; this.cx = cx; this.cy = cy; this.chargeT = 0.55; this.flash = 0.3; } }
    } else {
      if (dd < 60) g.move(this, -cx * spd * dt, -cy * spd * dt); else if (dd > 110) g.move(this, cx * spd * 0.6 * dt, cy * spd * 0.6 * dt);
      this.shootT -= dt; if (this.shootT <= 0) { this.shootT = g.easy() ? 3 : 2; g.shootBubble(this, 'myth', true); }
    }
    if (this.overlaps(g.player, -4)) g.player.hurt(g, this.def.dmg, this);
  }
  _bossOmnium(g, dt, dd, toP) {
    // Phase 0 : clones de l'effet rebond ; phase 1 : bouclier de greenwashing (parer 4 bulles) ; phase 2 : vulnérable
    this.shootT -= dt;
    if (this.phase === 0) {
      if (this.spawned < 6 && this.shootT <= 0) { this.shootT = 1.4; this.spawned++; g.spawnMob(['blob', 'zombie', 'hallu', 'flame', 'spam', 'gear'][this.spawned % 6], this.x + (this.r() - 0.5) * 120, this.y + 50 + this.r() * 30, { bossMinion: true }); }
      if (this.spawned >= 6 && g.countMobs(e => e.bossMinion) === 0) { this.phase = 1; this.parries = 0; g.bossPhase(this, 1); }
    } else if (this.phase === 1) {
      if (this.shootT <= 0) { this.shootT = 1.8; g.shootBubble(this, 'myth', true); }
      if (this.parries >= 4) { this.phase = 2; g.bossPhase(this, 2); this.shootT = 2; }
    } else {
      if (this.shootT <= 0) { this.shootT = 2.2; g.shootBubble(this, 'myth', true); if (g.countMobs() < 4) g.spawnMob('spam', this.x, this.y + 40); }
    }
    if (this.overlaps(g.player, -6)) g.player.hurt(g, this.def.dmg, this);
  }
  hurt(g, dmg, src) {
    if (this.def.beh === 'boss_omnium' && this.phase < 2) { audio.sfx('shield'); g.float('Invulnérable !', this.x, this.y - 40, '#ffd84a'); return; }
    if (this.def.beh === 'boss_guardian' && this.phase === 1 && this.stun < 0.2) { audio.sfx('shield'); g.float('Bouclier ! Pare une bulle (Maj)', this.x, this.y - 40, '#6ad8ff'); return; }
    this.hp -= dmg; this.flash = 0.15; audio.sfx('hit'); g.sparks(this.x, this.y - 6, '#fff');
    if (src) { const a = Math.atan2(this.y - src.y, this.x - src.x); this.vx = Math.cos(a) * 140; this.vy = Math.sin(a) * 140; this.stun = Math.max(this.stun, this.def.boss ? 0.12 : 0.25); }
    if (this.def.beh === 'boss_golem') g.golemLayerHit(this);
    if (this.hp <= 0) this.die(g);
  }
  explode(g) {
    if (g.hasItem('pinces')) { g.float('Recyclée !', this.x, this.y - 14, '#7fff9a'); audio.sfx('coin'); g.addGraines(2); g.track('recyclage'); this.dead = true; return; }
    audio.sfx('explode'); g.sparks(this.x, this.y, '#ffa03a', 20); g.shake(6);
    if (dist(this.x, this.y, g.player.x, g.player.y) < 30) g.player.hurt(g, this.def.dmg, this);
    this.dead = true;
  }
  die(g) {
    this.dead = true;
    if (this.def.beh === 'exploder' && !g.hasItem('pinces')) { this.explode(g); }
    audio.sfx('kill'); g.sparks(this.x, this.y - 6, this.def.tint || '#ddd', 12);
    if (this.def.beh === 'splitter' && !this.small) {
      g.spawnMob(this.kind, this.x - 8, this.y, { small: true }); g.spawnMob(this.kind, this.x + 8, this.y, { small: true });
    }
    g.onMobKilled(this);
  }
  draw(ctx, cam, g) {
    const d = this.def;
    let alpha = 1;
    if (d.ghost === true && !g.hasItem('lanterne')) alpha = 0.12;
    if (d.ghost === 'lentille' && !g.hasItem('lentille')) alpha = 0.18;
    const spr = creature(d.sprite, this.frame, this.dirX > 0 ? 3 : 2, this.tint || d.tint || null);
    const s = this.size, sc = this.small ? 0.7 : 1;
    const X = Math.round(this.x - (s * sc) / 2 - cam.x), Y = Math.round(this.y - s * sc - cam.y + (d.beh === 'boss_omnium' ? 0 : Math.sin(this.t * 4) * (d.sprite === 'cloud' || d.sprite === 'ghost' ? 1.5 : 0)));
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(X + 3 * sc, Y + s * sc - 2, s * sc - 6 * sc, 3);
    if (this.elite) { ctx.fillStyle = `rgba(255,216,74,${0.35 + Math.sin(this.t * 6) * 0.2})`; ctx.fillRect(X - 2, Y - 2, s * sc + 4, s * sc + 4); }
    if (this.flash > 0) ctx.filter = 'brightness(3)';
    ctx.drawImage(spr, X, Y, s * sc, s * sc);
    ctx.filter = 'none';
    if (d.beh === 'boss_guardian' && this.phase === 1) {
      const cxp = X + s / 2, cyp = Y + s / 2;
      if (this.stun > 0.2) { const r = 5 + Math.sin(this.t * 10) * 1.5; ctx.fillStyle = 'rgba(255,216,74,0.9)'; ctx.beginPath(); ctx.arc(cxp, cyp + 2, r, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cxp, cyp + 2, r * 0.4, 0, 7); ctx.fill(); }
      else { ctx.strokeStyle = `rgba(106,216,255,${0.55 + Math.sin(this.t * 5) * 0.25})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cxp, cyp, s * 0.62, 0, 7); ctx.stroke(); }
    }
    ctx.restore();
    if (d.beh === 'boss_guardian' && this.phase === 1 && this.stun > 0.2) text(ctx, 'Point faible !', X + s / 2, Y + s + 2, '#ffd84a', 7, 'center');
    if (alpha > 0.5 && (dist(this.x, this.y, g.player.x, g.player.y) < 70 || d.boss)) {
      const lbl = d.beh === 'boss_golem' ? `${g.golemWeight} Ko` : (this.gname || d.label);
      text(ctx, lbl, X + (s * sc) / 2, Y - 9, this.elite ? '#ffd84a' : '#fff', 7, 'center');
      if (this.hp < this.hpMax || d.boss) { ctx.fillStyle = '#300'; ctx.fillRect(X, Y - 2, s * sc, 2); ctx.fillStyle = '#ff4a4a'; ctx.fillRect(X, Y - 2, s * sc * (this.hp / this.hpMax), 2); }
    }
    if (this.stun > 0.3) text(ctx, '✶', X + s / 2, Y - 16, '#ffd84a', 8, 'center');
  }
}

// ---------------------------------------------------------------- Projectile « bulle d'idée »
export class Bubble extends Entity {
  constructor(x, y, vx, vy, stmt, owner) { super(x, y); this.vx = vx; this.vy = vy; this.stmt = stmt; this.owner = owner; this.life = 4; this.w = 8; this.h = 8; this.reflected = false; }
  update(g, dt) {
    this.t += dt; this.life -= dt; if (this.life <= 0) { this.dead = true; return; }
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (g.solid(this.x, this.y - 4)) { this.dead = true; g.sparks(this.x, this.y - 4, '#cfe8ff', 4); return; }
    if (this.reflected) {
      for (const e of g.entities) if (e instanceof Mob && !e.dead && this.overlaps(e)) { e.stun = 1.5; e.hurt(g, 1, this); this.dead = true; return; }
      return;
    }
    const p = g.player;
    if (this.overlaps(p)) {
      // Bouclier orienté vers la bulle ?
      const facing = DIRS[p.dir];
      const dot = (-this.vx * facing[0] - this.vy * facing[1]);
      if (p.shield && g.hasItem('bouclier') && dot > 0) { this.dead = true; audio.sfx('shield'); g.parryChallenge(this); return; }
      this.dead = true; g.bubbleHit(this);
    }
  }
  draw(ctx, cam) {
    const X = Math.round(this.x - cam.x), Y = Math.round(this.y - 6 - cam.y);
    ctx.fillStyle = this.reflected ? '#7fffb0' : (this.stmt && this.stmt.v === false ? '#ff9af0' : '#cfe8ff');
    ctx.beginPath(); ctx.arc(X, Y, 5 + Math.sin(this.t * 10), 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1b1420'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.stmt && this.stmt.v === false ? '!' : 'i', X, Y + 1);
  }
}

// ---------------------------------------------------------------- PNJ
export class NPC extends Entity {
  constructor(def, lm) {
    super(lm.tx * TILE + 8, lm.ty * TILE + 14);
    this.def = def; this.lm = lm; this.id = def.id; this.dir = def.dir ?? 0; this.w = 12; this.h = 10; this.bob = Math.random() * 6;
  }
  update(g, dt) {
    this.t += dt;
    if (this.def.wander) { /* PNJ statiques pour garder des repères clairs */ }
    const p = g.player; if (dist(this.x, this.y, p.x, p.y) < 40) {
      const dx = p.x - this.x, dy = p.y - this.y;
      this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : (dy < 0 ? 1 : 0);
    } else this.dir = this.def.dir ?? 0;
  }
  sprite(frame = 0) {
    const d = this.def;
    if (d.kind === 'robot') return creature('robot', frame);
    if (d.kind === 'dog') return creature('dog', frame);
    if (d.kind === 'gargantua') return creature('omnium', frame);
    return humanoid(d.look || {}, this.dir, 0, 'idle');
  }
  draw(ctx, cam, g) {
    const fr = Math.floor((this.t + this.bob) * 2) % 2;
    const spr = this.sprite(fr);
    const big = this.def.kind === 'gargantua';
    const sz = big ? 40 : 16;
    // joie : sautillements quand la région vient de reverdir
    const joy = g.joy && g.joy[this.lm.region] > g.time && !big;
    const hop = joy ? Math.round(Math.abs(Math.sin((g.time + this.bob) * 7)) * 4) : 0;
    const X = Math.round(this.x - sz / 2 - cam.x), Y = Math.round(this.y - sz - cam.y - (fr && !big ? 1 : 0)) - hop;
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(X + 3, Y + hop + sz - 2 + (fr ? 1 : 0), sz - 6, 3);
    ctx.drawImage(spr, X, Y, sz, sz);
    if (joy) text(ctx, ['♪', '♥', '✿'][Math.floor((g.time * 1.5 + this.bob * 3) % 3)], X + sz - 2, Y - 6 - Math.sin(g.time * 4 + this.bob) * 2, '#ffe27a', 7, 'center');
    const mark = g.npcMark(this);
    if (mark) {
      const yy = Y - 10 + Math.sin(this.t * 5) * 1.5;
      ctx.drawImage(icon(mark === 'quest' ? 'quest' : 'talk'), X + sz / 2 - 5, yy, 10, 10);
    }
    if (dist(this.x, this.y, g.player.x, g.player.y) < 34) text(ctx, this.def.name, X + sz / 2, Y - 20, '#ffefb0', 7, 'center');
  }
}

// ---------------------------------------------------------------- Ramassables
export class Pickup extends Entity {
  constructor(x, y, kind, amount = 1) { super(x, y); this.kind = kind; this.amount = amount; this.life = 14; this.vy = -60; this.z = 0; this.w = 10; this.h = 10; }
  update(g, dt) {
    this.t += dt; this.life -= dt; if (this.life <= 0) this.dead = true;
    this.z = Math.max(0, this.z - this.vy * dt); this.vy -= 200 * dt; if (this.z === 0) this.vy = 0;
    const p = g.player;
    const d = dist(this.x, this.y, p.x, p.y);
    if (d < 40 && this.t > 0.4) { this.x += (p.x - this.x) * dt * 6; this.y += (p.y - this.y) * dt * 6; }
    if (d < 10 && this.t > 0.3) { this.dead = true; g.collect(this); }
  }
  draw(ctx, cam) {
    if (this.life < 3 && Math.floor(this.life * 8) % 2) return;
    const ic = { graine: 'coin', fruit: 'fruit', codex: 'scroll', kit: 'kit' }[this.kind] || 'coin';
    ctx.drawImage(icon(ic), Math.round(this.x - 6 - cam.x), Math.round(this.y - 12 - this.z - cam.y + Math.sin(this.t * 5)), 12, 12);
  }
}

// ---------------------------------------------------------------- Particules
export class Particles {
  constructor() { this.list = []; }
  add(p) { if (this.list.length < 600) this.list.push(p); }
  burst(x, y, col, n = 8, sp = 60, life = 0.5, grav = 0) {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = sp * (0.4 + Math.random() * 0.8); this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life, max: life, col, size: 1 + Math.random() * 2, grav }); }
  }
  update(dt) {
    for (const p of this.list) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.grav || 0) * dt; if (p.drift) p.vx += Math.sin(p.life * 3) * p.drift * dt; }
    this.list = this.list.filter(p => p.life > 0);
  }
  draw(ctx, cam) {
    for (const p of this.list) {
      ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
      ctx.fillStyle = p.col; const s = p.size;
      ctx.fillRect(Math.round(p.x - cam.x), Math.round(p.y - cam.y), s, s);
    }
    ctx.globalAlpha = 1;
  }
}

export class FloatText {
  constructor(txt, x, y, col = '#fff', life = 1.2) { this.txt = txt; this.x = x; this.y = y; this.col = col; this.life = life; this.max = life; }
  update(dt) { this.life -= dt; this.y -= 14 * dt; return this.life > 0; }
  draw(ctx, cam) { ctx.globalAlpha = clamp(this.life / this.max * 2, 0, 1); text(ctx, this.txt, Math.round(this.x - cam.x), Math.round(this.y - cam.y), this.col, 8, 'center'); ctx.globalAlpha = 1; }
}
