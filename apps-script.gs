/**
 * Space Impact 60 — marcador en Google Sheets
 *
 * Cómo instalarlo (5 minutos):
 *  1. Crea una hoja de cálculo nueva en https://sheets.google.com
 *  2. Menú  Extensiones > Apps Script
 *  3. Borra lo que haya y pega TODO este archivo. Guarda.
 *  4. Botón  Implementar > Nueva implementación
 *       - Tipo: Aplicación web
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquier usuario
 *  5. Copia la URL que termina en /exec
 *  6. Pégala en index.html, en la línea:   var SCORE_URL = '';
 *
 * La hoja "Scores" se crea sola la primera vez.
 */

var SHEET_NAME = 'Scores';
var MAX_TOP = 10;

function doGet() {
  return json({ ok: true, top: readTop() });
}

function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { d = {}; }

  var name = String(d.name || '').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
  if (!name) name = 'AAA';
  var score = parseInt(d.score, 10);
  if (!isFinite(score) || score < 0) score = 0;
  if (score > 999999) score = 999999;
  var wave = parseInt(d.wave, 10);
  if (!isFinite(wave) || wave < 0) wave = 0;
  if (wave > 999) wave = 999;

  sheet().appendRow([name, score, wave, new Date()]);
  return json({ ok: true, top: readTop() });
}

function readTop() {
  var sh = sheet();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var rows = sh.getRange(2, 1, last - 1, 3).getValues();
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var n = String(rows[i][0] || '').slice(0, 3).toUpperCase();
    if (!n) continue;
    out.push({ name: n, score: Number(rows[i][1]) || 0, wave: Number(rows[i][2]) || 0 });
  }
  out.sort(function (a, b) { return b.score - a.score; });
  return out.slice(0, MAX_TOP);
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['nombre', 'puntos', 'oleada', 'fecha']);
  }
  return sh;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
