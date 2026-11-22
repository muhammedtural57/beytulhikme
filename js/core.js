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
const $ = function (id) { return document.getElementById(id); };

let order = data.map(function (_, i) { return i; });
let detailsEven = true;
let offsetTop = 200, offsetLeft = 700;
let clicks = 0;
let isArticleOpen = false;
let loopRunning = false;
let loopTimer = null;
let galleryItems = [];
let galleryIndex = 0;

var cardWidth = SETTINGS.cardWidth;
var cardHeight = SETTINGS.cardHeight;
var gap = SETTINGS.gap;
var numberSize = SETTINGS.numberSize;
var ease = SETTINGS.ease;
var startDelay = SETTINGS.startDelay;
var autoInterval = SETTINGS.autoInterval;

(function buildCards() {
  var demo = $("demo");
  var slides = $("slide-numbers");
  if (!demo || !data.length) return;
  demo.innerHTML =
    data.map(function (item, index) {
      return '<div class="card" id="card' + index + '" style="background-image:url(' + item.image + ')"></div>';
    }).join("") +
    data.map(function (item, index) {
      return '<div class="card-content" id="card-content-' + index + '">' +
        '<div class="content-start"></div>' +
        '<div class="content-place">' + item.place + '</div>' +
        '<div class="content-title-1">' + item.title + '</div>' +
        '<div class="content-title-2">' + item.title2 + '</div></div>';
    }).join("");
  if (slides) {
    slides.innerHTML = data.map(function (_, index) {
      return '<div class="item" id="slide-item-' + index + '">' + (index + 1) + '</div>';
    }).join("");
  }
})();

function getCard(i) { return "#card" + i; }
function getCardContent(i) { return "#card-content-" + i; }
function getSliderItem(i) { return "#slide-item-" + i; }

function animate(target, duration, properties) {
  return new Promise(function (resolve) {
    var props = Object.assign({}, properties, { duration: duration, onComplete: resolve });
    gsap.to(target, props);
  });
}

function getOffsets() {
  var w = window.innerWidth, h = window.innerHeight;
  if (w < 700) return { top: h - 280, left: 16, cW: 140, cH: 200, g: 16 };
  if (w < 1000) return { top: h - 360, left: w - 520, cW: 160, cH: 240, g: 24 };
  return { top: h - 430, left: w - 830, cW: cardWidth, cH: cardHeight, g: gap };
}

function loadArticle(id) {
  return new Promise(function (resolve, reject) {
    if (window.ARTICLES[id]) { resolve(window.ARTICLES[id]); return; }
    var script = document.createElement("script");
    script.src = "js/articles/" + id + ".js";
    script.onload = function () {
      if (window.ARTICLES[id]) resolve(window.ARTICLES[id]);
      else reject(new Error("Makale yok: " + id));
    };
    script.onerror = function () { reject(new Error("Dosya yok: " + id)); };
    document.head.appendChild(script);
  });
}

function openLightbox(items, startIndex) {
  galleryItems = items || [];
  galleryIndex = startIndex || 0;
  var lb = $("lightbox");
  if (!lb || !galleryItems.length) return;
  lb.classList.remove("hidden");
  requestAnimationFrame(function () { lb.classList.add("show"); });
  showLightboxImage();
}
function closeLightbox() {
  var lb = $("lightbox");
  if (!lb) return;
  lb.classList.remove("show");
  setTimeout(function () { lb.classList.add("hidden"); }, 300);
}
function showLightboxImage() {
  var item = galleryItems[galleryIndex];
  if (!item) return;
  var img = $("lightbox-img");
  var cap = $("lightbox-caption");
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
  var list = mediaArray || [];
  function bind(container) {
    if (!container) return;
    var imgs = container.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      (function (index) {
        imgs[index].style.cursor = "pointer";
        imgs[index].onclick = function () { openLightbox(list, index); };
      })(i);
    }
  }
  bind($("media-grid"));
  bind(document.querySelector("#mobile-right-content .media-grid"));
}
function initLightboxControls() {
  if ($("lightbox-close")) $("lightbox-close").onclick = closeLightbox;
  if ($("lightbox-prev")) $("lightbox-prev").onclick = lightboxPrev;
  if ($("lightbox-next")) $("lightbox-next").onclick = lightboxNext;
  var lb = $("lightbox");
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    var box = $("lightbox");
    if (!box || box.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev();
    if (e.key === "ArrowRight") lightboxNext();
  });
}

function init() {
  if (!data.length) return;
  var active = order[0], rest = order.slice(1);
  var detailsActive = detailsEven ? "#details-even" : "#details-odd";
  var detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  var width = window.innerWidth;
  var off = getOffsets();
  offsetTop = off.top; offsetLeft = off.left;

  gsap.set("#pagination", { top: "auto", bottom: 20, left: 16, y: 0, opacity: 0, zIndex: 60 });
  gsap.set(".top-nav", { y: -80, opacity: 0 });
  gsap.set(getCard(active), { x: 0, y: 0, width: width, height: window.innerHeight });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -40 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(detailsInactive + " .text", { y: 40 });
  gsap.set(detailsInactive + " .title-1", { y: 40 });
  gsap.set(detailsInactive + " .title-2", { y: 40 });
  gsap.set(detailsInactive + " .desc", { y: 30 });
  gsap.set(detailsInactive + " .cta", { y: 30 });
  gsap.set(".progress-sub-foreground", { width: "16%" });

  rest.forEach(function (i, index) {
    gsap.set(getCard(i), { x: offsetLeft + index * (off.cW + off.g), y: offsetTop, width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10 });
    gsap.set(getCardContent(i), { x: offsetLeft + index * (off.cW + off.g), zIndex: 40, y: offsetTop + off.cH - 80 });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });
  gsap.set(".indicator", { scaleX: 0, transformOrigin: "left" });

  gsap.to(".cover", {
    x: width + 400, delay: 0.4, ease: ease,
    onComplete: function () { if (!isArticleOpen) startLoop(); }
  });
  rest.forEach(function (i, index) {
    gsap.to(getCard(i), { x: offsetLeft + index * (off.cW + off.g), zIndex: 30, delay: startDelay + 0.04 * index, ease: ease });
    gsap.to(getCardContent(i), { x: offsetLeft + index * (off.cW + off.g), zIndex: 40, delay: startDelay + 0.04 * index, ease: ease });
  });
  gsap.to("#pagination", { opacity: 1, ease: ease, delay: startDelay });
  gsap.to(".top-nav", { y: 0, opacity: 1, ease: ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease: ease, delay: startDelay });
}

function step() {
  if (isArticleOpen) return Promise.resolve();
  return new Promise(function (resolve) {
    order.push(order.shift());
    detailsEven = !detailsEven;
    var detailsActive = detailsEven ? "#details-even" : "#details-odd";
    var detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    var off = getOffsets();

    document.querySelector(detailsActive + " .place-box .text").textContent = data[order[0]].place;
    document.querySelector(detailsActive + " .title-1").textContent = data[order[0]].title;
    document.querySelector(detailsActive + " .title-2").textContent = data[order[0]].title2;
    document.querySelector(detailsActive + " .desc").textContent = data[order[0]].description;

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.35, ease: ease });
    gsap.to(detailsActive + " .text", { y: 0, delay: 0.08, duration: 0.6, ease: ease });
    gsap.to(detailsActive + " .title-1", { y: 0, delay: 0.12, duration: 0.6, ease: ease });
    gsap.to(detailsActive + " .title-2", { y: 0, delay: 0.12, duration: 0.6, ease: ease });
    gsap.to(detailsActive + " .desc", { y: 0, delay: 0.25, duration: 0.4, ease: ease });
    gsap.to(detailsActive + " .cta", { y: 0, delay: 0.3, duration: 0.4, onComplete: resolve, ease: ease });
    gsap.set(detailsInactive, { zIndex: 12 });

    var active = order[0], rest = order.slice(1), prv = rest[rest.length - 1];
    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.4, ease: ease });
    gsap.to(getCardContent(active), { y: offsetTop + off.cH - 10, opacity: 0, duration: 0.25, ease: ease });
    gsap.to(getSliderItem(active), { x: 0, ease: ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease: ease });
    gsap.to(".progress-sub-foreground", { width: ((active + 1) / order.length) * 100 + "%", ease: ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease: ease, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
      onComplete: function () {
        var xNew = offsetLeft + (rest.length - 1) * (off.cW + off.g);
        gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10, scale: 1 });
        gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40 });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(detailsInactive + " .text", { y: 40 });
        gsap.set(detailsInactive + " .title-1", { y: 40 });
        gsap.set(detailsInactive + " .title-2", { y: 40 });
        gsap.set(detailsInactive + " .desc", { y: 30 });
        gsap.set(detailsInactive + " .cta", { y: 30 });
        clicks = Math.max(0, clicks - 1);
        if (clicks > 0) step();
      }
    });
    rest.forEach(function (i, index) {
      if (i !== prv) {
        var xNew = offsetLeft + index * (off.cW + off.g);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, ease: ease, delay: 0.08 * (index + 1) });
        gsap.to(getCardContent(i), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40, ease: ease, delay: 0.08 * (index + 1) });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease: ease });
      }
    });
  });
}

function stepPrev() {
  if (isArticleOpen) return Promise.resolve();
  return new Promise(function (resolve) {
    order.unshift(order.pop());
    detailsEven = !detailsEven;
    var detailsActive = detailsEven ? "#details-even" : "#details-odd";
    var detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    var off = getOffsets();

    document.querySelector(detailsActive + " .place-box .text").textContent = data[order[0]].place;
    document.querySelector(detailsActive + " .title-1").textContent = data[order[0]].title;
    document.querySelector(detailsActive + " .title-2").textContent = data[order[0]].title2;
    document.querySelector(detailsActive + " .desc").textContent = data[order[0]].description;

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.35, ease: ease });
    gsap.to(detailsActive + " .text", { y: 0, delay: 0.08, duration: 0.6, ease: ease });
    gsap.to(detailsActive + " .title-1", { y: 0, delay: 0.12, duration: 0.6, ease: ease });
    gsap.to(detailsActive + " .title-2", { y: 0, delay: 0.12, duration: 0.6, ease: ease });
    gsap.to(detailsActive + " .desc", { y: 0, delay: 0.25, duration: 0.4, ease: ease });
    gsap.to(detailsActive + " .cta", { y: 0, delay: 0.3, duration: 0.4, onComplete: resolve, ease: ease });
    gsap.set(detailsInactive, { zIndex: 12 });

    var active = order[0], rest = order.slice(1), prv = rest[rest.length - 1];
    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.4, ease: ease });
    gsap.to(getCardContent(active), { y: offsetTop + off.cH - 10, opacity: 0, duration: 0.25, ease: ease });
    gsap.to(getSliderItem(active), { x: 0, ease: ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease: ease });
    gsap.to(".progress-sub-foreground", { width: ((active + 1) / order.length) * 100 + "%", ease: ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease: ease, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
      onComplete: function () {
        var xNew = offsetLeft + (rest.length - 1) * (off.cW + off.g);
        gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, zIndex: 30, borderRadius: 10, scale: 1 });
        gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40 });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(detailsInactive + " .text", { y: 40 });
        gsap.set(detailsInactive + " .title-1", { y: 40 });
        gsap.set(detailsInactive + " .title-2", { y: 40 });
        gsap.set(detailsInactive + " .desc", { y: 30 });
        gsap.set(detailsInactive + " .cta", { y: 30 });
        clicks = Math.max(0, clicks - 1);
        if (clicks > 0) stepPrev();
      }
    });
    rest.forEach(function (i, index) {
      if (i !== prv) {
        var xNew = offsetLeft + index * (off.cW + off.g);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), { x: xNew, y: offsetTop, width: off.cW, height: off.cH, ease: ease, delay: 0.08 * (index + 1) });
        gsap.to(getCardContent(i), { x: xNew, y: offsetTop + off.cH - 80, opacity: 1, zIndex: 40, ease: ease, delay: 0.08 * (index + 1) });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease: ease });
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
  function run() {
    if (isArticleOpen || !loopRunning) return;
    gsap.set(".indicator", { scaleX: 0 });
    animate(".indicator", autoInterval, { scaleX: 1, ease: "none" })
      .then(function () {
        if (isArticleOpen || !loopRunning) return;
        return step();
      })
      .then(function () {
        if (!isArticleOpen && loopRunning) loopTimer = setTimeout(run, 100);
      });
  }
  run();
}

function renderArticleSummary(cardLike, item) {
  const cardEl = $("article-summary-card");
  if (!cardEl) return;

  const fullTitle = cardLike.title2
    ? `${cardLike.title} ${cardLike.title2}`.trim()
    : (cardLike.title || "");

  const mainImg =
    cardLike.image ||
    item.image ||
    (item.media && item.media[0] && item.media[0].url) ||
    "";

  const avatarImg = $("summary-image");
  if (avatarImg) {
    avatarImg.src = mainImg;
    avatarImg.alt = fullTitle;
  }

  if ($("summary-title")) $("summary-title").textContent = fullTitle;
  if ($("summary-arabic")) $("summary-arabic").textContent = item.arabic || "";
  if ($("summary-place")) $("summary-place").textContent = cardLike.place || "";
  if ($("summary-lead")) {
    $("summary-lead").textContent = item.lead || cardLike.description || cardLike.place || "";
  }
  if ($("summary-author")) $("summary-author").textContent = item.author || "—";

  const heroBox = $("summary-hero-image");
  if (heroBox) {
    if (mainImg) {
      heroBox.innerHTML = `<img src="${mainImg}" alt="${fullTitle}">`;
      heroBox.style.display = "block";
    } else {
      heroBox.innerHTML = "";
      heroBox.style.display = "none";
    }
  }

  const secBox = $("summary-sections");
  if (secBox) {
    const customItems = Array.isArray(item.summaryItems) && item.summaryItems.length
      ? item.summaryItems
      : null;

    if (customItems) {
      secBox.innerHTML = customItems
        .map((entry) => {
          const attr = entry.targetId ? ` data-target="${entry.targetId}" style="cursor:pointer;"` : "";
          return `
            <div class="summary-section-item"${attr}>
              <h4>${entry.title || ""}</h4>
              <p>${entry.text || ""}</p>
            </div>`;
        })
        .join("");

      secBox.querySelectorAll(".summary-section-item[data-target]").forEach((el) => {
        el.addEventListener("click", function () {
          const target = document.getElementById(this.getAttribute("data-target"));
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      });
    } else {
      secBox.innerHTML = (item.sections || [])
        .map((sec) => {
          const plainText = (sec.content || "").replace(/<[^>]*>/g, "");
          const excerpt = plainText.length > 130
            ? plainText.slice(0, 130).trim() + "..."
            : plainText;
          return `
            <div class="summary-section-item" data-target="${sec.id || ""}" style="cursor:pointer;">
              <h4>${sec.title}</h4>
              <p>${excerpt}</p>
            </div>`;
        })
        .join("");

      secBox.querySelectorAll(".summary-section-item[data-target]").forEach((el) => {
        el.addEventListener("click", function () {
          const id = this.getAttribute("data-target");
          const target = id ? document.getElementById(id) : null;
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      });
    }
  }

function renderArticleContent(cardLike, item) { 
  renderArticleSummary(cardLike, item);
  var fullTitle = cardLike.title2 ? cardLike.title + " " + cardLike.title2 : (cardLike.title || "");
  $("article-title").textContent = fullTitle;
  $("article-arabic").textContent = item.arabic || "";
  $("article-lead").textContent = item.lead || cardLike.description || cardLike.place || "";
  $("article-author").textContent = item.author || "—";
  $("article-image").src = cardLike.image || "";
  $("article-image-caption").textContent = cardLike.place || "";
  $("related-file-title").textContent = item.relatedFile || cardLike.place || "";

  var body = "";
  (item.sections || []).forEach(function (sec) {
    body += '<h2 id="' + sec.id + '">' + sec.title + "</h2><p>" + sec.content + "</p>";
  });
  $("article-body").innerHTML = body;

  $("toc-list").innerHTML = (item.sections || []).map(function (sec) {
    return '<div class="toc-item" data-target="' + sec.id + '">' + sec.title + "</div>";
  }).join("");
  var tocItems = document.querySelectorAll(".toc-item");
  for (var t = 0; t < tocItems.length; t++) {
    tocItems[t].onclick = function () {
      var target = document.getElementById(this.getAttribute("data-target"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
      var all = document.querySelectorAll(".toc-item");
      for (var j = 0; j < all.length; j++) all[j].classList.remove("active");
      this.classList.add("active");
      closeMobileMenu();
    };
  }

  var relatedHTML = (item.related || []).map(function (r) {
    return '<div class="related-item"><h4>' + r.title + "</h4><p>" + r.text + "</p></div>";
  }).join("");
  $("related-articles").innerHTML = relatedHTML;

  var mediaList = item.media || [];
  var mediaHTML = mediaList.map(function (m) {
    return '<img src="' + m.url + '" alt="' + (m.caption || "") + '" title="' + (m.caption || "") + '">';
  }).join("");
  if ($("media-grid")) $("media-grid").innerHTML = mediaHTML;
  if ($("media-box")) $("media-box").style.display = mediaList.length ? "block" : "none";

  var vids = item.videos || [];
  if ($("video-section")) $("video-section").style.display = vids.length ? "block" : "none";
  if ($("video-playlist")) {
    $("video-playlist").innerHTML = vids.map(function (id) {
      return '<div class="video-item"><iframe src="https://www.youtube.com/embed/' + id +
        '?playsinline=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    }).join("");
  }

  if ($("mobile-right-content")) {
    $("mobile-right-content").innerHTML =
      '<div class="main-image-box"><img src="' + (cardLike.image || "") + '" alt=""><div class="image-caption">' + (cardLike.place || "") + "</div></div>" +
      '<div class="related-box"><div class="related-label">BU MADDE</div><div class="related-title">' +
      (item.relatedFile || cardLike.place || "") +
      '</div><div class="related-sub">DOSYASINDA YER ALMAKTADIR.</div></div>' +
      '<div class="related-articles">' + relatedHTML + "</div>" +
      (mediaList.length ? '<div class="media-box"><h4>Görseller &amp; Haritalar</h4><div class="media-grid">' + mediaHTML + "</div></div>" : "");
  }
  bindMediaClicks(mediaList);
}

function openArticle(index) {
  var card = data[index];
  if (!card) return Promise.resolve();
  isArticleOpen = true;
  stopLoop();
  clicks = 0;
  history.pushState({ page: "article", id: card.id }, "", "#/article/" + card.id);
  return loadArticle(card.id)
    .catch(function () {
      return {
        arabic: "", lead: card.description, author: "—", relatedFile: card.place,
        related: [], sections: [{ id: "overview", title: "Genel Bakış", content: card.description }],
        videos: [], media: []
      };
    })
    .then(function (item) {
      renderArticleContent(card, item);
      document.getElementById("slider-view").classList.add("hidden");
      document.getElementById("article-view").classList.remove("hidden");
      var main = document.querySelector(".article-main");
      if (main) main.scrollTop = 0;
      closeMobileMenu();
    });
}

function openArticleById(id) {
  var idx = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) { idx = i; break; }
  }
  if (idx >= 0) return openArticle(idx);

  var list = window.ARTICLES_INDEX || [];
  var itemMeta = null;
  for (var j = 0; j < list.length; j++) {
    if (list[j].id === id) { itemMeta = list[j]; break; }
  }
  if (!itemMeta) return Promise.resolve();

  isArticleOpen = true;
  stopLoop();
  clicks = 0;
  history.pushState({ page: "article", id: id }, "", "#/article/" + id);

  return loadArticle(id)
    .catch(function () {
      return {
        arabic: "", lead: itemMeta.place, author: "—", relatedFile: itemMeta.place,
        related: [], sections: [{ id: "overview", title: "Genel Bakış", content: itemMeta.place }],
        videos: [], media: []
      };
    })
    .then(function (articleData) {
      renderArticleContent(
        { title: itemMeta.title, title2: "", place: itemMeta.place, image: itemMeta.image, description: itemMeta.place },
        articleData
      );
      document.getElementById("slider-view").classList.add("hidden");
      document.getElementById("article-view").classList.remove("hidden");
      var main = document.querySelector(".article-main");
      if (main) main.scrollTop = 0;
      closeMobileMenu();
    });
}

function closeArticle() {
  isArticleOpen = false;
  history.pushState({ page: "home" }, "", window.location.pathname + window.location.search);
  document.getElementById("article-view").classList.add("hidden");
  document.getElementById("slider-view").classList.remove("hidden");
  closeMobileMenu();
  setTimeout(function () { if (!isArticleOpen) startLoop(); }, 300);
}

window.addEventListener("popstate", function (e) {
  if (e.state && e.state.page === "article") openArticleById(e.state.id);
  else if (isArticleOpen) closeArticle();
});

function openMobileMenu() {
  if ($("sidebar")) $("sidebar").classList.add("open");
  if ($("sidebar-overlay")) $("sidebar-overlay").classList.add("show");
}
function closeMobileMenu() {
  if ($("sidebar")) $("sidebar").classList.remove("open");
  if ($("sidebar-overlay")) $("sidebar-overlay").classList.remove("show");
}

function buildAccordion() {
  var list = window.ARTICLES_INDEX || [];
  var sorted = list.slice().sort(function (a, b) {
    return a.title.localeCompare(b.title, "tr", { sensitivity: "base" });
  });
  var groups = {};
  sorted.forEach(function (item) {
    var letter = (item.title || "?").charAt(0).toLocaleUpperCase("tr");
    if ("0123456789".indexOf(letter) !== -1) letter = "#";
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });
  var container = $("accordion-list");
  if (!container) return;
  container.innerHTML = "";
  Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, "tr"); }).forEach(function (letter) {
    var group = document.createElement("div");
    group.className = "accordion-group";
    var header = document.createElement("div");
    header.className = "accordion-header";
    header.innerHTML = "<span>" + letter + '</span><span class="arrow">›</span>';
    var body = document.createElement("div");
    body.className = "accordion-body";
    groups[letter].forEach(function (item) {
      var el = document.createElement("div");
      el.className = "accordion-item";
      el.innerHTML = '<img src="' + item.image + '" alt=""><span>' + item.title + "</span>";
      el.onclick = function () { openArticleById(item.id); };
      body.appendChild(el);
    });
    header.onclick = function () {
      header.classList.toggle("open");
      body.classList.toggle("open");
    };
    group.appendChild(header);
    group.appendChild(body);
    container.appendChild(group);
  });
}

function initSearch() {
  var input = $("search-input");
  var results = $("search-results");
  if (!input || !results) return;
  input.addEventListener("input", function () {
    var q = input.value.trim().toLocaleLowerCase("tr");
    var list = window.ARTICLES_INDEX || [];
    if (q.length < 2) { results.classList.remove("show"); results.innerHTML = ""; return; }
    var matches = list.filter(function (a) {
      var t = (a.title || "").toLocaleLowerCase("tr");
      var p = (a.place || "").toLocaleLowerCase("tr");
      var id = (a.id || "").toLocaleLowerCase("tr");
      return t.indexOf(q) !== -1 || p.indexOf(q) !== -1 || id.indexOf(q) !== -1;
    }).slice(0, 15);
    if (!matches.length) {
      results.innerHTML = '<div class="search-item"><div class="info"><div class="title">Sonuç bulunamadı</div></div></div>';
      results.classList.add("show");
      return;
    }
    results.innerHTML = matches.map(function (a) {
      return '<div class="search-item" data-id="' + a.id + '">' +
        '<img src="' + a.image + '" alt="">' +
        '<div class="info"><div class="title">' + a.title + '</div><div class="place">' + a.place + "</div></div></div>";
    }).join("");
    results.classList.add("show");
    var items = results.querySelectorAll(".search-item");
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", function () {
        var id = this.getAttribute("data-id");
        if (id) { openArticleById(id); input.value = ""; results.classList.remove("show"); }
      });
    }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-box")) results.classList.remove("show");
  });
}

function bindEvents() {
  if ($("theme-toggle")) {
    $("theme-toggle").addEventListener("click", function () {
      document.body.classList.toggle("light");
      var isLight = document.body.classList.contains("light");
      var sun = document.querySelector(".icon-sun");
      var moon = document.querySelector(".icon-moon");
      if (sun) sun.classList.toggle("hidden", isLight);
      if (moon) moon.classList.toggle("hidden", !isLight);
    });
  }
  var left = document.querySelector(".arrow-left");
  var right = document.querySelector(".arrow-right");
  if (left) left.addEventListener("click", function () {
    if (clicks === 0 && !isArticleOpen) { clicks = 1; stepPrev(); }
  });
  if (right) right.addEventListener("click", function () {
    if (clicks === 0 && !isArticleOpen) { clicks = 1; step(); }
  });
  data.forEach(function (_, i) {
    var el = document.getElementById("card" + i);
    if (el) el.addEventListener("click", function () { openArticle(i); });
  });
  var discovers = document.querySelectorAll(".discover");
  for (var d = 0; d < discovers.length; d++) {
    discovers[d].addEventListener("click", function () { openArticle(order[0]); });
  }
  if ($("back-btn")) $("back-btn").addEventListener("click", closeArticle);
  if ($("nav-home")) $("nav-home").addEventListener("click", function (e) { e.preventDefault(); closeArticle(); });
  if ($("mobile-menu-btn")) $("mobile-menu-btn").addEventListener("click", openMobileMenu);
  if ($("sidebar-overlay")) $("sidebar-overlay").addEventListener("click", closeMobileMenu);
}

function initScrollTopButton() {
  var btn = $("scroll-top-btn");
  if (!btn) return;

  var articleMain = document.querySelector(".article-main");

  function getScrollPosition() {
    var winY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    var mainY = articleMain ? articleMain.scrollTop : 0;
    return Math.max(winY, mainY);
  }

  function toggleVisibility() {
    if (getScrollPosition() > 260) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (articleMain) {
      articleMain.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  if (articleMain) {
    articleMain.addEventListener("scroll", toggleVisibility, { passive: true });
  }

  document.addEventListener("click", function () {
    setTimeout(toggleVisibility, 120);
  });
}

function start() {
  var promises = data.map(function (d) {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = res; img.onerror = res; img.src = d.image;
    });
  });
  Promise.all(promises).catch(function () {}).then(function () {
    bindEvents();
    initLightboxControls();
    buildAccordion();
    initSearch();
    initScrollTopButton();
    var hash = window.location.hash;
    if (hash && hash.indexOf("#/article/") === 0) {
      var id = hash.replace("#/article/", "");
      document.getElementById("slider-view").classList.add("hidden");
      return openArticleById(id);
    }
    init();
  });
}

(function initLightThemeByDefault() {
  document.body.classList.add("light");
  var sun = document.querySelector(".icon-sun");
  var moon = document.querySelector(".icon-moon");
  if (sun) sun.classList.add("hidden");
  if (moon) moon.classList.remove("hidden");
})();

start();
