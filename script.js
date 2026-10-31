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

  /* ── Qtic: QR + approval toggle ── */
  const qr = $("#qr");
  if (qr) {
    let seed = 7, out = "";
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const finder = (x, y) => {
      const fx = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (!fx) return null;
      const lx = x > 13 ? x - 14 : x, ly = y > 13 ? y - 14 : y;
      const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6;
      const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      return ring || core;
    };
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const f = finder(x, y);
      const on = f === null ? rnd() > 0.52 : f;
      if (on) out += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0a0f1f"/>`;
    }
    qr.innerHTML = out;
  }
  const qBtn = $("#qBtn"), qS = $("#qStatus");
  if (qBtn) qBtn.addEventListener("click", () => {
    const ok = qS.classList.toggle("ok");
    qS.classList.toggle("pending", !ok);
    qS.textContent = ok ? "APPROVED" : "PENDING";
    qBtn.textContent = ok ? "Undo" : "Approve";
  });

  /* ── Nutrition rings ── */
  const ringsEl = $("#rings");
  if (ringsEl) {
    const set = [["#r1", 389.6, 0.77], ["#r2", 301.6, 0.58], ["#r3", 213.6, 0.42]];
    new IntersectionObserver((ents, o) => {
      if (!ents[0].isIntersecting) return;
      set.forEach(([s, c, p], i) => {
        const el = $(s);
        el.style.transition = reduce ? "none" : `stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s`;
        el.style.strokeDashoffset = c * (1 - p);
      });
      o.disconnect();
    }, { threshold: 0.4 }).observe(ringsEl);
  }

  /* ── Pet tree demo ── */
  const tree = $("#tree");
  if (tree) {
    const H = {
      pip: { n: "Pip", x: 45, y: 40, p: [] }, mochi: { n: "Mochi", x: 125, y: 40, p: [] },
      nugget: { n: "Nugget", x: 205, y: 40, p: [] }, daisy: { n: "Daisy", x: 285, y: 40, p: [] },
      luna: { n: "Luna", x: 365, y: 40, p: [] }, ziggy: { n: "Ziggy", x: 440, y: 40, p: [] },
      biscuit: { n: "Biscuit", x: 70, y: 145, p: ["pip", "mochi"] }, cocoa: { n: "Cocoa", x: 135, y: 145, p: ["pip", "mochi"] },
      waffle: { n: "Waffle", x: 245, y: 145, p: ["nugget", "daisy"] }, olive: { n: "Olive", x: 402, y: 145, p: ["luna", "ziggy"] },
      peanut: { n: "Peanut", x: 120, y: 250, p: ["biscuit", "waffle"] }, maple: { n: "Maple", x: 230, y: 250, p: ["cocoa", "waffle"] },
    };
    const R = 21;
    let html = "";
    Object.entries(H).forEach(([id, h]) => h.p.forEach((pid) => {
      const q = H[pid], my = (q.y + h.y) / 2;
      html += `<path class="edge" data-e="${pid}>${id}" d="M${q.x} ${q.y + R} C${q.x} ${my} ${h.x} ${my} ${h.x} ${h.y - R}"/>`;
    }));
    Object.entries(H).forEach(([id, h]) => {
      html += `<g class="node" data-id="${id}"><circle cx="${h.x}" cy="${h.y}" r="${R}"/><text x="${h.x}" y="${h.y + 4}">${h.n}</text></g>`;
    });
    tree.innerHTML = html;

    const anc = (id, d = 3) => {
      const s = new Set();
      const walk = (x, k) => { if (k === 0) return; H[x].p.forEach((p) => { s.add(p); walk(p, k - 1); }); };
      walk(id, d);
      return s;
    };
    let sel = ["peanut", "maple"];
    const verdict = $("#verdict");
    const render = () => {
      $$(".node", tree).forEach((n) => { n.classList.toggle("sel", sel.includes(n.dataset.id)); n.classList.remove("anc"); });
      $$(".edge", tree).forEach((e) => e.classList.remove("hot"));
      if (sel.length < 2) {
        verdict.className = "verdict";
        verdict.innerHTML = "<b>Pick a second hamster</b>Tap any other node to check the pair.";
        return;
      }
      const [a, b] = sel;
      const A = anc(a), B = anc(b);
      const A2 = new Set([...A, a]), B2 = new Set([...B, b]);
      const shared = [...A2].filter((x) => B2.has(x));
      if (shared.length) {
        verdict.className = "verdict bad";
        verdict.innerHTML = `<b>✕ Not safe to breed</b>${H[a].n} and ${H[b].n} share ${shared.map((s) => H[s].n).join(", ")} within 3 generations.`;
        shared.forEach((s) => $(`.node[data-id="${s}"]`, tree).classList.add("anc"));
        const leads = (x) => shared.includes(x) || H[x].p.some(leads);
        $$(".edge", tree).forEach((e) => {
          const [p, c] = e.dataset.e.split(">");
          if ((A2.has(c) || B2.has(c)) && leads(p)) e.classList.add("hot");
        });
      } else {
        verdict.className = "verdict good";
        verdict.innerHTML = `<b>✓ Safe to breed</b>${H[a].n} and ${H[b].n} share no ancestors within 3 generations.`;
      }
    };
    tree.addEventListener("click", (e) => {
      const n = e.target.closest(".node");
      if (!n) return;
      const id = n.dataset.id;
      if (sel.includes(id)) sel = sel.filter((x) => x !== id);
      else sel = sel.length >= 2 ? [sel[1], id] : [...sel, id];
      render();
    });
    render();
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
