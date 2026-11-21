/* ============================================================
   AYARLAR
   ============================================================ */
const SETTINGS = {
  autoInterval: 60,
  cardWidth: 200,
  cardHeight: 300,
  gap: 40,
  numberSize: 50,
  ease: "sine.inOut",
  startDelay: 0.6
};

/* ============================================================
   VERİ - Yeni sayfa eklemek için bu diziye obje ekle
   ============================================================ */
const data = [
  {
    place: "Switzerland Alps",
    title: "SAINT",
    title2: "ANTONIEN",
    description: "Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat.",
    image: "https://assets.codepen.io/3685267/timed-cards-1.jpg",
    arabic: "",
    lead: "İsviçre Alpleri'nde sakin bir kaçış noktası.",
    author: "Globe Express Editörü",
    relatedFile: "İSVİÇRE ALPLERİ",
    related: [
      { title: "Zermatt", text: "Matterhorn'un eteklerinde ünlü kayak merkezi." },
      { title: "Interlaken", text: "İki göl arasında macera sporları merkezi." }
    ],
    sections: [
      { id: "overview", title: "Genel Bakış", content: "Saint Antönien, İsviçre Alpleri'nin kalbinde yer alan sakin bir köydür. Yüksek dağlarla çevrili bu bölge hem kış hem yaz aylarında ziyaretçilerine unutulmaz deneyimler sunar." },
      { id: "activities", title: "Aktiviteler", content: "Kışın backcountry kayak, yazın dağ bisikleti ve trekking ön plandadır." }
    ],
    videos: [],
    media: []
  },
  {
    place: "Japan Alps",
    title: "NANGANO",
    title2: "PREFECTURE",
    description: "Nagano Prefecture, set within the majestic Japan Alps.",
    image: "https://assets.codepen.io/3685267/timed-cards-2.jpg",
    arabic: "",
    lead: "Japonya Alpleri'nde tarih ve doğa bir arada.",
    author: "Globe Express Editörü",
    relatedFile: "JAPONYA ALPLERİ",
    related: [{ title: "Zenkō-ji", text: "Nagano'nun en önemli tarihi tapınağı." }],
    sections: [
      { id: "overview", title: "Genel Bakış", content: "Nagano, 1998 Kış Olimpiyatları'na ev sahipliği yapmış dağlık bir bölgedir." }
    ],
    videos: [],
    media: []
  },
  {
    place: "Sahara Desert - Morocco",
    title: "MARRAKECH",
    title2: "MEROUGA",
    description: "From the souks of Marrakech to the sands of Merzouga.",
    image: "https://assets.codepen.io/3685267/timed-cards-3.jpg",
    arabic: "",
    lead: "Sahra'nın altın kum tepeleri ve berberi kültürü.",
    author: "Globe Express Editörü",
    relatedFile: "SAHRA ÇÖLÜ",
    related: [],
    sections: [
      { id: "overview", title: "Genel Bakış", content: "Merzouga, Sahra Çölü'nün en ünlü bölgelerinden biridir." }
    ],
    videos: [],
    media: []
  },
  {
    place: "Sierra Nevada - USA",
    title: "YOSEMITE",
    title2: "NATIONAL PARK",
    description: "Yosemite National Park is a showcase of the American wilderness.",
    image: "https://assets.codepen.io/3685267/timed-cards-4.jpg",
    arabic: "",
    lead: "Granit monolitler ve dev sekoyalar diyarı.",
    author: "Globe Express Editörü",
    relatedFile: "YOSEMITE",
    related: [],
    sections: [
      { id: "overview", title: "Genel Bakış", content: "Yosemite, El Capitan ve Half Dome ile dünyaca ünlüdür." }
    ],
    videos: [],
    media: []
  },
  {
    place: "Tarifa - Spain",
    title: "LOS LANCES",
    title2: "BEACH",
    description: "Los Lances Beach is a coastal paradise for kitesurfing.",
    image: "https://assets.codepen.io/3685267/timed-cards-5.jpg",
    arabic: "",
    lead: "Avrupa'nın rüzgar sörfü başkenti.",
    author: "Globe Express Editörü",
    relatedFile: "TARİFA",
    related: [],
    sections: [
      { id: "overview", title: "Genel Bakış", content: "Tarifa, Avrupa'nın en güney noktası ve rüzgar sporları merkezidir." }
    ],
    videos: [],
    media: []
  },
  {
    place: "Kudüs - Filistin",
    title: "MESCİD-i",
    title2: "AKSÂ",
    description: "Müslümanların Kudüs'te bulunan ilk kıblesi, en kutsal sayılan üç mescidden biri.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/1280px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg",
    arabic: "المسجد الأقصى",
    lead: "Müslümanların Kudüs'te bulunan ilk kıblesi, en kutsal sayılan üç mescidden biri.",
    author: "NEBİ BOZKURT",
    relatedFile: "ÜÇ AYLAR ve RAMAZAN",
    related: [
      { title: "KUBBETÜ'S-SAHRE", text: "Kudüs haremindeki kutsal kaya üzerinde yer alan, Emevî Halifesi Abdülmelik b. Mervân'ın yaptırdığı ortası kubbeli sekizgen yapı." },
      { title: "KUDÜS", text: "Üç ilâhî dinde de önemli bir yere sahip olan ve kutsal sayılan şehir." },
      { title: "FİLİSTİN", text: "Akdeniz'in güneydoğu ucunda, Asya ile Afrika arasında köprü konumunda bulunan tarihî bölge." }
    ],
    sections: [
      {
        id: "isim",
        title: "İsim ve Anlamı",
        content: `Asıl adı Ârâmîce Beth makdeşa, İbrânîce Beth ha-Mikdaş ve Arapça Beytülmakdis olup "mukaddes ev" demektir; ilk kuruluşundan beri taşıdığı bu ad sonradan şehrin tamamını kapsamına almıştır.`
      },
      {
        id: "kurani",
        title: "Kur'ân'da Mescid-i Aksâ",
        content: `İslâm âlimleri, Kur'ân-ı Kerîm'de el-Mescidü'l-aksâ adıyla anılan ve çevresinin mübarek kılındığı belirtilen yerin (el-İsrâ 17/1) Beytülmakdis olduğu konusunda ittifak haledir. Arapça <strong>aksâ</strong> "uzak" anlamındadır.`
      },
      {
        id: "tarih",
        title: "Tarihî Süreç",
        content: `Mescid-i Aksâ'nın yerinin tesbiti Hz. Dâvûd ile başlar. Mâbed Hz. Süleyman tarafından yaptırılmıştır. Daha sonra birçok yıkım ve yeniden inşa süreci yaşamıştır.`
      },
      {
        id: "onem",
        title: "İslâm'daki Yeri",
        content: `Mescid-i Aksâ, Müslümanların ilk kıblesidir. Hz. Peygamber'in İsrâ ve Mi'rac mucizesinin gerçekleştiği yerdir. Mescid-i Harâm ve Mescid-i Nebî ile birlikte İslâm'ın üç mukaddes mescidinden biridir.`
      }
    ],
    videos: [],
    media: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/640px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg", caption: "Mescid-i Aksâ" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Dome_of_the_Rock_viewed_from_the_Mount_of_Olives.jpg/640px-Dome_of_the_Rock_viewed_from_the_Mount_of_Olives.jpg", caption: "Kubbetü's-Sahre" }
    ]
  }
];

/* ============================================================
   MOTOR
   ============================================================ */
const _ = id => document.getElementById(id);
let order = [0, 1, 2, 3, 4, 5];
let detailsEven = true;
let offsetTop = 200, offsetLeft = 700, clicks = 0;
const { cardWidth, cardHeight, gap, numberSize, ease, startDelay, autoInterval } = SETTINGS;

const cardsHTML = data.map((i, index) =>
  `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`
).join("");
const cardContentsHTML = data.map((i, index) => `
  <div class="card-content" id="card-content-${index}">
    <div class="content-start"></div>
    <div class="content-place">${i.place}</div>
    <div class="content-title-1">${i.title}</div>
    <div class="content-title-2">${i.title2}</div>
  </div>`).join("");
const slideNumbersHTML = data.map((_, index) =>
  `<div class="item" id="slide-item-${index}">${index + 1}</div>`
).join("");

_("demo").innerHTML = cardsHTML + cardContentsHTML;
_("slide-numbers").innerHTML = slideNumbersHTML;

function getCard(i) { return `#card${i}`; }
function getCardContent(i) { return `#card-content-${i}`; }
function getSliderItem(i) { return `#slide-item-${i}`; }
function animate(target, duration, properties) {
  return new Promise(resolve => gsap.to(target, { ...properties, duration, onComplete: resolve }));
}

function getOffsets() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 700) {
    return { top: h - 280, left: 16, cW: 140, cH: 200, g: 16 };
  }
  if (w < 1000) {
    return { top: h - 360, left: w - 520, cW: 160, cH: 240, g: 24 };
  }
  return { top: h - 430, left: w - 830, cW: cardWidth, cH: cardHeight, g: gap };
}

function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;
  const off = getOffsets();
  offsetTop = off.top;
  offsetLeft = off.left;

  gsap.set("#pagination", {
    top: "auto",
    bottom: 20,
    left: 16,
    y: 0,
    opacity: 0,
    zIndex: 60
  });
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
    gsap.set(getCard(i), {
      x: offsetLeft + index * (off.cW + off.g),
      y: offsetTop,
      width: off.cW,
      height: off.cH,
      zIndex: 30,
      borderRadius: 10
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + index * (off.cW + off.g),
      zIndex: 40,
      y: offsetTop + off.cH - 80
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });
  gsap.set(".indicator", { scaleX: 0, transformOrigin: "left" });

  gsap.to(".cover", {
    x: width + 400,
    delay: 0.4,
    ease,
    onComplete: () => setTimeout(loop, 400)
  });

  rest.forEach((i, index) => {
    gsap.to(getCard(i), {
      x: offsetLeft + index * (off.cW + off.g),
      zIndex: 30,
      delay: startDelay + 0.04 * index,
      ease
    });
    gsap.to(getCardContent(i), {
      x: offsetLeft + index * (off.cW + off.g),
      zIndex: 40,
      delay: startDelay + 0.04 * index,
      ease
    });
  });

  gsap.to("#pagination", { opacity: 1, ease, delay: startDelay });
  gsap.to(".top-nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

function step() {
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
    gsap.to(".progress-sub-foreground", {
      width: ((active + 1) / order.length * 100) + "%",
      ease
    });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (off.cW + off.g);
        gsap.set(getCard(prv), {
          x: xNew, y: offsetTop,
          width: off.cW, height: off.cH,
          zIndex: 30, borderRadius: 10, scale: 1
        });
        gsap.set(getCardContent(prv), {
          x: xNew, y: offsetTop + off.cH - 80,
          opacity: 1, zIndex: 40
        });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 40 });
        gsap.set(`${detailsInactive} .title-1`, { y: 40 });
        gsap.set(`${detailsInactive} .title-2`, { y: 40 });
        gsap.set(`${detailsInactive} .desc`, { y: 30 });
        gsap.set(`${detailsInactive} .cta`, { y: 30 });
        clicks -= 1;
        if (clicks > 0) step();
      }
    });

    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (off.cW + off.g);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), {
          x: xNew, y: offsetTop,
          width: off.cW, height: off.cH,
          ease, delay: 0.08 * (index + 1)
        });
        gsap.to(getCardContent(i), {
          x: xNew, y: offsetTop + off.cH - 80,
          opacity: 1, zIndex: 40, ease, delay: 0.08 * (index + 1)
        });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
  });
}

async function loop() {
  gsap.set(".indicator", { scaleX: 0 });
  await animate(".indicator", autoInterval, { scaleX: 1, ease: "none" });
  await step();
  loop();
}

/* ========== ARTICLE ========== */
function openArticle(index) {
  const item = data[index];

  _("article-title").textContent = `${item.title} ${item.title2}`;
  _("article-arabic").textContent = item.arabic || "";
  _("article-lead").textContent = item.lead || item.description;
  _("article-author").textContent = item.author || "—";
  _("article-image").src = item.image;
  _("article-image-caption").textContent = item.place;
  _("related-file-title").textContent = item.relatedFile || item.place;

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
  _("video-playlist").innerHTML = vids.map(id =>
    `<div class="video-item"><iframe src="https://www.youtube.com/embed/${id}" allowfullscreen loading="lazy"></iframe></div>`
  ).join("");

  // Mobil için sağ paneli kopyala
  const mobileRight = _("mobile-right-content");
  mobileRight.innerHTML = `
    <div class="main-image-box">
      <img src="${item.image}" alt="">
      <div class="image-caption">${item.place}</div>
    </div>
    <div class="related-box">
      <div class="related-label">BU MADDE</div>
      <div class="related-title">${item.relatedFile || item.place}</div>
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
  document.getElementById("article-view").classList.add("hidden");
  document.getElementById("slider-view").classList.remove("hidden");
  closeMobileMenu();
}

function openMobileMenu() {
  _("sidebar").classList.add("open");
  _("sidebar-overlay").classList.add("show");
}
function closeMobileMenu() {
  _("sidebar").classList.remove("open");
  _("sidebar-overlay").classList.remove("show");
}

/* ========== EVENTLER ========== */
_("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  document.querySelector(".icon-sun").classList.toggle("hidden", isLight);
  document.querySelector(".icon-moon").classList.toggle("hidden", !isLight);
});

document.querySelector(".arrow-left").addEventListener("click", () => {
  if (clicks === 0) { clicks = 1; step(); }
});
document.querySelector(".arrow-right").addEventListener("click", () => {
  if (clicks === 0) { clicks = 1; step(); }
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

window.addEventListener("resize", () => {
  // Basit yeniden hesaplama (tam animasyon reset istemiyorsak sadece offset güncelle)
});

async function start() {
  try {
    await Promise.all(data.map(d => new Promise(res => {
      const img = new Image();
      img.onload = res;
      img.onerror = res;
      img.src = d.image;
    })));
  } catch (e) {}
  init();
}
start();
