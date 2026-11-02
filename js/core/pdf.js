// =============================================================
// pdf.js — générateur PDF minimal, sans dépendance
// - polices standard Helvetica / Helvetica-Bold (WinAnsi)
// - chiffrement RC4 128 bits (Standard Security Handler, R3) :
//   mot de passe propriétaire = modification interdite ; ouverture libre
//   (ou mot de passe d'ouverture optionnel)
// - données brutes du bilan intégrées dans un flux (/VerdanceData)
// Le même module sait relire et déchiffrer ces données (correction.html).
// =============================================================

// ---------------------------------------------------------------- MD5
function md5(bytes) {
  const K = new Uint32Array(64), S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  const l = bytes.length, nb = (((l + 8) >> 6) + 1) << 6;
  const m = new Uint8Array(nb); m.set(bytes); m[l] = 0x80;
  const dv = new DataView(m.buffer); dv.setUint32(nb - 8, (l * 8) >>> 0, true); dv.setUint32(nb - 4, Math.floor(l / 536870912), true);
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  for (let o = 0; o < nb; o += 64) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + dv.getUint32(o + g * 4, true)) | 0;
      A = D; D = C; C = B;
      const s = S[(i >> 4) * 4 + (i % 4)];
      B = (B + ((F << s) | (F >>> (32 - s)))) | 0;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  const out = new Uint8Array(16), ov = new DataView(out.buffer);
  ov.setUint32(0, a0, true); ov.setUint32(4, b0, true); ov.setUint32(8, c0, true); ov.setUint32(12, d0, true);
  return out;
}

// ---------------------------------------------------------------- RC4
function rc4(key, data) {
  const s = new Uint8Array(256); for (let i = 0; i < 256; i++) s[i] = i;
  for (let i = 0, j = 0; i < 256; i++) { j = (j + s[i] + key[i % key.length]) & 255; [s[i], s[j]] = [s[j], s[i]]; }
  const out = new Uint8Array(data.length);
  for (let k = 0, i = 0, j = 0; k < data.length; k++) { i = (i + 1) & 255; j = (j + s[i]) & 255; [s[i], s[j]] = [s[j], s[i]]; out[k] = data[k] ^ s[(s[i] + s[j]) & 255]; }
  return out;
}

const PAD = new Uint8Array([0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41, 0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08, 0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80, 0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A]);
const latin = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b; };
const cat = (...arrs) => { const n = arrs.reduce((a, b) => a + b.length, 0); const o = new Uint8Array(n); let p = 0; for (const a of arrs) { o.set(a, p); p += a.length; } return o; };
function padPw(pw) { const b = latin(pw || '').slice(0, 32); return cat(b, PAD.slice(0, 32 - b.length)); }

function computeO(owner, user) {
  let h = md5(padPw(owner || user));
  for (let i = 0; i < 50; i++) h = md5(h);
  const key = h.slice(0, 16);
  let o = rc4(key, padPw(user));
  for (let i = 1; i <= 19; i++) o = rc4(key.map(b => b ^ i), o);
  return o;
}
function computeKey(user, O, P, id) {
  const p = new Uint8Array(4); new DataView(p.buffer).setInt32(0, P, true);
  let h = md5(cat(padPw(user), O, p, id));
  for (let i = 0; i < 50; i++) h = md5(h.slice(0, 16));
  return h.slice(0, 16);
}
function computeU(key, id) {
  let u = rc4(key, md5(cat(PAD, id)));
  for (let i = 1; i <= 19; i++) u = rc4(key.map(b => b ^ i), u);
  return cat(u, new Uint8Array(16));
}
function objKey(key, num, gen) {
  const k = cat(key, new Uint8Array([num & 255, (num >> 8) & 255, (num >> 16) & 255, gen & 255, (gen >> 8) & 255]));
  return md5(k).slice(0, Math.min(key.length + 5, 16));
}
const hex = b => Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('');
const unhex = s => { const o = new Uint8Array(s.length / 2); for (let i = 0; i < o.length; i++) o[i] = parseInt(s.substr(i * 2, 2), 16); return o; };

// ---------------------------------------------------------------- Encodage WinAnsi
const WIN = { '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8A, '‹': 0x8B, 'Œ': 0x8C, 'Ž': 0x8E, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9A, '›': 0x9B, 'œ': 0x9C, 'ž': 0x9E, 'Ÿ': 0x9F };
const REPL = { '₂': '2', '₄': '4', '₀': '0', '³': '3', '✔': 'v', '✓': 'v', '✗': 'x', '✕': 'x', '★': '*', '⭐': '*', '→': '->', '➜': '->', '←': '<-', '≈': '~', '≥': '>=', '≤': '<=', '×': 'x', '−': '-', ' ': ' ', ' ': ' ', '⚠': '!', '≠': '!=' };
export function winAnsi(str) {
  const out = [];
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    if (REPL[ch]) { for (const r of REPL[ch]) out.push(r.charCodeAt(0)); continue; }
    if (c >= 32 && c < 127) out.push(c);
    else if (c >= 0xA0 && c <= 0xFF) out.push(c);
    else if (WIN[ch]) out.push(WIN[ch]);
    else if (c === 10) out.push(32);
    else { const n = ch.normalize('NFD')[0]; const cc = n.charCodeAt(0); if (cc >= 32 && cc < 127) out.push(cc); }
  }
  return out;
}
const HW = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584];
function charW(code, bold) {
  let w;
  if (code >= 32 && code < 127) w = HW[code - 32];
  else if (code >= 0xC0) { const base = String.fromCharCode(code).normalize('NFD').charCodeAt(0); w = base >= 32 && base < 127 ? HW[base - 32] : 556; }
  else w = 556;
  return bold ? w * 1.07 : w;
}
export function textWidth(str, size, bold) { return winAnsi(str).reduce((a, c) => a + charW(c, bold), 0) * size / 1000; }

// ---------------------------------------------------------------- Document
export class PDFDoc {
  constructor() { this.pages = []; this.W = 595.28; this.H = 841.89; this.cur = null; }
  page() { this.cur = []; this.pages.push(this.cur); return this; }
  _col(c) { const n = parseInt((c || '#000000').slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map(v => v.toFixed(3)).join(' '); }
  /** y depuis le haut de la page. */
  text(x, y, str, o = {}) {
    const size = o.size || 10, f = o.bold ? 'F2' : 'F1';
    const bytes = winAnsi(str);
    let s = ''; for (const b of bytes) { const ch = String.fromCharCode(b); s += (ch === '(' || ch === ')' || ch === '\\') ? '\\' + ch : ch; }
    let xx = x; if (o.align === 'right') xx = x - textWidth(str, size, o.bold); else if (o.align === 'center') xx = x - textWidth(str, size, o.bold) / 2;
    this.cur.push(`BT /${f} ${size} Tf ${this._col(o.color)} rg ${xx.toFixed(2)} ${(this.H - y - size).toFixed(2)} Td (${s}) Tj ET`);
  }
  rect(x, y, w, h, fill, stroke) {
    if (fill) this.cur.push(`${this._col(fill)} rg ${x.toFixed(2)} ${(this.H - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
    if (stroke) this.cur.push(`${this._col(stroke)} RG 0.6 w ${x.toFixed(2)} ${(this.H - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  }
  line(x1, y1, x2, y2, col = '#999999', w = 0.5) { this.cur.push(`${this._col(col)} RG ${w} w ${x1.toFixed(2)} ${(this.H - y1).toFixed(2)} m ${x2.toFixed(2)} ${(this.H - y2).toFixed(2)} l S`); }
  /** Coupe un texte en lignes de largeur max. */
  wrap(str, width, size, bold) {
    const out = [];
    for (const para of String(str ?? '').split(/\n/)) {
      const words = para.split(/\s+/); let line = '';
      for (const w of words) {
        const t = line ? line + ' ' + w : w;
        if (textWidth(t, size, bold) > width && line) { out.push(line); line = w; }
        else line = t;
      }
      out.push(line);
    }
    return out;
  }

  /** Construit le fichier. opts = { ownerPassword, userPassword, data (string), title, author } */
  build(opts = {}) {
    const enc = new TextEncoder();
    const id = md5(enc.encode(String(Date.now()) + Math.random() + (opts.title || '')));
    const P = -1340; // impression + accessibilité ; modification/copie interdites
    const encrypt = !!opts.ownerPassword;
    let key = null, O = null, U = null;
    if (encrypt) { O = computeO(opts.ownerPassword, opts.userPassword || ''); key = computeKey(opts.userPassword || '', O, P, id); U = computeU(key, id); }
    const objs = []; // { num, dict, stream (Uint8Array|null) }
    const add = (dict, stream = null) => { const num = objs.length + 1; objs.push({ num, dict, stream }); return num; };
    const strEnc = (num, s) => {
      if (!encrypt) return '(' + s.replace(/[()\\]/g, m => '\\' + m) + ')';
      return '<' + hex(rc4(objKey(key, num, 0), latin(String.fromCharCode(...winAnsi(s))))) + '>';
    };
    const catalog = add(null), pagesN = add(null);
    const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const kids = [];
    for (const pg of this.pages) {
      const content = latin(pg.join('\n'));
      const cN = add('', content);
      const pN = add(`<< /Type /Page /Parent ${pagesN} 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${cN} 0 R >>`);
      kids.push(pN);
    }
    let dataN = null;
    if (opts.data) dataN = add('/VerdanceData true', enc.encode(opts.data));
    objs[catalog - 1].dict = `<< /Type /Catalog /Pages ${pagesN} 0 R >>`;
    objs[pagesN - 1].dict = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
    const infoN = add(null);
    objs[infoN - 1].dict = `<< /Title ${strEnc(infoN, opts.title || 'Bilan')} /Author ${strEnc(infoN, opts.author || '')} /Producer ${strEnc(infoN, 'Verdance')} /CreationDate ${strEnc(infoN, 'D:' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14))} >>`;
    let encN = null;
    if (encrypt) encN = add(`<< /Filter /Standard /V 2 /R 3 /Length 128 /O <${hex(O)}> /U <${hex(U)}> /P ${P} >>`);
    // sérialisation
    const parts = [latin('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
    let off = parts[0].length; const xref = [];
    for (const o of objs) {
      xref[o.num] = off;
      let chunk;
      if (o.stream) {
        let data = o.stream;
        if (encrypt && o.num !== encN) data = rc4(objKey(key, o.num, 0), data);
        const extra = o.dict && o.dict.startsWith('/') ? ' ' + o.dict : '';
        chunk = cat(latin(`${o.num} 0 obj\n<< /Length ${data.length}${extra} >>\nstream\n`), data, latin('\nendstream\nendobj\n'));
      } else chunk = latin(`${o.num} 0 obj\n${o.dict}\nendobj\n`);
      parts.push(chunk); off += chunk.length;
    }
    let xr = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objs.length; i++) xr += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
    xr += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${infoN} 0 R${encrypt ? ` /Encrypt ${encN} 0 R` : ''} /ID [<${hex(id)}> <${hex(id)}>] >>\nstartxref\n${off}\n%%EOF\n`;
    parts.push(latin(xr));
    return cat(...parts);
  }
}

// ---------------------------------------------------------------- Lecture (correction.html)
/** Extrait et déchiffre les données /VerdanceData d'un PDF produit par ce module. */
export function readVerdanceData(bytes, userPassword = '') {
  let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  const m = s.match(/(\d+) 0 obj\n<< \/Length (\d+) \/VerdanceData true >>\nstream\n/);
  if (!m) throw new Error('Ce PDF ne contient pas de données Verdance.');
  const num = +m[1], len = +m[2], start = m.index + m[0].length;
  let data = bytes.slice(start, start + len);
  const em = s.match(/\/Encrypt (\d+) 0 R/);
  if (em) {
    const O = unhex(s.match(/\/O <([0-9a-f]+)>/)[1]);
    const P = +s.match(/\/P (-?\d+)/)[1];
    const id = unhex(s.match(/\/ID \[<([0-9a-f]+)>/)[1]);
    const key = computeKey(userPassword, O, P, id);
    data = rc4(objKey(key, num, 0), data);
  }
  return new TextDecoder().decode(data);
}
