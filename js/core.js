const SETTINGS = {
  autoInterval: 60,
  cardWidth: 200,
  cardHeight: 300,
  gap: 40,
  numberSize: 50,
  ease: "sine.inOut",
  startDelay: 0.6
};

window.ARTICLES = window.ARTICLES || {};
const data = window.CARDS || [];
const _ = (id) => document.getElementById(id);

let order = data.map((_, i) => i);
let detailsEven = true;
let offsetTop = 200, offsetLeft = 700;
let clicks = 0;
let isArticleOpen = false;
let loopRunning = false;
let loopTimer = null;
let galleryItems = [];
let galleryIndex = 0;

const { cardWidth, cardHeight, gap, numberSize, ease, startDelay, autoInterval } = SETTINGS;

if (_("demo") && data.length) {
  _("demo").innerHTML =
    data.map((i, index) =>
      `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`
    ).join("") +
    data.map((i, index) => `
      <div class="card-content" id="card-content-${index}">
        <div class="content-start"></div>
        <div class="content-place">${i.place}</div>
        <div class="content-title-1">${i.title}</div>
        <div class="content-title-2">${i.title2}</div>
      </div>`).join("");
}
if (_("slide-numbers") && data.length) {
  _("slide-numbers").innerHTML = data
    .map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`)
    .join("");
}

function openLightbox(items, startIndex) {
  galleryItems = items || [];
  galleryIndex = startIndex || 0;
  const lb = _("lightbox");
  if (!lb || !galleryItems.length) return;
  lb.classList.remove("hidden");
  requestAnimationFrame(() => lb.classList.add("show"));
  showLightboxImage();
}
function closeLightbox() {
  const lb = _("lightbox");
  if (!lb) return;
  lb.classList.remove("show");
  setTimeout(() => lb.classList.add("hidden"), 300);
}
function showLightboxImage() {
  const item = galleryItems[galleryIndex];
  if (!item) return;
  const img = _("lightbox-img");
  const cap = _("lightbox-caption");
  if (!img) return;
  img.style.animation = "none";
  void img.offsetWidth;
  img.style.animation = "lbIn 0.35s ease";
  img.src = item.url;
  if (cap) cap.textContent = item.caption || "";
}
function lightboxPrev() {
  if (!galleryItems.length) return;
  galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
  showLightboxImage();
}
function lightboxNext() {
  if (!galleryItems.length) return;
  galleryIndex = (galleryIndex + 1) % galleryItems.length;
  showLightboxImage();
}
function bindMediaClicks(mediaArray) {
  const list = mediaArray || [];
  const bind = (c) => {
    if (!c) return;
    c.querySelectorAll("img").forEach((img, i) => {
      img.style.cursor = "pointer";
      img.onclick = () => openLightbox(list, i);
    });
  };
  bind(_("media-grid"));
  bind(document.querySelector("#mobile-right-content .media-grid"));
}
function initLightboxControls() {
  const lb = _("lightbox");
  if (_("lightbox-close")) _("lightbox-close").onclick = closeLightbox;
  if (_("lightbox-prev")) _("lightbox-prev").onclick = lightboxPrev;
  if (_("lightbox-next")) _("lightbox-next").onclick = lightboxNext;
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!_("lightbox") || _("lightbox").classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev();
    if (e.key === "ArrowRight") lightboxNext();
  });
}

function getCard(i) { return `#card${i}`; }
function getCardContent(i) { return `#card-content-${i}`; }
function getSliderItem(i) { return `#slide-item-${i}`; }
function animate(target, duration, properties) {
  return new Promise((resolve) => gsap.to(target, { ...properties, duration, onComplete: resolve }));
}
function getOffsets() {
  const w = window.innerWidth, h = window.innerHeight;
  if (w < 700) return { top: h - 280, left: 16, cW: 140, cH: 200, g: 16 };
  if (w < 1000) return { top: h - 360, left: w - 520, cW: 160, cH: 240, g: 24 };
  return { top: h - 430, left: w - 830, cW: cardWidth, cH: cardHeight, g: gap };
}
function loadArticle(id) {
  return new Promise((resolve, reject) => {
    if (window.ARTICLES[id]) { resolve(window.ARTICLES[id]); return; }
    const script = document.createElement("script");
    script.src = `js/articles/${id}.js`;
    script.onload = () => {
      if (window.ARTICLES[id]) resolve(window.ARTICLES[id]);
      else reject(new Error("Makale yok: " + id));
    };
    script.onerror = () => reject(new Error("Dosya yok: " + id));
    document.head.appendChild(script);
  });
}

function init() {
  if (!data.length) return;
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const width = window.innerWidth;
  const off = getOffsets();
  offsetTop = off.top; offsetLeft = off.left;

  gsap.set("#pagination", { top: "auto", bottom: 20, left: 16, y: 0, opacity: 0, zIndex: 60 });
  gsap.set(".top-nav", { y: -80, opacity: 0 });
  gsap.set(getCard(active), { x: 0, y: 0, width, height: window.innerHeight });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -40 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 40 });
  gsap.set(`${detailsInactive} .title-1`, { y: 40 });
  gsap.set(`${detailsInactive} .title-2`, { y: 40 });
  gsap.set(`${detailsInactive} .desc`, { y: 30 });
  gsap.set(`${detailsInactive} .cta`, { y: 30 });
  gsap.set(".progress-sub-foreground", { width: "16%" });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + index * (off.cW + off.g), y: offsetTop,
      width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + index * (off.cW + off.g), zIndex: 40, y: offsetTop + off.cH - 80
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });
  gsap.set(".indicator", { scaleX: 0, transformOrigin: "left" });

  gsap.to(".cover", {
    x: width + 400, delay: 0.4, ease,
    onComplete: () => { if (!isArticleOpen) startLoop(); }
  });
  rest.forEach((i, index) => {
    gsap.to(getCard(i), { x: offsetLeft + index * (off.cW + off.g), zIndex: 30, delay: startDelay + 0.04 * index, ease });
    gsap.to(getCardContent(i), { x: offsetLeft + index * (off.cW + off.g), zIndex: 40, delay: startDelay + 0.04 * index, ease });
  });
  gsap.to("#pagination", { opacity: 1, ease, delay: startDelay });
  gsap.to(".top-nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

function step() {
  if (isArticleOpen) return Promise.resolve();
  return new Promise((resolve) => {
    order.push(order.shift());
    detailsEven = !detailsEven;
    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    const off = getOffsets();

    document.querySelector(`${detailsActive} .place-box .text`).textContent = data[order[0]].place;
    document.querySelector(`${detailsActive} .title-1`).textContent = data[order[0]].title;
    document.querySelector(`${detailsActive} .title-2`).textContent = data[order[0]].title2;
    document.querySelector(`${detailsActive} .desc`).textContent = data[order[0]].description;

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.35, ease });
    gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.08, duration: 0.6, ease });
    gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.12, duration: 0.6, ease });
    gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.12, duration: 0.6, ease });
    gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.25, duration: 0.4, ease });
    gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.3, duration: 0.4, onComplete: resolve, ease });
    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];
    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.4, ease });
    gsap.to(getCardContent(active), { y: offsetTop + off.cH - 10, opacity: 0, duration: 0.25, ease });
    gsap.to(getSliderItem(active), { x: 0, ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease });
    gsap.to(".progress-sub-foreground", { width: ((active + 1) / order.length) * 100 + "%", ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (off.cW + off.g);
        gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10, scale: 1 });
        gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40 });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 40 });
        gsap.set(`${detailsInactive} .title-1`, { y: 40 });
        gsap.set(`${detailsInactive} .title-2`, { y: 40 });
        gsap.set(`${detailsInactive} .desc`, { y: 30 });
        gsap.set(`${detailsInactive} .cta`, { y: 30 });
        clicks = Math.max(0, clicks - 1);
        if (clicks > 0) step();
      }
    });
    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (off.cW + off.g);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, ease, delay: 0.08 * (index + 1) });
        gsap.to(getCardContent(i), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40, ease, delay: 0.08 * (index + 1) });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
  });
}

function stepPrev() {
  if (isArticleOpen) return Promise.resolve();
  return new Promise((resolve) => {
    order.unshift(order.pop());
    detailsEven = !detailsEven;
    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    const off = getOffsets();

    document.querySelector(`${detailsActive} .place-box .text`).textContent = data[order[0]].place;
    document.querySelector(`${detailsActive} .title-1`).textContent = data[order[0]].title;
    document.querySelector(`${detailsActive} .title-2`).textContent = data[order[0]].title2;
    document.querySelector(`${detailsActive} .desc`).textContent = data[order[0]].description;

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.35, ease });
    gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.08, duration: 0.6, ease });
    gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.12, duration: 0.6, ease });
    gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.12, duration: 0.6, ease });
    gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.25, duration: 0.4, ease });
    gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.3, duration: 0.4, onComplete: resolve, ease });
    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];
    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.4, ease });
    gsap.to(getCardContent(active), { y: offsetTop + off.cH - 10, opacity: 0, duration: 0.25, ease });
    gsap.to(getSliderItem(active), { x: 0, ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease });
    gsap.to(".progress-sub-foreground", { width: ((active + 1) / order.length) * 100 + "%", ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (off.cW + off.g);
        gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10, scale: 1 });
        gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40 });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 40 });
        gsap.set(`${detailsInactive} .title-1`, { y: 40 });
        gsap.set(`${detailsInactive} .title-2`, { y: 40 });
        gsap.set(`${detailsInactive} .desc`, { y: 30 });
        gsap.set(`${detailsInactive} .cta`, { y: 30 });
        clicks = Math.max(0, clicks - 1);
        if (clicks > 0) stepPrev();
      }
    });
    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (off.cW + off.g);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, ease, delay: 0.08 * (index + 1) });
        gsap.to(getCardContent(i), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40, ease, delay: 0.08 * (index + 1) });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
  });
}

function stopLoop() {
  loopRunning = false;
  if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
  gsap.killTweensOf(".indicator");
}
function startLoop() {
  if (isArticleOpen || loopRunning) return;
  loopRunning = true;
  async function run() {
    if (isArticleOpen || !loopRunning) return;
    gsap.set(".indicator", { scaleX: 0 });
    await animate(".indicator", autoInterval, { scaleX: 1, ease: "none" });
    if (isArticleOpen || !loopRunning) return;
    await step();
    if (!isArticleOpen && loopRunning) loopTimer = setTimeout(run, 100);
  }
  run();
}

function fillBookPage(cardLike, item) {
  const book = _("book-page");
  if (!book) return;
  const title = cardLike.title2 ? `${cardLike.title} ${cardLike.title2}`.trim() : (cardLike.title || "");
  if (_("book-image")) _("book-image").src = cardLike.image || "";
  if (_("book-title")) _("book-title").textContent = title;
  if (_("book-arabic")) _("book-arabic").textContent = item.arabic || "";
  if (_("book-place")) _("book-place").textContent = cardLike.place || "";
  if (_("book-lead")) _("book-lead").textContent = item.lead || cardLike.description || cardLike.place || "";
  if (_("book-author")) _("book-author").textContent = item.author || "—";
  if (_("book-sections")) {
    _("book-sections").innerHTML = (item.sections || []).map((s) => {
      const text = s.content || "";
      const short = text.length > 160 ? text.substring(0, 160) + "..." : text;
      return `<div class="book-section-item"><h4>${s.title}</h4><p>${short}</p></div>`;
    }).join("");
  }
  book.classList.remove("collapsed");
  const btn = _("book-toggle");
  if (btn) {
    btn.classList.remove("collapsed");
    btn.setAttribute("aria-expanded", "true");
  }
}

function setBookCollapsed(collapsed) {
  const book = _("book-page");
  const btn = _("book-toggle");
  if (book) book.classList.toggle("collapsed", collapsed);
  if (btn) {
    btn.classList.toggle("collapsed", collapsed);
    btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
  }
}

function renderArticleContent(cardLike, item) {
  _("article-title").textContent = cardLike.title2
    ? `${cardLike.title} ${cardLike.title2}` : (cardLike.title || "");
  _("article-arabic").textContent = item.arabic || "";
  _("article-lead").textContent = item.lead || cardLike.description || cardLike.place || "";
  _("article-author").textContent = item.author || "—";
  _("article-image").src = cardLike.image;
  _("article-image-caption").textContent = cardLike.place || "";
  _("related-file-title").textContent = item.relatedFile || cardLike.place || "";

  let body = "";
  (item.sections || []).forEach((sec) => {
    body += `<h2 id="${sec.id}">${sec.title}</h2><p>${sec.content}</p>`;
  });
  _("article-body").innerHTML = body;

  _("toc-list").innerHTML = (item.sections || [])
    .map((sec) => `<div class="toc-item" data-target="${sec.id}">${sec.title}</div>`).join("");
  document.querySelectorAll(".toc-item").forEach((el) => {
    el.onclick = () => {
      const t = document.getElementById(el.dataset.target);
      if (t) t.scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".toc-item").forEach((x) => x.classList.remove("active"));
      el.classList.add("active");
      closeMobileMenu();
    };
  });

  const relatedHTML = (item.related || [])
    .map((r) => `<div class="related-item"><h4>${r.title}</h4><p>${r.text}</p></div>`).join("");
  _("related-articles").innerHTML = relatedHTML;

  const mediaList = item.media || [];
  const mediaHTML = mediaList
    .map((m) => `<img src="${m.url}" alt="${m.caption || ""}" title="${m.caption || ""}">`).join("");
  if (_("media-grid")) _("media-grid").innerHTML = mediaHTML;
  if (_("media-box")) _("media-box").style.display = mediaList.length ? "block" : "none";

  const vids = item.videos || [];
  if (_("video-section")) _("video-section").style.display = vids.length ? "block" : "none";
  if (_("video-playlist")) {
    _("video-playlist").innerHTML = vids.map((id) => `
      <div class="video-item">
        <iframe src="https://www.youtube.com/embed/${id}?playsinline=1&rel=0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen loading="lazy"></iframe>
      </div>`).join("");
  }

  if (_("mobile-right-content")) {
    _("mobile-right-content").innerHTML = `
      <div class="main-image-box"><img src="${cardLike.image}" alt=""><div class="image-caption">${cardLike.place || ""}</div></div>
      <div class="related-box">
        <div class="related-label">BU MADDE</div>
        <div class="related-title">${item.relatedFile || cardLike.place || ""}</div>
        <div class="related-sub">DOSYASINDA YER ALMAKTADIR.</div>
      </div>
      <div class="related-articles">${relatedHTML}</div>
      ${mediaList.length ? `<div class="media-box"><h4>Görseller & Haritalar</h4><div class="media-grid">${mediaHTML}</div></div>` : ""}
    `;
  }

  bindMediaClicks(mediaList);
  fillBookPage(cardLike, item);

  // Telefonda varsayılan: kart kapalı → makale okunaklı
  if (window.innerWidth <= 860) setBookCollapsed(true);
  else setBookCollapsed(false);
}

async function openArticle(index) {
  const card = data[index];
  if (!card) return;
  isArticleOpen = true;
  stopLoop();
  clicks = 0;
  history.pushState({ page: "article", id: card.id }, "", `#/article/${card.id}`);

  let item;
  try { item = await loadArticle(card.id); }
  catch (e) {
    item = {
      arabic: "", lead: card.description, author: "—", relatedFile: card.place,
      related: [], sections: [{ id: "overview", title: "Genel Bakış", content: card.description }],
      videos: [], media: []
    };
  }
  renderArticleContent(card, item);
  document.getElementById("slider-view").classList.add("hidden");
  document.getElementById("article-view").classList.remove("hidden");
  const scroll = document.querySelector(".article-scroll");
  if (scroll) scroll.scrollTop = 0;
  closeMobileMenu();
}

async function openArticleById(id) {
  const idx = data.findIndex((c) => c.id === id);
  if (idx >= 0) { await openArticle(idx); return; }

  const itemMeta = (window.ARTICLES_INDEX || []).find((a) => a.id === id);
  if (!itemMeta) return;

  isArticleOpen = true;
  stopLoop();
  clicks = 0;
  history.pushState({ page: "article", id }, "", `#/article/${id}`);

  let articleData;
  try { articleData = await loadArticle(id); }
  catch (e) {
    articleData = {
      arabic: "", lead: itemMeta.place, author: "—", relatedFile: itemMeta.place,
      related: [], sections: [{ id: "overview", title: "Genel Bakış", content: itemMeta.place }],
      videos: [], media: []
    };
  }
  renderArticleContent(
    { title: itemMeta.title, title2: "", place: itemMeta.place, image: itemMeta.image, description: itemMeta.place },
    articleData
  );
  document.getElementById("slider-view").classList.add("hidden");
  document.getElementById("article-view").classList.remove("hidden");
  const scroll = document.querySelector(".article-scroll");
  if (scroll) scroll.scrollTop = 0;
  closeMobileMenu();
}

function closeArticle() {
  isArticleOpen = false;
  history.pushState({ page: "home" }, "", window.location.pathname + window.location.search);
  document.getElementById("article-view").classList.add("hidden");
  document.getElementById("slider-view").classList.remove("hidden");
  closeMobileMenu();
  setTimeout(() => { if (!isArticleOpen) startLoop(); }, 300);
}

window.addEventListener("popstate", (e) => {
  if (e.state && e.state.page === "article") openArticleById(e.state.id);
  else if (isArticleOpen) closeArticle();
});

function openMobileMenu() {
  if (_("sidebar")) _("sidebar").classList.add("open");
  if (_("sidebar-overlay")) _("sidebar-overlay").classList.add("show");
}
function closeMobileMenu() {
  if (_("sidebar")) _("sidebar").classList.remove("open");
  if (_("sidebar-overlay")) _("sidebar-overlay").classList.remove("show");
}

function buildAccordion() {
  const list = window.ARTICLES_INDEX || [];
  const sorted = [...list].sort((a, b) => a.title.localeCompare(b.title, "tr", { sensitivity: "base" }));
  const groups = {};
  sorted.forEach((item) => {
    let letter = (item.title || "?").charAt(0).toLocaleUpperCase("tr");
    if ("0123456789".includes(letter)) letter = "#";
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });
  const container = _("accordion-list");
  if (!container) return;
  container.innerHTML = "";
  Object.keys(groups).sort((a, b) => a.localeCompare(b, "tr")).forEach((letter) => {
    const group = document.createElement("div");
    group.className = "accordion-group";
    const header = document.createElement("div");
    header.className = "accordion-header";
    header.innerHTML = `<span>${letter}</span><span class="arrow">▶</span>`;
    const body = document.createElement("div");
    body.className = "accordion-body";
    groups[letter].forEach((item) => {
      const el = document.createElement("div");
      el.className = "accordion-item";
      el.innerHTML = `<img src="${item.image}" alt=""><span>${item.title}</span>`;
      el.onclick = () => openArticleById(item.id);
      body.appendChild(el);
    });
    header.onclick = () => { header.classList.toggle("open"); body.classList.toggle("open"); };
    group.appendChild(header);
    group.appendChild(body);
    container.appendChild(group);
  });
}

function initSearch() {
  const input = _("search-input");
  const results = _("search-results");
  if (!input || !results) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLocaleLowerCase("tr");
    const list = window.ARTICLES_INDEX || [];
    if (q.length < 2) { results.classList.remove("show"); results.innerHTML = ""; return; }
    const matches = list.filter((a) => {
      const t = (a.title || "").toLocaleLowerCase("tr");
      const p = (a.place || "").toLocaleLowerCase("tr");
      const id = (a.id || "").toLocaleLowerCase("tr");
      return t.includes(q) || p.includes(q) || id.includes(q);
    }).slice(0, 15);
    if (!matches.length) {
      results.innerHTML = `<div class="search-item"><div class="info"><div class="title">Sonuç bulunamadı</div></div></div>`;
      results.classList.add("show");
      return;
    }
    results.innerHTML = matches.map((a) => `
      <div class="search-item" data-id="${a.id}">
        <img src="${a.image}" alt="">
        <div class="info"><div class="title">${a.title}</div><div class="place">${a.place}</div></div>
      </div>`).join("");
    results.classList.add("show");
    results.querySelectorAll(".search-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (id) { openArticleById(id); input.value = ""; results.classList.remove("show"); }
      });
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) results.classList.remove("show");
  });
}

function bindEvents() {
  if (_("theme-toggle")) {
    _("theme-toggle").addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      const sun = document.querySelector(".icon-sun");
      const moon = document.querySelector(".icon-moon");
      if (sun) sun.classList.toggle("hidden", isLight);
      if (moon) moon.classList.toggle("hidden", !isLight);
    });
  }
  const left = document.querySelector(".arrow-left");
  const right = document.querySelector(".arrow-right");
  if (left) left.addEventListener("click", () => { if (clicks === 0 && !isArticleOpen) { clicks = 1; stepPrev(); } });
  if (right) right.addEventListener("click", () => { if (clicks === 0 && !isArticleOpen) { clicks = 1; step(); } });

  data.forEach((_, i) => {
    const el = document.getElementById(`card${i}`);
    if (el) el.addEventListener("click", () => openArticle(i));
  });
  document.querySelectorAll(".discover").forEach((btn) => {
    btn.addEventListener("click", () => openArticle(order[0]));
  });
  if (_("back-btn")) _("back-btn").addEventListener("click", closeArticle);
  if (_("nav-home")) _("nav-home").addEventListener("click", (e) => { e.preventDefault(); closeArticle(); });
  if (_("mobile-menu-btn")) _("mobile-menu-btn").addEventListener("click", openMobileMenu);
  if (_("sidebar-overlay")) _("sidebar-overlay").addEventListener("click", closeMobileMenu);

  if (_("book-toggle")) {
    _("book-toggle").addEventListener("click", () => {
      const book = _("book-page");
      const collapsed = book && !book.classList.contains("collapsed");
      setBookCollapsed(collapsed);
    });
  }
}

async function start() {
  try {
    await Promise.all(data.map((d) => new Promise((res) => {
      const img = new Image(); img.onload = res; img.onerror = res; img.src = d.image;
    })));
  } catch (e) {}

  bindEvents();
  initLightboxControls();
  buildAccordion();
  initSearch();

  const hash = window.location.hash;
  if (hash && hash.startsWith("#/article/")) {
    const id = hash.replace("#/article/", "");
    document.getElementById("slider-view").classList.add("hidden");
    await openArticleById(id);
    return;
  }
  init();
}
start();
