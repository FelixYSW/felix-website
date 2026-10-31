(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Year ── */
  $("#year").textContent = new Date().getFullYear();

  /* ── AR artwork into every [data-ar] ── */
  const tpl = $("#ar-tpl");
  $$("[data-ar]").forEach((el, i) => {
    const node = tpl.content.cloneNode(true);
    if (i > 0) {
      // keep SVG ids unique per copy so gradients/filters resolve correctly
      node.querySelectorAll("[id]").forEach((n) => {
        const old = n.id, neu = `${old}-${i}`;
        n.id = neu;
        node.querySelectorAll(`[fill="url(#${old})"],[stroke="url(#${old})"],[filter="url(#${old})"]`).forEach((u) => {
          ["fill", "stroke", "filter"].forEach((a) => { if (u.getAttribute(a) === `url(#${old})`) u.setAttribute(a, `url(#${neu})`); });
        });
      });
    }
    el.replaceWith(node);
  });

  /* ── Nav ── */
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 12), { passive: true });
  burger.addEventListener("click", () => links.classList.toggle("open"));
  $$("a", links).forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
  const secs = $$("main section[id]");
  const spy = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) $$("a", links).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => spy.observe(s));

  /* ── Reveal on scroll ── */
  const rev = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => rev.observe(el));

  /* ── Typed role line ── */
  const phrases = ["Software Engineer · AI · Mobile", "React, Firebase & Swift", "Computer vision & AR", "Shipping with CI/CD"];
  const typed = $("#typed");
  if (reduce) typed.textContent = phrases[0];
  else {
    let p = 0, c = 0, del = false;
    const tick = () => {
      const w = phrases[p];
      typed.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 30 : 65);
    };
    tick();
  }

  /* ── Marquee ── */
  const stack = ["React", "TypeScript", "Swift", "SwiftUI", "Firebase", "Cloud Functions", "ARKit", "Core ML", "YOLO", "XGBoost", "OpenAI API", "Tailwind", "GitHub Actions", "Docker", "Python", "SQL"];
  const mq = $("#marquee");
  mq.innerHTML = [...stack, ...stack].map((s) => `<span>${s}</span>`).join("");

  /* ── Count up ── */
  const co = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
      if (reduce) { el.textContent = to.toFixed(dec); return co.unobserve(el); }
      const t0 = performance.now(), dur = 1300;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => co.observe(el));

  /* ── Spotlight + phone tilt ── */
  const spot = $("#spotlight");
  addEventListener("pointermove", (e) => {
    spot.style.left = e.clientX + "px";
    spot.style.top = e.clientY + "px";
  }, { passive: true });
  if (!reduce) {
    const hp = $("#heroPhone");
    const hero = $(".hero-visual");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      hp.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`;
    });
    hero.addEventListener("pointerleave", () => { hp.style.transform = ""; });
    $$(".tilt").forEach((ph) => {
      const box = ph.closest(".p-visual");
      box.addEventListener("pointermove", (e) => {
        const r = box.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        ph.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`;
      });
      box.addEventListener("pointerleave", () => { ph.style.transform = ""; });
    });
  }

  /* ── Shared: pseudo QR ── */
  const drawQR = (svg, seed = 7) => {
    if (!svg) return;
    let out = "";
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const finder = (x, y) => {
      const fx = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (!fx) return null;
      const lx = x > 13 ? x - 14 : x, ly = y > 13 ? y - 14 : y;
      return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
    };
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const f = finder(x, y);
      if (f === null ? rnd() > 0.52 : f) out += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0a0f1f"/>`;
    }
    svg.innerHTML = out;
  };
  drawQR($("#qr2"), 11);

  /* ── Explorer tabs (auto-cycle until the visitor clicks) ── */
  const hooks = {}; // screen activation hooks, keyed by explorer id
  $$("[data-explorer]").forEach((ex) => {
    const tabs = $$(".ex-tab", ex);
    const screens = $$(".scr", ex);
    const id = ex.closest("article")?.id;
    let cur = 0, timer = null, manual = false, visible = false;
    const go = (i) => {
      cur = i;
      tabs.forEach((t, k) => t.classList.toggle("active", k === i));
      screens.forEach((s, k) => s.classList.toggle("active", k === i));
      if (id === "p-qtic") { const u = $("#qUrl"); if (u) u.textContent = ["qtic.app/events", "qtic.app/organizer/new", "qtic.app/admin", "qtic.app/scan"][i]; }
      if (hooks[id]) hooks[id](i);
    };
    const start = () => {
      if (reduce || manual || timer || !visible) return;
      timer = setInterval(() => go((cur + 1) % tabs.length), 6500);
    };
    const stop = () => { clearInterval(timer); timer = null; };
    tabs.forEach((t, i) => t.addEventListener("click", () => { manual = true; ex.classList.add("manual"); stop(); go(i); }));
    ex.addEventListener("pointerdown", (e) => { if (e.target.closest(".scr") && !manual) { manual = true; ex.classList.add("manual"); stop(); } });
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) { start(); if (hooks[id]) hooks[id](cur); } else stop(); }, { threshold: 0.35 }).observe(ex);
    go(0);
  });

  /* ── Accessible Navigation: profile rules ── */
  const PROF = {
    none: [["Steps", "Allowed", "ok"], ["Kerbs", "Allowed", "ok"], ["Steep slopes", "Not limited", "off"], ["Narrow paths", "Not limited", "off"], ["Rough surfaces", "Not limited", "off"]],
    wheelchair: [["Steps", "Blocked", "block"], ["Kerbs", "Blocked", "block"], ["Steep slopes", "Limited", "warn"], ["Narrow paths", "Avoided", "warn"], ["Rough surfaces", "Avoided", "warn"]],
    walker: [["Steps", "Blocked", "block"], ["Kerbs", "Avoided", "warn"], ["Steep slopes", "Limited", "warn"], ["Narrow paths", "Avoided", "warn"], ["Rough surfaces", "Avoided", "warn"]],
    cane: [["Steps", "OK with handrail", "warn"], ["Kerbs", "Caution", "warn"], ["Steep slopes", "Limited", "warn"], ["Narrow paths", "Not limited", "off"], ["Rough surfaces", "Caution", "warn"]],
  };
  const rules = $("#rules"), grid = $("#profGrid");
  const showProf = (p) => {
    $$("button", grid).forEach((b) => b.classList.toggle("on", b.dataset.p === p));
    rules.innerHTML = PROF[p].map(([a, b, c], i) => `<div class="rule" style="animation-delay:${i * 0.05}s"><span>${a}</span><em class="${c}">${b}</em></div>`).join("");
  };
  if (grid) { grid.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showProf(b.dataset.p); }); showProf("wheelchair"); }

  /* ── Qtic admin approvals ── */
  $$("[data-queue]").forEach((q) => q.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const row = b.closest(".q-item"), st = $(".st", row);
    const ok = !st.classList.contains("ok");
    st.classList.toggle("ok", ok); st.classList.toggle("pending", !ok);
    st.textContent = ok ? (q.textContent.includes("Events") ? "LIVE" : "APPROVED") : "PENDING";
    b.textContent = ok ? "Undo" : "Approve"; b.classList.toggle("done", ok);
  }));

  /* ── Nutrition: rings, chat, trend chart ── */
  let ringsDone = false;
  const fillRings = () => {
    if (ringsDone) return; ringsDone = true;
    [["#r1", 389.6, 0.77], ["#r2", 301.6, 0.58], ["#r3", 213.6, 0.42]].forEach(([s, c, p], i) => {
      const el = $(s); if (!el) return;
      el.style.transition = reduce ? "none" : `stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s`;
      el.style.strokeDashoffset = c * (1 - p);
    });
  };
  const chat = $("#chat");
  let chatRun = 0;
  const say = (cls, html) => { const d = document.createElement("div"); d.className = "m " + cls; d.innerHTML = html; chat.appendChild(d); return d; };
  const playChat = async () => {
    if (!chat) return;
    const run = ++chatRun; chat.innerHTML = "";
    const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    const alive = () => run === chatRun;
    await wait(400); if (!alive()) return;
    say("me", "I have about 420 kcal left. What should I eat for dinner?");
    await wait(800); if (!alive()) return;
    const tool = say("tool", "🔎 web_search · nearby dinner options"); 
    await wait(1100); if (!alive()) return;
    const typing = say("ai", '<span class="typing"><i></i><i></i><i></i></span>');
    await wait(900); if (!alive()) return;
    typing.innerHTML = "Grilled chicken rice is about <b>450 kcal</b> with ~30 g protein. It fits your range.";
    await wait(900); if (!alive()) return;
    const d = say("draftc", 'Proposed log<b>Grilled chicken rice · 450 kcal</b><small>Waiting for your confirmation</small><div class="acts"><button>Confirm</button><button class="n">Edit</button></div>');
    d.querySelector("button").addEventListener("click", () => {
      d.querySelector(".acts").remove(); d.querySelector("small").textContent = "Saved to today";
      say("done", "✓ Logged on your phone");
    });
    d.querySelector(".n").addEventListener("click", () => { d.querySelector("small").textContent = "Opens the draft so you can change it"; });
  };
  const bars = $("#bars");
  if (bars) {
    const vals = [1650, 1820, 1540, 1980, 1380, 1710, 1760], xs = [18, 51, 84, 117, 150, 183, 211];
    const y = (v) => 150 - ((v - 1000) / 1200) * 118;
    bars.parentNode.querySelector("rect").setAttribute("y", y(1900)); bars.parentNode.querySelector("rect").setAttribute("height", y(1500) - y(1900));
    bars.innerHTML = vals.map((v, i) => `<rect x="${xs[i]}" y="${y(v)}" width="16" height="${150 - y(v)}" rx="4"/>`).join("");
  }
  hooks["p-nutrition"] = (i) => { if (i === 0) fillRings(); if (i === 2) playChat(); };
  hooks["p-nav"] = () => {};

  /* ── Pet: family tree, ancestor trace and breeding check ── */
  const H = {
    pip: { n: "Pip", s: "M", x: 45, y: 40, p: [] }, mochi: { n: "Mochi", s: "F", x: 125, y: 40, p: [] },
    nugget: { n: "Nugget", s: "M", x: 205, y: 40, p: [] }, daisy: { n: "Daisy", s: "F", x: 285, y: 40, p: [] },
    luna: { n: "Luna", s: "F", x: 365, y: 40, p: [] }, ziggy: { n: "Ziggy", s: "M", x: 440, y: 40, p: [] },
    biscuit: { n: "Biscuit", s: "M", x: 70, y: 145, p: ["pip", "mochi"] }, cocoa: { n: "Cocoa", s: "F", x: 135, y: 145, p: ["pip", "mochi"] },
    waffle: { n: "Waffle", s: "F", x: 245, y: 145, p: ["nugget", "daisy"] }, olive: { n: "Olive", s: "F", x: 402, y: 145, p: ["luna", "ziggy"] },
    peanut: { n: "Peanut", s: "M", x: 120, y: 250, p: ["biscuit", "waffle"] }, maple: { n: "Maple", s: "F", x: 230, y: 250, p: ["cocoa", "waffle"] },
  };
  const R = 21;
  const buildTree = (svg) => {
    let html = "";
    Object.entries(H).forEach(([id, h]) => h.p.forEach((pid) => {
      const q = H[pid], my = (q.y + h.y) / 2;
      html += `<path class="edge" data-e="${pid}>${id}" d="M${q.x} ${q.y + R} C${q.x} ${my} ${h.x} ${my} ${h.x} ${h.y - R}"/>`;
    }));
    Object.entries(H).forEach(([id, h]) => { html += `<g class="node" data-id="${id}"><circle cx="${h.x}" cy="${h.y}" r="${R}"/><text x="${h.x}" y="${h.y + 4}">${h.n}</text></g>`; });
    svg.innerHTML = html;
  };
  const anc = (id, d = 3) => { const s = new Set(); const w = (x, k) => { if (k) H[x].p.forEach((p) => { s.add(p); w(p, k - 1); }); }; w(id, d); return s; };
  const reset = (svg) => { $$(".node", svg).forEach((n) => n.classList.remove("sel", "anc")); $$(".edge", svg).forEach((e) => e.classList.remove("hot")); };

  const t1 = $("#tree1");
  if (t1) {
    buildTree(t1);
    const info = $("#treeInfo1");
    const show = (id) => {
      reset(t1);
      const A = anc(id);
      $(`.node[data-id="${id}"]`, t1).classList.add("sel");
      A.forEach((a) => $(`.node[data-id="${a}"]`, t1).classList.add("anc"));
      $$(".edge", t1).forEach((e) => { const c = e.dataset.e.split(">")[1]; if (c === id || A.has(c)) e.classList.add("hot"); });
      const h = H[id];
      info.innerHTML = h.p.length ? `<b>${h.n}</b> · parents ${H[h.p[0]].n} × ${H[h.p[1]].n}<br><small style="color:var(--muted)">${A.size} ancestors within 3 generations</small>` : `<b>${h.n}</b> · founder<br><small style="color:var(--muted)">No recorded parents</small>`;
    };
    t1.addEventListener("click", (e) => { const n = e.target.closest(".node"); if (n) show(n.dataset.id); });
    show("peanut");
  }

  const t2 = $("#tree2"), sA = $("#selA"), sB = $("#selB"), verdict = $("#verdict");
  if (t2) {
    buildTree(t2);
    const opt = (sx, def) => Object.entries(H).filter(([, h]) => h.s === sx).map(([id, h]) => `<option value="${id}"${id === def ? " selected" : ""}>${h.n}</option>`).join("");
    sA.innerHTML = opt("M", "peanut"); sB.innerHTML = opt("F", "maple");
    const check = () => {
      reset(t2);
      const a = sA.value, b = sB.value;
      const A2 = new Set([...anc(a), a]), B2 = new Set([...anc(b), b]);
      const shared = [...A2].filter((x) => B2.has(x));
      $(`.node[data-id="${a}"]`, t2).classList.add("sel"); $(`.node[data-id="${b}"]`, t2).classList.add("sel");
      if (shared.length) {
        verdict.className = "verdict bad";
        verdict.innerHTML = `<b>✕ Not safe to breed</b>${H[a].n} and ${H[b].n} share ${shared.map((s) => H[s].n).join(", ")} within 3 generations.`;
        shared.forEach((s) => { const n = $(`.node[data-id="${s}"]`, t2); if (!n.classList.contains("sel")) n.classList.add("anc"); });
        const leads = (x) => shared.includes(x) || H[x].p.some(leads);
        $$(".edge", t2).forEach((e) => { const [p, c] = e.dataset.e.split(">"); if ((A2.has(c) || B2.has(c)) && leads(p)) e.classList.add("hot"); });
      } else {
        verdict.className = "verdict good";
        verdict.innerHTML = `<b>✓ Safe to breed</b>${H[a].n} and ${H[b].n} share no ancestors within 3 generations.`;
      }
    };
    sA.addEventListener("change", check); sB.addEventListener("change", check);
    t2.addEventListener("click", (e) => { const n = e.target.closest(".node"); if (!n) return; const h = H[n.dataset.id]; (h.s === "M" ? sA : sB).value = n.dataset.id; check(); });
    check();
  }

  /* ── PV heatmap canvas ── */
  const cv = $("#pv");
  if (cv) {
    const ctx = cv.getContext("2d");
    const W = cv.width, Hh = cv.height, cols = 40, rows = 27;
    const cw = W / cols, ch = Hh / rows;
    const blobs = [[0.28, 0.35, 0.22, 1], [0.7, 0.3, 0.18, 0.85], [0.5, 0.72, 0.26, 0.7], [0.15, 0.8, 0.15, 0.55], [0.86, 0.75, 0.16, 0.6]];
    const ramp = [[27, 42, 107], [40, 215, 240], [62, 230, 176], [255, 200, 87], [255, 111, 177]];
    const color = (v) => {
      v = Math.max(0, Math.min(0.999, v)) * (ramp.length - 1);
      const i = Math.floor(v), f = v - i, a = ramp[i], b = ramp[i + 1];
      return `rgb(${a[0] + (b[0] - a[0]) * f | 0},${a[1] + (b[1] - a[1]) * f | 0},${a[2] + (b[2] - a[2]) * f | 0})`;
    };
    const lines = [[[0.28, 0.35], [0.5, 0.5], [0.7, 0.3]], [[0.5, 0.5], [0.5, 0.72], [0.86, 0.75]], [[0.5, 0.72], [0.15, 0.8]]];
    let t = 0, running = false;
    const draw = () => {
      ctx.fillStyle = "#08101f"; ctx.fillRect(0, 0, W, Hh);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const nx = x / cols, ny = y / rows;
        let v = 0.08;
        blobs.forEach(([bx, by, r, s], i) => {
          const ox = Math.sin(t * 0.6 + i) * 0.03, oy = Math.cos(t * 0.5 + i * 2) * 0.03;
          const d = Math.hypot((nx - bx - ox) * 1.5, ny - by - oy);
          v += s * Math.exp(-(d * d) / (2 * r * r * 0.5)) * (0.85 + 0.15 * Math.sin(t + i));
        });
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = color(v);
        ctx.fillRect(x * cw + 1, y * ch + 1, cw - 2, ch - 2);
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineJoin = "round";
      lines.forEach((ln) => { ctx.beginPath(); ln.forEach(([px, py], i) => i ? ctx.lineTo(px * W, py * Hh) : ctx.moveTo(px * W, py * Hh)); ctx.stroke(); });
      lines.forEach((ln, li) => {
        const k = (t * 0.25 + li * 0.33) % 1, seg = Math.min(ln.length - 2, Math.floor(k * (ln.length - 1)));
        const f = k * (ln.length - 1) - seg, a = ln[seg], b = ln[seg + 1];
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc((a[0] + (b[0] - a[0]) * f) * W, (a[1] + (b[1] - a[1]) * f) * Hh, 7, 0, 7); ctx.fill();
      });
      blobs.forEach(([bx, by]) => { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx * W, by * Hh, 9, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(6,9,19,.9)"; ctx.lineWidth = 3; ctx.stroke(); });
    };
    const loop = () => { if (!running) return; t += 0.02; draw(); requestAnimationFrame(loop); };
    draw();
    if (!reduce) new IntersectionObserver((e) => {
      running = e[0].isIntersecting;
      if (running) requestAnimationFrame(loop);
    }, { threshold: 0.1 }).observe(cv);
  }

  /* ── Resume iframe scaling ── */
  const rs = $("#resumeScale"), rf = $("#resumeFrame");
  if (rs && rf) {
    const fit = () => { rf.style.transform = `scale(${rs.clientWidth / 794})`; };
    fit(); addEventListener("resize", fit);
  }
})();
