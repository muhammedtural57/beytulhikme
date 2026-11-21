/* ============================================================
   AYARLAR
   ============================================================ */
const SETTINGS = {
  autoInterval: 60,        // Otomatik geçiş süresi (saniye)
  cardWidth: 200,
  cardHeight: 300,
  gap: 40,
  numberSize: 50,
  ease: "sine.inOut",
  startDelay: 0.6
};

/* ============================================================
   VERİ - YENİ SAYFA EKLEME KILAVUZU
   ------------------------------------------------------------
   Yeni bir sayfa/makale eklemek için aşağıdaki data dizisine
   yeni bir obje eklemen yeterli.

   Zorunlu alanlar:
   - place, title, title2, description, image

   Ansiklopedi tarzı için ek alanlar:
   - arabic          → Arapça başlık
   - lead            → Turuncu kısa tanım
   - author          → Müellif adı
   - relatedFile     → "BU MADDE ... DOSYASINDA" kutusu
   - related         → Sağdaki ilgili maddeler dizisi
   - sections        → İçindekiler + makale gövdesi
   - videos          → YouTube video id listesi
   - media           → Görsel/harita listesi (url + caption)

   Görsel/Harita eklemek için media dizisine:
   { url: "https://...", caption: "Açıklama" }

   YouTube videosu eklemek için videos dizisine:
   sadece video ID'sini yaz (örnek: "dQw4w9WgXcQ")
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
    related: [
      { title: "Zenkō-ji", text: "Nagano'nun en önemli tarihi tapınağı." }
    ],
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

  /* ========== MESCİD-İ AKSÂ (DIA tarzı örnek makale) ========== */
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
        content: `Asıl adı Ârâmîce Beth makdeşa, İbrânîce Beth ha-Mikdaş ve Arapça Beytülmakdis olup "mukaddes ev" demektir; ilk kuruluşundan beri taşıdığı bu ad sonradan şehrin tamamını kapsamına almıştır. Şehir için müslümanların benimsediği Kudüs adı da aynı kökten gelmekte ve aslında şehri değil mâbedi ifade etmektedir. Minhâcî mâbedin on yedi kadar adı olduğunu söyler.`
      },
      {
        id: "kurani",
        title: "Kur'ân'da Mescid-i Aksâ",
        content: `İslâm âlimleri, Kur'ân-ı Kerîm'de el-Mescidü'l-aksâ adıyla anılan ve çevresinin mübarek kılındığı belirtilen yerin (el-İsrâ 17/1) Beytülmakdis olduğu konusunda ittifak halindedir. Arapça <strong>aksâ</strong> "uzak" anlamındadır ve mâbedin Mekke'ye uzaklığından dolayı bu ad verilmiştir. Bugün Kâbe'ye çevresiyle birlikte Mescid-i Harâm denildiği gibi Mescid-i Aksâ'ya da çevresiyle birlikte Harem-i şerif denilmektedir.`
      },
      {
        id: "tarih",
        title: "Tarihî Süreç",
        content: `Mescid-i Aksâ'nın yerinin tesbiti ve planlanması Hz. Dâvûd ile başlar. Ancak Allah mâbedin Hz. Süleyman tarafından yapılacağını bildirir. İlk mâbed m.ö. 586'da Bâbil Hükümdarı Buhtunnasr tarafından yıkılmış, daha sonra yeniden inşa edilmiştir. Roma döneminde Titus tarafından (m.s. 70) tekrar yıkılmış, Emevîler döneminde İslâmî kimliğini kazanmıştır.`
      },
      {
        id: "onem",
        title: "İslâm'daki Yeri",
        content: `Mescid-i Aksâ, Müslümanların ilk kıblesidir. Hz. Peygamber'in İsrâ ve Mi'rac mucizesinin gerçekleştiği yerdir. Mescid-i Harâm ve Mescid-i Nebî ile birlikte İslâm'ın üç mukaddes mescidinden biridir. Burada kılınan namazın sevabı diğer mescidlere göre kat kat fazladır.`
      }
    ],
    // YouTube video ID'leri (sadece ID yazman yeterli)
    videos: [
      "2v5_3qvq1bQ",   // örnek - gerçek video ID ile değiştir
      "9bZkp7q19f0"
    ],
    // Görseller ve haritalar
    media: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/640px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg", caption: "Mescid-i Aksâ genel görünüm" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Dome_of_the_Rock_viewed_from_the_Mount_of_Olives.jpg/640px-Dome_of_the_Rock_viewed_from_the_Mount_of_Olives.jpg", caption: "Kubbetü's-Sahre" }
    ]
  }
];

/* ============================================================
   AŞAĞISI ÇALIŞAN MOTOR - GENELDE DOKUNMA
   ============================================================ */
const _ = id => document.getElementById(id);
let order = [0, 1, 2, 3, 4, 5];
let detailsEven = true;
let offsetTop = 200, offsetLeft = 700, clicks = 0;
const { cardWidth, cardHeight, gap, numberSize, ease, startDelay, autoInterval } = SETTINGS;

const cards = data.map((i, index) => `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`).join("");
const cardContents = data.map((i, index) => `
  <div class="card-content" id="card-content-${index}">
    <div class="content-start"></div>
    <div class="content-place">${i.place}</div>
    <div class="content-title-1">${i.title}</div>
    <div class="content-title-2">${i.title2}</div>
  </div>`).join("");
const slideNumbers = data.map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`).join("");
_("demo").innerHTML = cards + cardContents;
_("slide-numbers").innerHTML = slideNumbers;

function getCard(i) { return `#card${i}`; }
function getCardContent(i) { return `#card-content-${i}`; }
function getSliderItem(i) { return `#slide-item-${i}`; }
function animate(target, duration, properties) {
  return new Promise(resolve => gsap.to(target, { ...properties, duration, onComplete: resolve }));
}

function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;
  offsetTop = height - 430; offsetLeft = width - 830;

  gsap.set("#pagination", { top: offsetTop + 330, left: offsetLeft, y: 200, opacity: 0, zIndex: 60 });
  gsap.set(".top-nav", { y: -200, opacity: 0 });
  gsap.set(getCard(active), { x: 0, y: 0, width, height });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-1`, { y: 100 });
  gsap.set(`${detailsInactive} .title-2`, { y: 100 });
  gsap.set(`${detailsInactive} .desc`, { y: 50 });
  gsap.set(`${detailsInactive} .cta`, { y: 60 });
  gsap.set(".progress-sub-foreground", { width: 500 * (1 / order.length) * (active + 1) });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), { x: offsetLeft + 400 + index * (cardWidth + gap), y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 10 });
    gsap.set(getCardContent(i), { x: offsetLeft + 400 + index * (cardWidth + gap), zIndex: 40, y: offsetTop + cardHeight - 100 });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });
  gsap.set(".indicator", { scaleX: 0, transformOrigin: "left" });

  gsap.to(".cover", { x: width + 400, delay: 0.5, ease, onComplete: () => setTimeout(loop, 500) });
  rest.forEach((i, index) => {
    gsap.to(getCard(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 30, delay: startDelay + 0.05 * index, ease });
    gsap.to(getCardContent(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 40, delay: startDelay + 0.05 * index, ease });
  });
  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(".top-nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

function step() {
  return new Promise(resolve => {
    order.push(order.shift());
    detailsEven = !detailsEven;
    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    document.querySelector(`${detailsActive} .place-box .text`).textContent = data[order[0]].place;
    document.querySelector(`${detailsActive} .title-1`).textContent = data[order[0]].title;
    document.querySelector(`${detailsActive} .title-2`).textContent = data[order[0]].title2;
    document.querySelector(`${detailsActive} .desc`).textContent = data[order[0]].description;

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
    gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.1, duration: 0.7, ease });
    gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease });
    gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease });
    gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease });
    gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.35, duration: 0.4, onComplete: resolve, ease });
    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];
    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.5, ease });
    gsap.to(getCardContent(active), { y: offsetTop + cardHeight - 10, opacity: 0, duration: 0.3, ease });
    gsap.to(getSliderItem(active), { x: 0, ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease });
    gsap.to(".progress-sub-foreground", { width: 500 * (1 / order.length) * (active + 1), ease });

    gsap.to(getCard(active), {
      x: 0, y: 0, ease, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
        gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 10, scale: 1 });
        gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40 });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
        gsap.set(`${detailsInactive} .desc`, { y: 50 });
        gsap.set(`${detailsInactive} .cta`, { y: 60 });
        clicks -= 1;
        if (clicks > 0) step();
      }
    });

    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, ease, delay: 0.1 * (index + 1) });
        gsap.to(getCardContent(i), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40, ease, delay: 0.1 * (index + 1) });
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

/* ========== ARTICLE AÇMA ========== */
function openArticle(index) {
  const item = data[index];

  _("article-title").textContent = `${item.title} ${item.title2}`;
  _("article-arabic").textContent = item.arabic || "";
  _("article-lead").textContent = item.lead || item.description;
  _("article-author").textContent = item.author || "—";
  _("article-image").src = item.image;
  _("article-image-caption").textContent = item.place;
  _("related-file-title").textContent = item.relatedFile || item.place;

  // Gövde
  let body = "";
  (item.sections || []).forEach(sec => {
    body += `<h2 id="${sec.id}">${sec.title}</h2><p>${sec.content}</p>`;
  });
  _("article-body").innerHTML = body;

  // TOC
  _("toc-list").innerHTML = (item.sections || []).map(sec =>
    `<div class="toc-item" data-target="${sec.id}">${sec.title}</div>`
  ).join("");
  document.querySelectorAll(".toc-item").forEach(el => {
    el.onclick = () => {
      const t = document.getElementById(el.dataset.target);
      if (t) t.scrollIntoView({ behavior: "smooth" });
      document.querySelectorAll(".toc-item").forEach(x => x.classList.remove("active"));
      el.classList.add("active");
    };
  });

  // İlgili maddeler
  _("related-articles").innerHTML = (item.related || []).map(r =>
    `<div class="related-item"><h4>${r.title}</h4><p>${r.text}</p></div>`
  ).join("");

  // Videolar
  const vids = item.videos || [];
  _("video-section").style.display = vids.length ? "block" : "none";
  _("video-playlist").innerHTML = vids.map(id =>
    `<div class="video-item"><iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe></div>`
  ).join("");

  // Görseller / Haritalar
  const media = item.media || [];
  _("media-box").style.display = media.length ? "block" : "none";
  _("media-grid").innerHTML = media.map(m =>
    `<img src="${m.url}" alt="${m.caption}" title="${m.caption}">`
  ).join("");

  document.getElementById("slider-view").classList.add("hidden");
  document.getElementById("article-view").classList.remove("hidden");
  document.querySelector(".article-main").scrollTop = 0;
}

function closeArticle() {
  document.getElementById("article-view").classList.add("hidden");
  document.getElementById("slider-view").classList.remove("hidden");
}

/* ========== TEMA ========== */
_("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  document.querySelector(".icon-sun").classList.toggle("hidden", isLight);
  document.querySelector(".icon-moon").classList.toggle("hidden", !isLight);
});

/* ========== EVENTLER ========== */
document.querySelector(".arrow-left").addEventListener("click", () => { if (clicks === 0) { clicks = 1; step(); } });
document.querySelector(".arrow-right").addEventListener("click", () => { if (clicks === 0) { clicks = 1; step(); } });
data.forEach((_, i) => document.getElementById(`card${i}`).addEventListener("click", () => openArticle(i)));
document.querySelectorAll(".discover").forEach(btn => btn.addEventListener("click", () => openArticle(order[0])));
_("back-btn").addEventListener("click", closeArticle);

async function start() {
  try {
    await Promise.all(data.map(d => new Promise((res, rej) => {
      const img = new Image(); img.onload = res; img.onerror = res; img.src = d.image;
    })));
  } catch(e) {}
  init();
}
start();
