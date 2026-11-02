// =============================================================
// correction.js — outil enseignant : import des bilans, vérification
// d'intégrité, notation des questions ouvertes, export CSV
// =============================================================
import { CONFIG } from './content/config.js';
import { readVerdanceData } from './core/pdf.js';
import { verify } from './core/report.js';
import { esc, fmtDuration } from './core/util.js';

const KEY = 'verdance.correction.v1';
let store = load();
function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{"reports":{},"grades":{}}'); } catch (e) { return { reports: {}, grades: {} }; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { alert('Stockage plein : exportez en CSV puis videz la liste.'); } }

const $ = s => document.querySelector(s);
$('#go').addEventListener('click', unlock); $('#code').addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });
function unlock() { if ($('#code').value === CONFIG.teacherCode) { $('#lock').remove(); $('#app').classList.remove('hidden'); render(); } else $('#err').textContent = 'Code incorrect.'; }

const drop = $('#drop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); handle([...e.dataTransfer.files]); });
$('#file').addEventListener('change', e => handle([...e.target.files]));
$('#clear').addEventListener('click', () => { if (confirm('Vider la liste des bilans et les notes saisies ?')) { store = { reports: {}, grades: {} }; save(); render(); } });
$('#csv').addEventListener('click', exportCsv);

async function handle(files) {
  for (const f of files) {
    try {
      const buf = new Uint8Array(await f.arrayBuffer());
      const txt = f.name.toLowerCase().endsWith('.json') ? new TextDecoder().decode(buf) : readVerdanceData(buf, CONFIG.pdfUserPassword || '');
      const rep = JSON.parse(txt);
      if (rep.format !== 'verdance-bilan-v1') throw new Error('Format inconnu');
      const valid = verify(rep); rep._file = f.name; rep._valid = valid;
      // Un seul bilan par partie : on garde le plus récent
      const prev = store.reports[rep.saveId];
      if (!prev || prev.generatedAt <= rep.generatedAt) store.reports[rep.saveId] = rep;
    } catch (e) { alert(`${f.name} : impossible de lire le bilan (${e.message}).`); }
  }
  save(); render();
}

function grade(rep) { const g = store.grades[rep.saveId] || {}; const open = Object.values(g).reduce((a, v) => a + (parseFloat(v) || 0), 0); return { open, total: rep.score.auto + Math.min(CONFIG.grading.open, open) }; }

function render() {
  const reps = Object.values(store.reports).sort((a, b) => (a.identity.groupe || '').localeCompare(b.identity.groupe || '') || (a.identity.nom || '').localeCompare(b.identity.nom || ''));
  $('#count').textContent = `${reps.length} bilan(s)`;
  $('#tbl').innerHTML = `<tr><th>Groupe</th><th>Élève</th><th>Intégrité</th><th>Temps</th><th>Verdance</th><th>Quêtes</th><th>Auto /${reps[0] ? reps[0].score.maxAuto : 16}</th><th>Ouvertes /${CONFIG.grading.open}</th><th>Total /20</th><th></th></tr>` +
    reps.map(r => { const g = grade(r); const mq = r.quests.filter(q => q.main), mdone = mq.filter(q => q.status === 'faite').length;
      return `<tr><td>${esc(r.identity.groupe)}</td><td><b>${esc(r.identity.nom)}</b> ${esc(r.identity.prenom)}${r.teacherModeUsed ? ' <span class="ko" title="Mode enseignant utilisé">⚠ prof</span>' : ''}</td>
        <td>${r._valid ? '<span class="ok">✔ authentique</span>' : '<span class="ko">⚠ modifié</span>'}</td><td>${fmtDuration(r.time.totalMs)}</td><td>${r.verdance} %</td><td>${mdone}/${mq.length}</td>
        <td>${r.score.auto.toFixed(2)}</td><td>${g.open.toFixed(2)}</td><td><b>${g.total.toFixed(2)}</b></td><td><button class="btn small" data-id="${r.saveId}">Détail / noter</button></td></tr>`; }).join('');
  document.querySelectorAll('#tbl button').forEach(b => b.addEventListener('click', () => detail(store.reports[b.dataset.id])));
}

function detail(r) {
  const g = store.grades[r.saveId] || (store.grades[r.saveId] = {});
  const perQ = (CONFIG.grading.open / r.open.length);
  $('#details').innerHTML = `<div class="det"><h3>${esc(r.identity.prenom)} ${esc(r.identity.nom)} — ${esc(r.identity.groupe)} · bilan ${esc(r.reportId)} (${new Date(r.generatedAt).toLocaleString('fr-FR')})</h3>
    <p>${r._valid ? '<span class="ok">Code d’intégrité valide.</span>' : '<span class="ko">Le code d’intégrité ne correspond pas : les données ont pu être modifiées.</span>'} Difficulté : ${esc(r.difficulty)}. ${r.ended ? 'Jeu terminé.' : 'Jeu non terminé.'}</p>
    <ul>${r.score.blocks.map(b => `<li><b>${esc(b.label)}</b> : ${b.score === null ? '—' : b.score.toFixed(2)} / ${b.max} — <span class="muted">${esc(b.detail)}</span></li>`).join('')}</ul>
    <h4>Questions ouvertes (barème indicatif : ${perQ.toFixed(2)} pt par question, total plafonné à ${CONFIG.grading.open})</h4>
    ${r.open.map(o => `<div><b>${esc(o.title)}</b> — <span class="muted">${esc(o.q)}</span>
      <div class="ans">${o.text ? esc(o.text) : '<i>(pas de réponse)</i>'}</div>
      <label>Note : <input type="number" step="0.25" min="0" max="${CONFIG.grading.open}" data-q="${o.id}" value="${g[o.id] ?? ''}"></label></div>`).join('')}
    <h4>Missions terrain</h4><ul>${r.missions.map(m => `<li>${m.done ? '✔' : '✗'} ${esc(m.title)}${m.values ? ' : ' + m.values.map(v => esc(v)).join(' · ') : ''}</li>`).join('')}</ul>
    <h4>Énigmes</h4><ul>${r.puzzles.map(p => `<li>${p.success ? '✔' : '✗'} ${esc(p.title)} — ${p.attempts} essai(s), ${p.hints} indice(s)${p.teacher ? ' [prof]' : ''}</li>`).join('')}</ul>
  </div>`;
  $('#details').querySelectorAll('input[data-q]').forEach(i => i.addEventListener('input', () => { g[i.dataset.q] = i.value; save(); render(); }));
  $('#details').scrollIntoView({ behavior: 'smooth' });
}

function exportCsv() {
  const reps = Object.values(store.reports);
  const qids = reps[0] ? reps[0].open.map(o => o.id) : [];
  const head = ['Groupe', 'Nom', 'Prénom', 'Intégrité', 'Temps (min)', 'Verdance %', 'Quêtes principales', 'Quêtes secondaires', 'QCM/énigmes', 'Progression', 'Engagement', 'Note auto', ...qids.map(q => 'Note ' + q), 'Total /20', 'Mode prof', 'Jeu terminé', 'Bilan'];
  const rows = reps.map(r => { const g = store.grades[r.saveId] || {}; const gr = grade(r); const b = Object.fromEntries(r.score.blocks.map(x => [x.id, x.score]));
    return [r.identity.groupe, r.identity.nom, r.identity.prenom, r._valid ? 'OK' : 'MODIFIÉ', Math.round(r.time.totalMs / 60000), r.verdance,
      r.quests.filter(q => q.main && q.status === 'faite').length, r.quests.filter(q => !q.main && q.status === 'faite').length,
      b.qcm, b.progression, b.engagement, r.score.auto, ...qids.map(q => g[q] ?? ''), gr.total.toFixed(2), r.teacherModeUsed ? 'oui' : 'non', r.ended ? 'oui' : 'non', r.reportId]; });
  const csv = [head, ...rows].map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })); a.download = `verdance_classe_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
}
