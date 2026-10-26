/* SUNSA — site logic. You shouldn't need to edit this file; settings live in js/config.js */
(function () {
  const C = window.SUNSA;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const qs = new URLSearchParams(location.search);
  const TECH = C.techniques || [];
  const allCats = () => [...C.studies.map(s => ({ ...s, kind: "study" })), ...TECH.map(s => ({ ...s, kind: "study", tech: true })), ...(C.nextUp ? [{ ...C.nextUp, kind: "collection" }] : []), ...C.collections.map(s => ({ ...s, kind: "collection" }))];
  const findCat = slug => allCats().find(c => c.slug === slug);
  const configured = v => v && !/^YOUR_/.test(v);

  /* ---------------- theme toggle ---------------- */
  try { const t = localStorage.getItem("sunsa-theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-theme-toggle]")) return;
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("sunsa-theme", next); } catch (e) {}
  });

  /* ---------------- links (links.csv) ---------------- */
  function parseCSV(text) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  let linksPromise;
  function getLinks() {
    if (linksPromise) return linksPromise;
    const fallback = () => C.fallbackLinks.map(([url, title, category]) => ({ url, title, category }));
    const url = `${C.linksFile || "links.csv"}?_=${Date.now()}`;
    linksPromise = fetch(url).then(r => { if (!r.ok) throw r.status; return r.text(); }).then(t => {
      const rows = parseCSV(t.replace(/^\uFEFF/, "")).filter(r => r.some(x => x.trim()));
      const head = rows.shift().map(norm);
      const col = (name, d) => { const i = head.indexOf(name); return i < 0 ? d : i; };
      const iL = col("link", 0), iT = col("title", 1), iC = col("category", 2), iI = col("image", 3), iW = col("workshop", 4);
      return rows.map(r => ({ url: (r[iL] || "").trim(), title: (r[iT] || "").trim(), category: (r[iC] || "").trim(), image: (r[iI] || "").trim(), workshop: (r[iW] || "").trim() }))
                 .filter(l => /^https?:\/\//i.test(l.url));
    }).catch(err => { console.warn("links.csv unavailable, using fallback links", err); return fallback(); });
    return linksPromise;
  }
  const linksFor = (links, ...names) => { const n = names.map(norm); return links.filter(l => n.includes(norm(l.category))); };
  function renderLinks(el, heading, list, cat) {
    const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
    el.innerHTML = `<h3>${esc(heading)}</h3>` + (list.length
      ? `<ul>${list.map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener"><span><span class="t">${esc(l.title || host(l.url))}</span><br><span class="host">${esc(host(l.url))}</span></span></a></li>`).join("")}</ul>`
      : `<p class="none">No links yet — add rows to links.csv with Category “${esc(cat || heading)}”.</p>`);
  }

  /* ---------------- photos (Cloudinary) ---------------- */
  const listCache = {};
  function getPhotos(tag) {
    if (!configured(C.cloudName)) return Promise.resolve(null);
    if (listCache[tag]) return listCache[tag];
    return (listCache[tag] = fetch(`https://res.cloudinary.com/${C.cloudName}/image/list/${encodeURIComponent(tag)}.json`)
      .then(r => r.ok ? r.json() : { resources: [] })
      .then(j => (j.resources || []).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))))
      .catch(() => []));
  }
  const pid = p => p.public_id.split("/").map(encodeURIComponent).join("/");
  const img = (p, t) => `https://res.cloudinary.com/${C.cloudName}/image/upload/${t}/v${p.version}/${pid(p)}.${p.format}`;
  const thumb = p => img(p, "c_fill,g_auto,w_640,h_640,f_auto,q_auto");
  const large = p => img(p, "c_limit,w_2400,h_2400,f_auto,q_auto");
  const original = p => `https://res.cloudinary.com/${C.cloudName}/image/upload/v${p.version}/${pid(p)}.${p.format}`;
  const caption = p => (p.context && p.context.custom && (p.context.custom.caption || p.context.custom.alt)) || "";

  /* ---------------- lightbox ---------------- */
  const icon = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  let LB;
  function lightbox(items, start) {           // items: [{src, full?, caption?}]
    if (!LB) {
      LB = document.createElement("div"); LB.className = "lb"; LB.setAttribute("role", "dialog"); LB.setAttribute("aria-modal", "true");
      LB.innerHTML = `<div class="spin"></div><img alt="">
        <button class="ctl x" aria-label="Close">${icon('<path d="M6 6l12 12M18 6L6 18"/>')}</button>
        <button class="ctl prev" aria-label="Previous">${icon('<path d="M15 5l-7 7 7 7"/>')}</button>
        <button class="ctl next" aria-label="Next">${icon('<path d="M9 5l7 7-7 7"/>')}</button>
        <div class="bar"><span class="cap"></span><span><span class="n"></span><a class="orig" target="_blank" rel="noopener" style="margin-left:16px">Original ↗</a></span></div>`;
      document.body.appendChild(LB);
      LB.addEventListener("click", e => { if (e.target === LB) LB.close(); });
      $(".x", LB).onclick = () => LB.close();
      $(".prev", LB).onclick = () => LB.go(-1);
      $(".next", LB).onclick = () => LB.go(1);
      document.addEventListener("keydown", e => {
        if (!LB.classList.contains("open")) return;
        if (e.key === "Escape") LB.close(); if (e.key === "ArrowLeft") LB.go(-1); if (e.key === "ArrowRight") LB.go(1);
      });
      let x0 = null;
      LB.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
      LB.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) LB.go(dx < 0 ? 1 : -1); x0 = null; });
      LB.close = () => { LB.classList.remove("open"); document.body.style.overflow = ""; };
      LB.go = d => LB.show((LB.i + d + LB.items.length) % LB.items.length);
      LB.show = i => {
        LB.i = i; const it = LB.items[i], im = $("img", LB);
        $(".spin", LB).style.display = ""; im.style.opacity = 0;
        im.onload = () => { $(".spin", LB).style.display = "none"; im.style.opacity = 1; };
        im.src = it.src; im.alt = it.caption || "";
        $(".cap", LB).textContent = it.caption || "";
        $(".n", LB).textContent = LB.items.length > 1 ? `${i + 1} / ${LB.items.length}` : "";
        const o = $(".orig", LB); o.style.display = it.full ? "" : "none"; if (it.full) o.href = it.full;
        const multi = LB.items.length > 1; $(".prev", LB).style.display = $(".next", LB).style.display = multi ? "" : "none";
        if (multi) { [1, -1].forEach(d => { const n = LB.items[(i + d + LB.items.length) % LB.items.length]; new Image().src = n.src; }); }
      };
    }
    LB.items = items; LB.classList.add("open"); document.body.style.overflow = "hidden"; LB.show(start); $(".x", LB).focus();
  }

  /* ---------------- shared bits ---------------- */
  function cardHTML(cat, href) {
    const sw = cat.pigment ? cat.pigment[0] : "#b9ab96";
    return `<a class="card" href="${href}" data-tag="${esc(cat.tag || cat.slug)}" style="--sw:${sw}">
      <div class="art"><div class="blob"></div></div>
      <div class="meta"><b>${esc(cat.title)}</b><small data-count></small></div></a>`;
  }
  function fillCovers(root) {
    root.querySelectorAll(".card[data-tag]").forEach(card => {
      getPhotos(card.dataset.tag).then(list => {
        const small = $("[data-count]", card);
        if (!list) { if (card.closest("[data-photocards]")) small.textContent = ""; return; }
        small.textContent = list.length ? `${list.length} photo${list.length > 1 ? "s" : ""}` : (card.closest("[data-photocards]") ? "empty" : "");
        if (list.length) {
          const im = new Image(); im.alt = ""; im.src = img(list[0], "c_fill,g_auto,w_640,h_480,f_auto,q_auto");
          im.onload = () => { const art = $(".art", card); art.innerHTML = ""; art.appendChild(im); };
        }
      });
    });
  }
  function md(path, el, emptyText) {
    return fetch(path).then(r => r.ok ? r.text() : "").catch(() => "").then(t => {
      const clean = t.replace(/<!--[\s\S]*?-->/g, "").trim();
      if (!clean) { el.classList.add("empty"); el.textContent = emptyText; return; }
      el.innerHTML = window.marked ? marked.parse(clean) : `<pre>${esc(clean)}</pre>`;
      el.querySelectorAll("a[href^='http']").forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
      const imgs = [...el.querySelectorAll("img")];
      imgs.forEach((im, i) => im.addEventListener("click", () => lightbox(imgs.map(x => ({ src: x.src, caption: x.alt })), i)));
    });
  }

  /* ---------------- art movement works ---------------- */
  function workHTML(w, artist) {
    const cap = `<figcaption><span class="t">${esc(w.title)}</span>${w.year ? `, ${esc(w.year)}` : ""}${w.src ? ` <a class="src" href="${esc(w.src)}" target="_blank" rel="noopener">source</a>` : ""}</figcaption>`;
    if (w.card || !w.img) return `<figure class="work"><a class="work-card" href="${esc(w.link || "#")}" target="_blank" rel="noopener"><span>Image not shown — still under copyright</span><b>View the work ↗</b></a>${cap}</figure>`;
    return `<figure class="work"><button class="work-img" aria-label="Enlarge ${esc(w.title)}"><img loading="lazy" src="${esc(w.img)}" alt="${esc(w.title)} — ${esc(artist)}${w.year ? `, ${esc(w.year)}` : ""}" data-cap="${esc(w.title)} — ${esc(artist)}${w.year ? `, ${esc(w.year)}` : ""}"></button>${cap}</figure>`;
  }
  function wireWorks(root) {
    const imgs = [...root.querySelectorAll(".work-img img")];
    const items = imgs.map(im => ({ src: im.getAttribute("src"), caption: im.dataset.cap }));
    imgs.forEach((im, i) => im.parentElement.addEventListener("click", () => lightbox(items, i)));
  }

  /* ---------------- pages ---------------- */
  const pages = {
    home() {
      md("content/summary.md", $("#summary"), "");
      getLinks().then(links => {
        const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
        // Study Guides: append Courses rows
        const courses = linksFor(links, "Courses", "Course", "Workshops", "Workshop");
        $("#curriculum-box ul").insertAdjacentHTML("beforeend", courses.map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener"><span><span class="t">${esc(l.title || host(l.url))}</span><br><span class="host">Course · ${esc(host(l.url))}</span></span></a></li>`).join(""));
        // Great Artist Techniques: its own box
        const gt = linksFor(links, "Great Artist Techniques"), gtBox = $("#great-techniques");
        gtBox.hidden = !gt.length;
        if (gt.length) renderLinks(gtBox, "Great Artist Techniques", gt);
        // Artists: one small card each, then photo-only folders flagged home:"artists"
        const sw = ["#c8562a", "#6f7fc0", "#4f6b35", "#a0522d", "#4a3470", "#c9a24a"];
        const cards = linksFor(links, "Artists", "Artist", "Great Artists", "Great Artist").map((l, i) => {
          const pic = l.image.split(";").map(x => x.trim()).filter(Boolean)[0];
          return `<div class="card artist-card" style="--sw:${sw[i % sw.length]}">
            <a class="art" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${esc(l.title)} website"><span class="blob"></span>${pic ? `<img loading="lazy" src="${esc(pic)}" alt="Painting by ${esc(l.title)}" onerror="this.remove()">` : ""}</a>
            <div class="meta"><a class="name" href="${esc(l.url)}" target="_blank" rel="noopener"><b>${esc(l.title)}</b></a>${l.workshop ? `<a class="ws" href="${esc(l.workshop)}" target="_blank" rel="noopener">Online workshops ↗</a>` : `<small>${esc(host(l.url))}</small>`}</div></div>`;
        });
        const extra = C.collections.filter(c => c.home === "artists").map(c => cardHTML(c, `gallery.html?c=${c.slug}`));
        const box = $("#artist-cards");
        box.innerHTML = cards.join("") + extra.join("");
        fillCovers(box);
      });
      $("#studies").innerHTML = C.studies.map(s => cardHTML(s, `topic.html?t=${s.slug}`)).join("");
      const nu = C.nextUp, box = $("#next-up");
      if (nu && box) {
        box.hidden = false;
        box.innerHTML = `<h3>${esc(nu.title)}</h3><a class="next-up" href="gallery.html?c=${nu.slug}"><span class="thumb"></span><span><span class="t">Paintings to do</span><br><span class="host" data-n>View photos</span></span></a>`;
        getPhotos(nu.tag).then(list => {
          if (!list || !list.length) { $("[data-n]", box).textContent = "No photos yet"; return; }
          $("[data-n]", box).textContent = `${list.length} photo${list.length > 1 ? "s" : ""}`;
          const im = new Image(); im.alt = ""; im.src = img(list[0], "c_fill,g_auto,w_160,h_160,f_auto,q_auto");
          im.onload = () => $(".thumb", box).appendChild(im);
        });
      }
      $("#techniques").innerHTML = TECH.map(s => cardHTML(s, `topic.html?t=${s.slug}`)).join("");
      $("#techniques-section").hidden = !TECH.length;
      $("#folders").innerHTML = C.collections.filter(c => !c.home).sort((a, b) => a.title.localeCompare(b.title)).map(s => cardHTML(s, `gallery.html?c=${s.slug}`)).join("");
      fillCovers(document);
    },

    topic() {
      const isTech = TECH.some(x => x.slug === qs.get("t"));
      const group = isTech ? TECH : C.studies;
      const s = group.find(x => x.slug === qs.get("t")) || C.studies[0];
      if (isTech) {
        $("#eyebrow").textContent = "Technique";
        $("#crumb-group").textContent = "Technical"; $("#crumb-group").href = "index.html#techniques-section";
        document.querySelectorAll(".nav a[aria-current]").forEach(a => a.removeAttribute("aria-current"));
        $(".nav a[href$='#techniques-section']").setAttribute("aria-current", "page");
      }
      document.title = `${s.title} · Sunsa`;
      $("#title").textContent = s.title;
      $("#crumb").textContent = s.title;
      $("#swatch").innerHTML = `<i style="--sw:${s.pigment[0]}"></i>${esc(s.pigment[1])}`;
      $("#photos-btn").href = `gallery.html?c=${s.slug}`;
      md(`content/${s.slug}.md`, $("#notes"), "Notes coming soon.");
      getLinks().then(links => renderLinks($("#links"), "Further reading", linksFor(links, s.title, s.slug, s.tag), s.title));
      getPhotos(s.tag || s.slug).then(list => { if (list && list.length) $("#photos-label").textContent = `View ${list.length} photos`; });
      // neighbours
      const i = group.indexOf(s), prev = group[(i - 1 + group.length) % group.length], next = group[(i + 1) % group.length];
      if (group.length === 2) $("#study-nav").innerHTML = `<span></span><a href="topic.html?t=${next.slug}">${esc(next.title)} →</a>`;
      else if (group.length > 2) $("#study-nav").innerHTML = `<a href="topic.html?t=${prev.slug}">← ${esc(prev.title)}</a><a href="topic.html?t=${next.slug}">${esc(next.title)} →</a>`;
    },

    curriculum() {
      const phases = C.curriculum || [], name = C.curriculumTitle || "Fundamental Painting Curriculum";
      const n = parseInt(qs.get("p"));
      const ph = phases.find(x => x.n === n);
      if (!ph) {                                   // table of contents
        document.title = `${name} · Sunsa`;
        $("#title").textContent = name;
        $("#crumb").textContent = "Curriculum";
        $("#eyebrow").textContent = "Curriculum";
        $("#sub").textContent = `${phases.length} phases · materials to finishing`;
        md("content/curriculum.md", $("#notes"), "Curriculum coming soon.");
        $("#links").innerHTML = `<h3>Phases</h3><ul>${phases.map(x => `<li><a class="curric" href="curriculum.html?p=${x.n}"><span><span class="host">Phase ${x.n}</span><br><span class="t">${esc(x.title)}</span></span></a></li>`).join("")}</ul>`;
        return;
      }
      document.title = `Phase ${ph.n}: ${ph.title} · Sunsa`;
      $("#eyebrow").textContent = `Phase ${ph.n} of ${phases.length}`;
      $("#title").textContent = ph.title;
      $("#crumb").innerHTML = `<a href="curriculum.html">Curriculum</a> / Phase ${ph.n}`;
      $("#sub").innerHTML = `<a href="curriculum.html">← ${esc(name)}</a>`;
      md(`content/curriculum-phase-${ph.n}.md`, $("#notes"), "Lessons for this phase coming soon.");
      getLinks().then(links => renderLinks($("#links"), "Further reading", linksFor(links, `Phase ${ph.n}`), `Phase ${ph.n}`));
      const i = phases.indexOf(ph), prev = phases[i - 1], next = phases[i + 1];
      $("#study-nav").innerHTML = (prev ? `<a href="curriculum.html?p=${prev.n}">← Phase ${prev.n}</a>` : `<a href="curriculum.html">← Contents</a>`)
                                + (next ? `<a href="curriculum.html?p=${next.n}">Phase ${next.n} →</a>` : `<a href="curriculum.html">Contents →</a>`);
    },

    movements() {
      const M = window.MOVEMENTS || [];
      $("#title").textContent = "Western Art Movements";
      $("#crumb").textContent = "Art Movements";
      $("#eyebrow").textContent = "Art history";
      $("#sub").textContent = `${M.length} movements · Early Renaissance to today`;
      $("#jump").innerHTML = M.filter(m => m.full).map(m => `<a href="movement.html?m=${m.slug}">${esc(m.name)}</a>`).join("");
      $("#mv-list").innerHTML = M.map(m => `<section class="mv" id="${m.slug}">
        <div class="mv-head"><h2>${esc(m.name)}</h2><span class="dates">${esc(m.dates)}</span></div>
        <p class="mv-desc">${esc(m.desc)}</p>
        ${m.full ? `<a class="btn mv-more" href="movement.html?m=${m.slug}">Full page — more artists &amp; works<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>` : ""}
        <div class="mv-grid">${m.artists.map(a => { const shown = a.works.filter(w => w.img && !w.card); return `<div class="mv-artist"><h3>${esc(a.name)}</h3>${(shown.length ? shown : [a.works[0]]).map(w => workHTML(w, a.name)).join("")}</div>`; }).join("")}</div>
      </section>`).join("");
      wireWorks(document);
    },

    movement() {
      const M = window.MOVEMENTS || [], full = M.filter(m => m.full);
      const m = full.find(x => x.slug === qs.get("m")) || full[0];
      document.title = `${m.name} · Sunsa`;
      $("#eyebrow").textContent = "Art movement";
      $("#title").textContent = m.name;
      $("#crumb").innerHTML = `<a href="movements.html">Art Movements</a> / ${esc(m.name)}`;
      $("#sub").innerHTML = `${esc(m.dates)} · <a href="movements.html#${m.slug}">All movements</a>`;
      $("#notes").innerHTML = `<p>${esc(m.desc)}</p>` + (m.study && m.study.length ? `<h3>What to study as a painter</h3><ul>${m.study.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "");
      getLinks().then(links => renderLinks($("#links"), "Further reading", linksFor(links, m.name, m.slug), m.name));
      const i = full.indexOf(m), prev = full[(i - 1 + full.length) % full.length], next = full[(i + 1) % full.length];
      $("#study-nav").innerHTML = `<a href="movement.html?m=${prev.slug}">← ${esc(prev.name)}</a><a href="movement.html?m=${next.slug}">${esc(next.name)} →</a>`;
      $("#mv-artists").innerHTML = m.artists.map(a => `<section class="mv-artist-full"><h2>${esc(a.name)}</h2><div class="mv-row">${a.works.map(w => workHTML(w, a.name)).join("")}</div></section>`).join("");
      wireWorks(document);
    },

    photos() {
      $("#studies").innerHTML = C.studies.map(s => cardHTML(s, `gallery.html?c=${s.slug}`)).join("");
      $("#collections").innerHTML = C.collections.map(s => cardHTML(s, `gallery.html?c=${s.slug}`)).join("");
      fillCovers(document);
    },

    gallery() {
      const cat = findCat(qs.get("c")) || allCats()[0];
      const per = C.photosPerPage || 50;
      document.title = `${cat.title} — Photos · Sunsa`;
      $("#title").textContent = cat.title;
      $("#crumb").textContent = cat.title;
      if (cat.kind === "study") { const b = $("#notes-btn"); b.hidden = false; b.href = `topic.html?t=${cat.slug}`; }
      const grid = $("#grid"), pager = $("#pager"), count = $("#count");
      if (!configured(C.cloudName)) {
        grid.outerHTML = `<div class="notice">Photos aren't connected yet — add your Cloudinary <b>cloudName</b> in <b>js/config.js</b>.</div>`; return;
      }
      grid.innerHTML = Array.from({ length: 9 }, () => `<button class="skeleton" tabindex="-1"></button>`).join("");
      getPhotos(cat.tag || cat.slug).then(list => {
        if (!list.length) {
          grid.outerHTML = `<div class="notice">No photos yet. In Cloudinary, add the tag <b>${esc(cat.tag || cat.slug)}</b> to photos for this collection.<br><small>New tags show up here within about a minute.</small></div>`;
          return;
        }
        const pages = Math.ceil(list.length / per);
        const p = Math.min(Math.max(parseInt(qs.get("p")) || 1, 1), pages);
        const slice = list.slice((p - 1) * per, p * per);
        count.textContent = `${list.length} photo${list.length > 1 ? "s" : ""}${pages > 1 ? ` · page ${p} of ${pages}` : ""}`;
        grid.innerHTML = slice.map((ph, i) => `<button data-i="${(p - 1) * per + i}" aria-label="Open photo ${(p - 1) * per + i + 1}"><img loading="lazy" alt="${esc(caption(ph))}" src="${thumb(ph)}" onload="this.classList.add('in')"></button>`).join("");
        const items = list.map(ph => ({ src: large(ph), full: original(ph), caption: caption(ph) }));
        grid.addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b) lightbox(items, +b.dataset.i); });
        if (pages > 1) {
          const link = n => `gallery.html?c=${cat.slug}&p=${n}`;
          let h = p > 1 ? `<a href="${link(p - 1)}" aria-label="Previous page">←</a>` : "";
          for (let n = 1; n <= pages; n++) h += n === p ? `<span aria-current="page">${n}</span>` : `<a href="${link(n)}">${n}</a>`;
          h += p < pages ? `<a href="${link(p + 1)}" aria-label="Next page">→</a>` : "";
          pager.innerHTML = h;
        }
      });
    }
  };

  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
})();
