/**
 * ============================================================
 * DERS DOSYASI KILAVUZU (arapca.js örneği)
 * ============================================================
 * Her ders = bir JS dosyası (js/lessons/ID.js)
 *
 * Yapı:
 * window.LESSONS = window.LESSONS || {};
 * window.LESSONS["arapca"] = {
 *   id: "arapca",
 *   title: "Arapça",
 *   description: "Kısa açıklama (opsiyonel)",
 *   books: [
 *     {
 *       id: "kitap-1",
 *       title: "1.Kitap",
 *       units: [
 *         {
 *           id: "u1",
 *           title: "1.Ünite Ayrık Özne Zamirleri",
 *           content: "Buraya HTML veya düz metin notunu yaz. <p>...</p> kullanabilirsin.",
 *           // İsteğe bağlı:
 *           // summary: "Kısa özet",
 *           // videos: ["youtubeVideoId"],
 *           // media: [{ url: "...", caption: "..." }]
 *         }
 *       ]
 *     }
 *   ]
 * };
 *
 * Yeni ünite eklemek:
 * 1) İlgili book.units dizisine yeni obje ekle
 * 2) id benzersiz olsun (u11, u12 ...)
 * 3) title ve content doldur
 *
 * Yeni kitap eklemek:
 * books dizisine yeni { id, title, units: [] } ekle
 * ============================================================
 */

window.LESSONS = window.LESSONS || {};

window.LESSONS["arapca"] = {
  id: "arapca",
  title: "Arapça",
  description: "İlahiyat fakülteleri temel Arapça gramer ve dil bilgisi notları.",
  books: [
    {
      id: "kitap-1",
      title: "1.Kitap",
      units: [
        { id: "u1",  title: "1.Ünite Ayrık Özne Zamirleri",     content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u2",  title: "2.Ünite Fiiller",                  content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u3",  title: "3.Ünite İsimler (Tekil-İkil-Çoğul)", content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u4",  title: "4.Ünite Fiil Cümlesi",             content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u5",  title: "5.Ünite İsim Cümlesi",             content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u6",  title: "6.Ünite İşaret Sıfatları",         content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u7",  title: "7.Ünite İsim Tamlaması",           content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u8",  title: "8.Ünite Sıfat Tamlaması",          content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u9",  title: "9.Ünite Fiillerde Emir, Nehiy",     content: "<p>Bu üniteye notlarını buraya yaz.</p>" },
        { id: "u10", title: "10.Ünite Emr-i Gaib, Nehy-i Gaib", content: "<p>Bu üniteye notlarını buraya yaz.</p>" }
      ]
    },
    {
      id: "kitap-2",
      title: "2.Kitap",
      units: [
        { id: "u1",  title: "1.Ünite Muda'af Fiiller",              content: "<p>Not...</p>" },
        { id: "u2",  title: "2.Ünite Mehmûz Fiiller",               content: "<p>Not...</p>" },
        { id: "u3",  title: "3.Ünite Misâl Fiiller",                content: "<p>Not...</p>" },
        { id: "u4",  title: "4.Ünite Ecvef Fiiller",                content: "<p>Not...</p>" },
        { id: "u5",  title: "5.Ünite Nâkıs Fiiller",                content: "<p>Not...</p>" },
        { id: "u6",  title: "6.Ünite Kâne ve Grubu",                content: "<p>Not...</p>" },
        { id: "u7",  title: "7.Ünite İnne ve Grubu",                content: "<p>Not...</p>" },
        { id: "u8",  title: "8.Ünite Sülâsî Mezîd Fiiller-1",       content: "<p>Not...</p>" },
        { id: "u9",  title: "9.Ünite Sülâsî Mezîd Fiiller-2",       content: "<p>Not...</p>" },
        { id: "u10", title: "10.Ünite S.Mücerred ve S.Mezîd Fiiller", content: "<p>Not...</p>" }
      ]
    },
    {
      id: "kitap-3",
      title: "3.Kitap",
      units: [
        { id: "u1",  title: "1.Ünite Arapçada Zamanlar",              content: "<p>Not...</p>" },
        { id: "u2",  title: "2.Ünite Sülasî Fiiller: Mechul Yapı",    content: "<p>Not...</p>" },
        { id: "u3",  title: "3.Ünite Sül. Mezd. Fiil Edlg. Mechul Yapı", content: "<p>Not...</p>" },
        { id: "u4",  title: "4.Ünite İsm-i Mevsuller",                content: "<p>Not...</p>" },
        { id: "u5",  title: "5.Ünite Arapçada Nasb Edatları",         content: "<p>Not...</p>" },
        { id: "u6",  title: "6.Ünite Cezm Edatları",                  content: "<p>Not...</p>" },
        { id: "u7",  title: "7.Ünite Şart Edatları",                  content: "<p>Not...</p>" },
        { id: "u8",  title: "8.Ünite Atıf Edatları",                  content: "<p>Not...</p>" },
        { id: "u9",  title: "9.Ünite Mef'ûlun Mutlak",                content: "<p>Not...</p>" },
        { id: "u10", title: "10.Ünite Mef'ûlun Leh",                  content: "<p>Not...</p>" }
      ]
    },
    {
      id: "kitap-4",
      title: "4.Kitap",
      units: [
        { id: "u1",  title: "1.Ünite Arapçada Sayılar 1",                    content: "<p>Not...</p>" },
        { id: "u2",  title: "2.Ünite Arapçada Sayılar 2",                    content: "<p>Not...</p>" },
        { id: "u3",  title: "3.Ünite İsm-i Mek./Zam./Alet/Tasg/Nisb.",        content: "<p>Not...</p>" },
        { id: "u4",  title: "4.Ünite Beş İsim",                              content: "<p>Not...</p>" },
        { id: "u5",  title: "5.Ünite Maksur, Menkus, Memdud İsim",           content: "<p>Not...</p>" },
        { id: "u6",  title: "6.Ünite Garu'l-Munsarıf",                       content: "<p>Not...</p>" },
        { id: "u7",  title: "7.Ünite Ef'âlu'l-Mukarebe/Reca/Şurû",           content: "<p>Not...</p>" },
        { id: "u8",  title: "8.Ünite Hâl",                                   content: "<p>Not...</p>" },
        { id: "u9",  title: "9.Ünite İstisnâ",                               content: "<p>Not...</p>" },
        { id: "u10", title: "10.Ünite Munâdâ",                               content: "<p>Not...</p>" }
      ]
    }
  ]
};
