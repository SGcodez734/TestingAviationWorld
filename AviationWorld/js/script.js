/* Shared behaviour for every page. Page-specific code runs by data-page. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const BASE = document.body.dataset.base || "";
const PAGE = document.body.dataset.page;
const fmt = n => n.toLocaleString("en-US");
const byId = (arr, id) => arr.find(x => x.id === id);

/* ---------- Layout (header, footer, theme, menu) ---------- */
const NAV = [
  ["index.html", "Home", "home"],
  ["pages/aircraft.html", "Aircraft", "aircraft"],
  ["pages/airlines.html", "Airlines", "airlines"],
  ["pages/about.html", "About", "about"]
];

function renderLayout() {
  $("#site-header").innerHTML = `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="${BASE}index.html"><span class="logo">✈</span> Skyline<b>Aviation</b></a>
        <nav id="menu" class="menu" aria-label="Main">
          ${NAV.map(([h, t, k]) => `<a href="${BASE}${h}" class="${k === PAGE ? "active" : ""}">${t}</a>`).join("")}
        </nav>
        <button id="theme" class="icon-btn" aria-label="Toggle light/dark theme">◐</button>
        <button id="burger" class="icon-btn burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">☰</button>
      </div>
    </header>`;
  $("#site-footer").innerHTML = `
    <footer class="site-footer"><div class="container foot">
      <div><a class="brand" href="${BASE}index.html"><span class="logo">✈</span> Skyline<b>Aviation</b></a>
      <p class="muted">Figures are approximate and for illustration only.</p></div>
      <div class="foot-links">${NAV.map(([h, t]) => `<a href="${BASE}${h}">${t}</a>`).join("")}</div>
      <button class="btn btn-ghost" id="top" type="button">Back to top ↑</button>
    </div></footer>`;

  const burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.textContent = open ? "✕" : "☰";
  });
  menu.addEventListener("click", e => { if (e.target.tagName === "A") menu.classList.remove("open"); });
  $("#top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const root = document.documentElement;
  try { root.dataset.theme = localStorage.getItem("theme") || "dark"; } catch { root.dataset.theme = "dark"; }
  $("#theme").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  });
  window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", scrollY > 10), { passive: true });
}

/* ---------- Reveal on scroll + counters ---------- */
function initReveal() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));
}
function countUp(el) {
  const end = +el.dataset.count; let n = 0;
  const t = setInterval(() => { n++; el.textContent = n; if (n >= end) clearInterval(t); }, 80);
}

/* ---------- Modal ---------- */
let lastFocus = null;
function openModal(html) {
  closeModal();
  lastFocus = document.activeElement;
  const m = document.createElement("div");
  m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
  m.innerHTML = `<div class="modal-box"><button class="icon-btn modal-x" aria-label="Close">✕</button>${html}</div>`;
  m.addEventListener("click", e => { if (e.target === m || e.target.closest(".modal-x")) closeModal(); });
  document.body.append(m); document.body.classList.add("noscroll");
  requestAnimationFrame(() => m.classList.add("show"));
  $(".modal-x", m).focus();
}
function closeModal() {
  const m = $(".modal"); if (!m) return;
  m.remove(); document.body.classList.remove("noscroll");
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------- Aircraft rendering (shared by home + aircraft page) ---------- */
function aircraftCard(a) {
  return `<article class="card" tabindex="0" role="button" data-ac="${a.id}" aria-label="${a.name} details">
    <span class="tag">${a.cat}</span>
    <h3>${a.name}</h3><p class="muted">${a.maker} · First flight ${a.year}</p>
    <div class="mini"><span><b>${fmt(a.pax)}</b> seats</span><span><b>${fmt(a.range)}</b> km</span><span><b>${fmt(a.speed)}</b> km/h</span></div>
  </article>`;
}
function bar(label, val, max, unit) {
  return `<div class="bar"><span>${label}</span><div><i style="width:${Math.max(3, val / max * 100)}%"></i></div><b>${fmt(val)} ${unit}</b></div>`;
}
function aircraftModal(id) {
  const a = byId(AIRCRAFT, id);
  const max = k => Math.max(...AIRCRAFT.map(x => x[k]));
  const ops = AIRLINES.filter(l => l.fleet.includes(id));
  openModal(`<span class="tag">${a.cat}</span><h2>${a.name}</h2><p class="muted">${a.maker} · First flight ${a.year}</p><p>${a.desc}</p>
    ${bar("Capacity", a.pax, max("pax"), "seats")}${bar("Range", a.range, max("range"), "km")}${bar("Cruise speed", a.speed, max("speed"), "km/h")}
    <p class="muted small">Bars are relative to the largest value in this dataset. Figures are approximate.</p>
    ${ops.length ? `<h4>Airlines in this dataset using it</h4><div class="chips">${ops.map(o => `<a class="chip" href="${BASE}pages/airlines.html?q=${encodeURIComponent(o.name)}">${o.name}</a>`).join("")}</div>` : ""}`);
}
function bindCards(container) {
  const act = e => { const c = e.target.closest("[data-ac]"); if (c) aircraftModal(c.dataset.ac); };
  container.addEventListener("click", act);
  container.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(e); } });
}
const qParam = () => new URLSearchParams(location.search).get("q") || "";
function fillSelect(sel, first, values) {
  sel.innerHTML = `<option value="">${first}</option>` + values.map(v => `<option>${v}</option>`).join("");
}
const uniq = (arr, k) => [...new Set(arr.map(x => x[k]))].sort();

/* ---------- Pages ---------- */
function initHome() {
  const f = $("#featured");
  f.innerHTML = ["a350", "b787", "a380"].map(id => aircraftCard(byId(AIRCRAFT, id))).join("");
  bindCards(f);
  $("#hero-search").addEventListener("submit", e => {
    e.preventDefault();
    location.href = `${BASE}pages/aircraft.html?q=${encodeURIComponent($("#hero-q").value.trim())}`;
  });
  const opts = AIRPORTS.map(p => `<option value="${p.code}">${p.city} (${p.code})</option>`).join("");
  $("#from").innerHTML = opts; $("#to").innerHTML = opts; $("#to").selectedIndex = 1;
  $("#calc-ac").innerHTML = AIRCRAFT.map(a => `<option value="${a.id}">${a.name}</option>`).join("");
  $("#calc-ac").value = "b787";
  $("#calc-form").addEventListener("submit", e => { e.preventDefault(); calculate(); });
}
function haversine(a, b) {
  const r = d => d * Math.PI / 180, R = 6371;
  const x = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function calculate() {
  const out = $("#calc-out");
  const from = AIRPORTS.find(p => p.code === $("#from").value), to = AIRPORTS.find(p => p.code === $("#to").value);
  const ac = byId(AIRCRAFT, $("#calc-ac").value);
  if (from.code === to.code) { out.textContent = "Please choose two different airports."; return; }
  const km = haversine(from, to);
  const hrs = km / ac.speed + 0.5; // +0.5 h rough allowance for climb/descent
  const h = Math.floor(hrs), m = Math.round((hrs - h) * 60);
  out.innerHTML = `<b>${fmt(Math.round(km))} km</b> great-circle distance<br>Estimated time: <b>${h} h ${m} min</b> in a ${ac.name}<br>` +
    (km > ac.range ? `<span class="warn">⚠ Exceeds this aircraft's approximate range (${fmt(ac.range)} km): a non-stop flight is not possible.</span>`
                   : `<span class="ok">✓ Within this aircraft's approximate range.</span>`);
}

function initAircraft() {
  const els = { q: $("#q"), cat: $("#cat"), maker: $("#maker"), sort: $("#sort"), min: $("#minRange"), out: $("#rangeOut"), list: $("#list"), count: $("#count") };
  fillSelect(els.cat, "All categories", uniq(AIRCRAFT, "cat"));
  fillSelect(els.maker, "All manufacturers", uniq(AIRCRAFT, "maker"));
  els.q.value = qParam();
  const render = () => {
    const q = els.q.value.trim().toLowerCase();
    els.out.textContent = fmt(+els.min.value);
    const k = els.sort.value;
    const res = AIRCRAFT.filter(a =>
      (!q || (a.name + " " + a.maker).toLowerCase().includes(q)) &&
      (!els.cat.value || a.cat === els.cat.value) &&
      (!els.maker.value || a.maker === els.maker.value) &&
      a.range >= +els.min.value
    ).sort((a, b) => k === "name" ? a.name.localeCompare(b.name) : k === "year" ? a.year - b.year : b[k] - a[k]);
    els.count.textContent = `${res.length} aircraft found`;
    els.list.innerHTML = res.length ? res.map(aircraftCard).join("") : `<p class="empty">No aircraft match those filters.</p>`;
  };
  ["input", "change"].forEach(ev => $$(".toolbar input, .toolbar select").forEach(el => el.addEventListener(ev, render)));
  $("#reset").addEventListener("click", () => { els.q.value = ""; els.cat.value = ""; els.maker.value = ""; els.sort.value = "name"; els.min.value = 0; render(); });
  bindCards(els.list); render();
}

function initAirlines() {
  const els = { q: $("#q"), region: $("#region"), sort: $("#sort"), list: $("#list"), count: $("#count"), chips: $("#alliances") };
  let alliance = "";
  fillSelect(els.region, "All regions", uniq(AIRLINES, "region"));
  els.q.value = qParam();
  els.chips.innerHTML = ["", ...uniq(AIRLINES, "alliance")].map(a => `<button class="chip ${a ? "" : "on"}" data-a="${a}" type="button">${a || "All alliances"}</button>`).join("");
  const render = () => {
    const q = els.q.value.trim().toLowerCase(), k = els.sort.value;
    const res = AIRLINES.filter(l =>
      (!q || [l.name, l.country, l.hub, l.code].join(" ").toLowerCase().includes(q)) &&
      (!alliance || l.alliance === alliance) && (!els.region.value || l.region === els.region.value)
    ).sort((a, b) => k === "founded" ? a.founded - b.founded : (a[k] + "").localeCompare(b[k] + ""));
    els.count.textContent = `${res.length} airlines found`;
    els.list.innerHTML = res.length ? res.map(l => `<article class="card" tabindex="0" role="button" data-al="${l.id}" aria-label="${l.name} details">
      <span class="tag">${l.alliance}</span><h3>${l.name} <small>${l.code}</small></h3>
      <p class="muted">${l.country} · Hub ${l.hub}</p><p class="muted">Founded ${l.founded}</p></article>`).join("") : `<p class="empty">No airlines match those filters.</p>`;
  };
  const open = e => {
    const c = e.target.closest("[data-al]"); if (!c) return;
    const l = byId(AIRLINES, c.dataset.al);
    openModal(`<span class="tag">${l.alliance}</span><h2>${l.name} <small>${l.code}</small></h2>
      <p class="muted">${l.country} · ${l.region}</p><p>${l.desc}</p>
      <ul class="facts"><li><b>Main hub:</b> ${l.hub}</li><li><b>Founded:</b> ${l.founded}</li></ul>
      <h4>Fleet highlights (select to view)</h4>
      <div class="chips">${l.fleet.map(id => `<a class="chip" href="${BASE}pages/aircraft.html?q=${encodeURIComponent(byId(AIRCRAFT, id).name)}">${byId(AIRCRAFT, id).name}</a>`).join("")}</div>
      <p class="muted small">Fleet lists are simplified highlights, not complete or current fleets.</p>`);
  };
  els.list.addEventListener("click", open);
  els.list.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
  els.chips.addEventListener("click", e => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    alliance = b.dataset.a; $$(".chip", els.chips).forEach(c => c.classList.toggle("on", c === b)); render();
  });
  [els.q, els.region, els.sort].forEach(el => { el.addEventListener("input", render); el.addEventListener("change", render); });
  render();
}

function initAbout() {
  $("#contact").addEventListener("submit", e => {
    e.preventDefault();
    const s = $("#cstatus"), n = $("#cname").value.trim(), m = $("#cemail").value.trim(), t = $("#cmsg").value.trim();
    if (!n || !t || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { s.className = "form-status err"; s.textContent = "Please enter your name, a valid email and a message."; return; }
    s.className = "form-status ok";
    s.textContent = `Thanks, ${n}! This is a demo form: nothing was sent, since sending needs a backend.`;
    e.target.reset();
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderLayout(); initReveal();
  ({ home: initHome, aircraft: initAircraft, airlines: initAirlines, about: initAbout })[PAGE]?.();
});