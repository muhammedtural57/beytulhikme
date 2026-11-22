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

const data = window.CARDS;
const _ = id => document.getElementById(id);

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

_("demo").innerHTML = data.map((i, index) =>
  `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`
).join("") + data.map((i, index) => `
  <div class="card-content" id="card-content-${index}">
    <div class="content-start"></div>
    <div class="content-place">${i.place}</div>
    <div class="content-title-1">${i.title}</div>
    <div class="content-title-2">${i.title2}</div>
  </div>`).join("");

_("slide-numbers").innerHTML = data.map((_, index) =>
  `<div class="item" id="slide-item-${index}">${index + 1}</div>`
).join("");

function openLightbox(items, startIndex) {
  galleryItems = items || [];
  galleryIndex = startIndex || 0;
  const lb = document.getElementById("lightbox");
  if (!lb || !galleryItems.length) return;
  lb.classList.remove("hidden");
  requestAnimationFrame(() => lb.classList.add("show"));
  showLightboxImage();
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("show");
  setTimeout(() => lb.classList.add("hidden"), 300);
}

function showLightboxImage() {
  const item = galleryItems[galleryIndex];
  if (!item) return;
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-caption");
  img.style.animation = "none";
  void img.offsetWidth;
  img.style.animation = "lbIn 0.35s ease";
  img.src = item.url;
  cap.textContent = item.caption || "";
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
  const grid = document.getElementById("media-grid");
  const mobileGrid = document.querySelector("#mobile-right-content .media-grid");
  const bind = (container) => {
    if (!container) return;
    container.querySelectorAll("img").forEach((img, i) => {
      img.style.cursor = "pointer";
      img.onclick = () => openLightbox(mediaArray, i);
    });
  };
  bind(grid);
  bind(mobileGrid);
}

function initLightboxControls() {
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const lb = document.getElementById("lightbox");
  if (closeBtn) closeBtn.onclick = closeLightbox;
  if (prevBtn) prevBtn.onclick = lightboxPrev;
  if (nextBtn) nextBtn.onclick = lightboxNext;
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    const box = document.getElementById("lightbox");
    if (!box || box.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev();
    if (e.key === "ArrowRight") lightboxNext();
  });
}

function getCard(i) { return `#card${i}`; }
function getCardContent(i) { return `#card-content-${i}`; }
function getSliderItem(i) { return `#slide-item-${i}`; }
function animate(target, duration, properties) {
  return new Promise(resolve => gsap.to(target, { ...properties, duration, onComplete: resolve }));
}

function getOffsets() {
  const w = window.innerWidth, h = window.innerHeight;
  if (w < 700) return { top: h - 280, left: 16, cW: 140, cH: 200, g: 16 };
  if (w < 1000) return { top: h - 360, left: w - 520, cW: 160, cH: 240, g: 24 };
  return { top: h - 430, left: w - 830, cW: cardWidth, cH: cardHeight, g: gap };
}

function loadArticle(id) {
  return new Promise((resolve, reject) => {
    if (window.ARTICLES[id]) {
      resolve(window.ARTICLES[id]);
      return;
    }
    const script = document.createElement("script");
    script.src = `js/articles/${id}.js`;
    script.onload = () => {
      if (window.ARTICLES[id]) resolve(window.ARTICLES[id]);
      else reject(new Error("Makale yüklenemedi: " + id));
    };
    script.onerror = () => reject(new Error("Dosya bulunamadı: " + id));
    document.head.appendChild(script);
  });
}

function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;
  const off = getOffsets();
  offsetTop = off.top; offsetLeft = off.left;

  gsap.set("#pagination", { top: "auto", bottom: 20, left: 16, y: 0, opacity: 0, zIndex: 60 });
  gsap.set(".top-nav", { y: -80, opacity: 0 });
  gsap.set(getCard(active), { x: 0, y: 0, width, height });
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
    gsap.set(getCard(i), { x: offsetLeft + index * (off.cW + off.g), y: offsetTop, width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10 });
    gsap.set(getCardContent(i), { x: offsetLeft + index * (off.cW + off.g), zIndex: 40, y: offsetTop + off.cH - 80 });
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
  return new Promise(resolve => {
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
    gsap.to(".progress-sub-foreground", { width: ((active + 1) / order.length * 100) + "%", ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease,
      width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
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
  return new Promise(resolve => {
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
    gsap.to(".progress-sub-foreground", { width: ((active + 1) / order.length * 100) + "%", ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease,
      width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
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

async function openArticle(index) {
  const card = data[index];
  isArticleOpen = true;
  stopLoop();
  clicks = 0;

  history.pushState({ page: "article", id: card.id }, "", `#/article/${card.id}`);

  let item;
  try {
    item = await loadArticle(card.id);
  } catch (e) {
    console.warn(e);
    item = {
      arabic: "",
      lead: card.description,
      author: "—",
      relatedFile: card.place,
      related: [],
      sections: [{ id: "overview", title: "Genel Bakış", content: card.description }],
      videos: [],
      media: []
    };
  }

  _("article-title").textContent = `${card.title} ${card.title2}`;
  _("article-arabic").textContent = item.arabic || "";
  _("article-lead").textContent = item.lead || card.description;
  _("article-author").textContent = item.author || "—";
  _("article-image").src = card.image;
  _("article-image-caption").textContent = card.place;
  _("related-file-title").textContent = item.relatedFile || card.place;

  let body = "";
  (item.sections || []).forEach(sec => {
    body += `<h2 id="${sec.id}">${sec.title}</h2><p>${sec.content}</p>`;
  });
  _("article-body").innerHTML = body;

  _("toc-list").innerHTML = (item.sections || []).map(sec =>
    `<div class="toc-item" data-target="${sec.id}">${sec.title}</div>`
  ).join("");
  document.querySelectorAll(".toc-item").forEach(el => {
    el.onclick = () => {
      const t = document.getElementById(el.dataset.target);
      if (t) t.scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".toc-item").forEach(x => x.classList.remove("active"));
      el.classList.add("active");
      closeMobileMenu();
    };
  });

  const relatedHTML = (item.related || []).map(r =>
    `<div class="related-item"><h4>${r.title}</h4><p>${r.text}</p></div>`
  ).join("");
  _("related-articles").innerHTML = relatedHTML;

  const mediaHTML = (item.media || []).map(m =>
    `<img src="${m.url}" alt="${m.caption}" title="${m.caption}">`
  ).join("");
  _("media-grid").innerHTML = mediaHTML;
  _("media-box").style.display = (item.media || []).length ? "block" : "none";

  const vids = item.videos || [];
  _("video-section").style.display = vids.length ? "block" : "none";
  _("video-playlist").innerHTML = vids.map(id => `
    <div class="video-item">
      <iframe src="https://www.youtube.com/embed/${id}?playsinline=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen loading="lazy"></iframe>
    </div>`).join("");

  _("mobile-right-content").innerHTML = `
    <div class="main-image-box"><img src="${card.image}" alt=""><div class="image-caption">${card.place}</div></div>
    <div class="related-box">
      <div class="related-label">BU MADDE</div>
      <div class="related-title">${item.relatedFile || card.place}</div>
      <div class="related-sub">DOSYASINDA YER ALMAKTADIR.</div>
    </div>
    <div class="related-articles">${relatedHTML}</div>
    ${(item.media || []).length ? `<div class="media-box"><h4>Görseller & Haritalar</h4><div class="media-grid">${mediaHTML}</div></div>` : ""}
  `;

  document.getElementById("slider-view").classList.add("hidden");
  document.getElementById("article-view").classList.remove("hidden");
  document.querySelector(".article-main").scrollTop = 0;
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
  if (e.state && e.state.page === "article") {
    const idx = data.findIndex(c => c.id === e.state.id);
    if (idx >= 0) openArticle(idx);
  } else {
    if (isArticleOpen) closeArticle();
  }
});

function openMobileMenu() {
  _("sidebar").classList.add("open");
  _("sidebar-overlay").classList.add("show");
}
function closeMobileMenu() {
  _("sidebar").classList.remove("open");
  _("sidebar-overlay").classList.remove("show");
}

_("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  document.querySelector(".icon-sun").classList.toggle("hidden", isLight);
  document.querySelector(".icon-moon").classList.toggle("hidden", !isLight);
});

document.querySelector(".arrow-left").addEventListener("click", () => {
  if (clicks === 0 && !isArticleOpen) { clicks = 1; stepPrev(); }
});
document.querySelector(".arrow-right").addEventListener("click", () => {
  if (clicks === 0 && !isArticleOpen) { clicks = 1; step(); }
});

data.forEach((_, i) => {
  document.getElementById(`card${i}`).addEventListener("click", () => openArticle(i));
});
document.querySelectorAll(".discover").forEach(btn => {
  btn.addEventListener("click", () => openArticle(order[0]));
});

_("back-btn").addEventListener("click", closeArticle);
_("nav-home").addEventListener("click", (e) => { e.preventDefault(); closeArticle(); });
_("mobile-menu-btn").addEventListener("click", openMobileMenu);
_("sidebar-overlay").addEventListener("click", closeMobileMenu);

function buildAccordion() {
  const list = window.ARTICLES_INDEX || [];
  const sorted = [...list].sort((a, b) => a.title.localeCompare(b.title, "tr"));
  const groups = {};
  sorted.forEach(item => {
    const letter = item.title.charAt(0).toLocaleUpperCase("tr");
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });

  const container = document.getElementById("accordion-list");
  if (!container) return;
  container.innerHTML = "";

  Object.keys(groups).sort((a, b) => a.localeCompare(b, "tr")).forEach(letter => {
    const group = document.createElement("div");
    group.className = "accordion-group";

    const header = document.createElement("div");
    header.className = "accordion-header";
    header.innerHTML = `<span>${letter}</span><span class="arrow">▶</span>`;

    const body = document.createElement("div");
    body.className = "accordion-body";

    groups[letter].forEach(item => {
      const el = document.createElement("div");
      el.className = "accordion-item";
      el.innerHTML = `<img src="${item.image}" alt=""><span>${item.title}</span>`;
      el.onclick = () => openArticleById(item.id);
      body.appendChild(el);
    });

    header.onclick = () => {
      header.classList.toggle("open");
      body.classList.toggle("open");
    };

    group.appendChild(header);
    group.appendChild(body);
    container.appendChild(group);
  });
}

async function openArticleById(id) {
  // Önce kartlarda var mı bak
  let idx = data.findIndex(c => c.id === id);
  if (idx >= 0) {
    await openArticle(idx);
    return;
  }
  // Kartlarda yoksa index'ten bulup sahte index ile aç
  const item = (window.ARTICLES_INDEX || []).find(a => a.id === id);
  if (!item) return;

  // Geçici olarak data'ya eklemeden direkt açmak için
  // openArticle mantığını id üzerinden çalıştırıyoruz
  isArticleOpen = true;
  stopLoop();
  clicks = 0;
  history.pushState({ page: "article", id }, "", `#/article/${id}`);

  let articleData;
  try {
    articleData = await loadArticle(id);
  } catch (e) {
    articleData = {
      arabic: "",
      lead: item.place,
      author: "—",
      relatedFile: item.place,
      related: [],
      sections: [{ id: "overview", title: "Genel Bakış", content: item.place }],
      videos: [],
      media: []
    };
  }

  _("article-title").textContent = item.title;
  _("article-arabic").textContent = articleData.arabic || "";
  _("article-lead").textContent = articleData.lead || item.place;
  _("article-author").textContent = articleData.author || "—";
  _("article-image").src = item.image;
  _("article-image-caption").textContent = item.place;
  _("related-file-title").textContent = articleData.relatedFile || item.place;

  let body = "";
  (articleData.sections || []).forEach(sec => {
    body += `<h2 id="${sec.id}">${sec.title}</h2><p>${sec.content}</p>`;
  });
  _("article-body").innerHTML = body;

  _("toc-list").innerHTML = (articleData.sections || []).map(sec =>
    `<div class="toc-item" data-target="${sec.id}">${sec.title}</div>`
  ).join("");
  document.querySelectorAll(".toc-item").forEach(el => {
    el.onclick = () => {
      const t = document.getElementById(el.dataset.target);
      if (t) t.scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".toc-item").forEach(x => x.classList.remove("active"));
      el.classList.add("active");
      closeMobileMenu();
    };
  });

  const relatedHTML = (articleData.related || []).map(r =>
    `<div class="related-item"><h4>${r.title}</h4><p>${r.text}</p></div>`
  ).join("");
  _("related-articles").innerHTML = relatedHTML;

  const mediaHTML = (articleData.media || []).map(m =>
    `<img src="${m.url}" alt="${m.caption}" title="${m.caption}">`
  ).join("");
  _("media-grid").innerHTML = mediaHTML;
  _("media-box").style.display = (articleData.media || []).length ? "block" : "none";

  const vids = articleData.videos || [];
  _("video-section").style.display = vids.length ? "block" : "none";
  _("video-playlist").innerHTML = vids.map(vid => `
    <div class="video-item">
      <iframe src="https://www.youtube.com/embed/${vid}?playsinline=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen loading="lazy"></iframe>
    </div>`).join("");

  _("mobile-right-content").innerHTML = `
    <div class="main-image-box"><img src="${item.image}" alt=""><div class="image-caption">${item.place}</div></div>
    <div class="related-box">
      <div class="related-label">BU MADDE</div>
      <div class="related-title">${articleData.relatedFile || item.place}</div>
      <div class="related-sub">DOSYASINDA YER ALMAKTADIR.</div>
    </div>
    <div class="related-articles">${relatedHTML}</div>
  `;

  document.getElementById("slider-view").classList.add("hidden");
  document.getElementById("article-view").classList.remove("hidden");
  document.querySelector(".article-main").scrollTop = 0;
  closeMobileMenu();
}

function initSearch() {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLocaleLowerCase("tr");
    const list = window.ARTICLES_INDEX || [];

    if (q.length < 2) {
      results.classList.remove("show");
      results.innerHTML = "";
      return;
    }

    const matches = list.filter(a => {
      const t = (a.title || "").toLocaleLowerCase("tr");
      const p = (a.place || "").toLocaleLowerCase("tr");
      const id = (a.id || "").toLocaleLowerCase("tr");
      return t.includes(q) || p.includes(q) || id.includes(q);
    }).slice(0, 15);

    if (matches.length === 0) {
      results.innerHTML = `<div class="search-item"><div class="info"><div class="title">Sonuç bulunamadı</div></div></div>`;
      results.classList.add("show");
      return;
    }

    results.innerHTML = matches.map(a => `
      <div class="search-item" data-id="${a.id}">
        <img src="${a.image}" alt="">
        <div class="info">
          <div class="title">${a.title}</div>
          <div class="place">${a.place}</div>
        </div>
      </div>
    `).join("");
    results.classList.add("show");

    results.querySelectorAll(".search-item").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (id) {
          openArticleById(id);
          input.value = "";
          results.classList.remove("show");
        }
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
      results.classList.remove("show");
    }
  });
}


async function start() {
  try {
    await Promise.all(data.map(d => new Promise(res => {
      const img = new Image();
      img.onload = res; img.onerror = res; img.src = d.image;
    })));
  } catch (e) {}

  // F5 / yenileme: aynı makalede kal
  const hash = window.location.hash;
  if (hash && hash.startsWith("#/article/")) {
    const id = hash.replace("#/article/", "");
    const idx = data.findIndex(c => c.id === id);
    if (idx >= 0) {
      document.getElementById("slider-view").classList.add("hidden");
      await openArticle(idx);
      return;
    }
  }

  init();
}
start();
buildAccordion();
initSearch();
