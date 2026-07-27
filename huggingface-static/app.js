// ============================================================
//  ترنم مهر — شناساگر سال و درس سوالات کنکور (RAG موتور)
//  RAG engine for identifying the year & subject of Konkur questions.
//  Client-side retrieval (TF/bigram scoring) over data/exams.json.
// ============================================================

const DATA_URL = "data/exams.json";
const REMOTE_API_BASE = "https://taranom-psychology-school-10milion.vercel.app"; // main Taranom site (optional LLM enhancement)
const STORAGE_HISTORY = "taranom_exam_rag_history_v1";

let EXAMS = [];
let INDEX = []; // { rec, normText, bigrams:Set, tokens:Set }

// ---------- Persian text normalization ----------
function normalizeFa(text = "") {
  const map = { "ي": "ی", "ك": "ک", "ۀ": "ه", "ة": "ه", "أ": "ا", "إ": "ا", "ؤ": "و", "‌": " ", "‏": " ", "﻿": " " };
  return String(text ?? "")
    .replace(/[يكۀةأإؤ‌‏﻿]/g, (c) => map[c] || c)
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
function tokens(q) { return normalizeFa(q).split(/\s+/).filter((t) => t.length > 1); }
function bigrams(s) { s = normalizeFa(s).replace(/\s+/g, ""); const out = []; for (let i = 0; i < s.length - 1; i++) out.push(s.slice(i, i + 2)); return out; }
function setJaccard(a, b) { if (!a.size && !b.size) return 0; let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter); }

const STOP_WORDS = new Set(["کدام", "است", "میشود", "می", "شود", "در", "با", "به", "از", "و", "یا", "های", "ها", "برای", "لطفا", "بفرمایید", "ربط", "دارد", "میباشد", "این", "آن", "چیست", "چگونه", "چقدر", "که", "را", "رو"]);
function importantTokens(q) { return tokens(q).filter((t) => t.length > 2 && !STOP_WORDS.has(t)); }

// ---------- Build the retrieval index ----------
function buildIndex(data) {
  return data.map((rec) => {
    const normText = normalizeFa(`${rec.question} ${rec.subject} ${rec.field} ${rec.source} ${rec.options ? rec.options.join(" ") : ""} ${rec.explanation || ""}`);
    return {
      rec,
      normText,
      bigrams: new Set(bigrams(normText)),
      tokens: new Set(importantTokens(normText)),
    };
  });
}

// ---------- Score a query against the index ----------
function search(query, topK = 3) {
  const qNorm = normalizeFa(query);
  const qTokens = new Set(importantTokens(qNorm));
  const qBigrams = new Set(bigrams(qNorm));
  if (qTokens.size === 0 && qBigrams.size === 0) return [];

  const scored = INDEX.map((item) => {
    // token overlap (TF-ish)
    let tokenInter = 0;
    for (const t of qTokens) if (item.tokens.has(t)) tokenInter++;
    const tokenScore = qTokens.size ? tokenInter / qTokens.size : 0;
    // bigram Jaccard (catches spelling/morphology)
    const bgScore = setJaccard(qBigrams, item.bigrams);
    // weighted blend
    const score = tokenScore * 0.7 + bgScore * 0.3;
    return { rec: item.rec, score, tokenScore, bgScore };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter((s) => s.score > 0.05);
}

// ---------- UI helpers ----------
const $ = (s) => document.querySelector(s);
function faNum(n) { return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]); }
function escapeHtml(s = "") { return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// ---------- Stats ----------
function renderStats() {
  const years = [...new Set(EXAMS.map((r) => r.year))].sort();
  const subjects = [...new Set(EXAMS.map((r) => r.subject))];
  const fields = [...new Set(EXAMS.map((r) => r.field))];
  $("#statTotal").textContent = faNum(EXAMS.length);
  $("#statYears").textContent = faNum(years.length) + " سال";
  $("#statSubjects").textContent = faNum(subjects.length) + " درس";
  $("#yearChips").innerHTML = years.map((y) => `<span class="chip">کنکور ${faNum(y)}</span>`).join("");
}

// ---------- Render a single result ----------
function renderResult(hit, rank) {
  const r = hit.rec;
  const conf = Math.round(hit.score * 100);
  const confLabel = conf >= 70 ? "تطبیق قوی" : conf >= 40 ? "تطبیق متوسط" : "تطبیق ضعیف";
  const confColor = conf >= 70 ? "strong" : conf >= 40 ? "medium" : "weak";
  const optionsHtml = r.options
    ? r.options.map((o, i) => `<li class="${o === r.answer ? "correct" : ""}">${faNum(i + 1)}) ${escapeHtml(o)} ${o === r.answer ? "✓" : ""}</li>`).join("")
    : "";
  return `
    <div class="result-card ${confColor}">
      <div class="result-head">
        <span class="rank">#${faNum(rank)}</span>
        <span class="conf ${confColor}">${confLabel} — ${faNum(conf)}٪</span>
      </div>
      <div class="result-meta">
        <span class="badge year">📅 ${escapeHtml(r.source || "کنکور " + faNum(r.year))}</span>
        <span class="badge subj">📚 ${escapeHtml(r.subject)}</span>
        <span class="badge field">${escapeHtml(r.field)}</span>
      </div>
      <p class="result-q">«${escapeHtml(r.question)}»</p>
      ${optionsHtml ? `<ol class="options">${optionsHtml}</ol>` : ""}
      ${r.explanation ? `<p class="explain">💡 ${escapeHtml(r.explanation)}</p>` : ""}
    </div>`;
}

// ---------- Search handler ----------
function doSearch() {
  const q = $("#query").value.trim();
  if (!q) { $("#results").innerHTML = `<div class="empty">یک سوال کنکور وارد کنید یا بچسبانید.</div>`; return; }
  const hits = search(q, 3);
  if (hits.length === 0) {
    $("#results").innerHTML = `<div class="empty notfound">❌ تطبیقی در پایگاه دانش پیدا نشد.<br><span>ممکن است سوال در بانک اطلاعاتی نباشد. بانک را با نوت‌بوک Colab گسترش دهید.</span></div>`;
    return;
  }
  $("#results").innerHTML = hits.map((h, i) => renderResult(h, i + 1)).join("");
  // highlight the headline year
  const top = hits[0].rec;
  $("#headline").innerHTML = `این سوال مربوط به <b>${escapeHtml(top.source || "کنکور " + faNum(top.year))}</b> ، درس <b>${escapeHtml(top.subject)}</b> (${escapeHtml(top.field)}) است.`;
  saveHistory(q, top);
}

function saveHistory(q, top) {
  try {
    const h = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");
    h.unshift({ q: q.slice(0, 120), year: top.year, subject: top.subject, at: Date.now() });
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(h.slice(0, 20)));
  } catch (e) {}
}

// ---------- Konkur structure (official question counts per subject) ----------
function renderStructure(struct) {
  const el = $("#structure");
  if (!el || !struct) return;
  // Show تجربی by default (most common)
  const t = struct.tajrobi;
  const fa = (n) => faNum(n);
  let html = `<div class="struct-head">ساختار رسمی کنکور تجربی — ${fa(t.totalSpecific)} سوال اختصاصی (+ عمومی)</div>`;
  html += `<div class="struct-booklets">`;
  for (const b of t.booklets) {
    html += `<div class="booklet"><div class="booklet-name">${escapeHtml(b.name)} <span>(${fa(b.time)} دقیقه)</span></div>`;
    for (const s of b.subjects) {
      html += `<div class="booklet-subj"><span>${escapeHtml(s.subject)}</span><b>${fa(s.count)} سوال</b></div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  html += `<div class="struct-note">بانک فعلی: ${fa(EXAMS.length)} سوال نمونه — قابل گسترش با Colab تا پوشش کامل هر درس</div>`;
  el.innerHTML = html;
}

// ---------- Init ----------
async function init() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    EXAMS = await res.json();
    INDEX = buildIndex(EXAMS);
    renderStats();
    $("#ready").style.display = "flex";
    $("#loading").style.display = "none";
    $("#countLoaded").textContent = faNum(EXAMS.length);
  } catch (e) {
    $("#loading").innerHTML = `⚠️ خطا در بارگذاری پایگاه دانش: ${escapeHtml(e.message)}`;
  }
  // Load Konkur structure (best-effort)
  try {
    const sres = await fetch("data/konkur-structure.json", { cache: "no-store" });
    if (sres.ok) renderStructure(await sres.json());
  } catch (_) {}
  $("#btn").addEventListener("click", doSearch);
  $("#query").addEventListener("keydown", (e) => { if (e.ctrlKey && e.key === "Enter") doSearch(); });
}

document.addEventListener("DOMContentLoaded", init);
