import type { PracticeText } from "@/types";

/**
 * Seed practice texts. Add new ones by appending an object with a unique
 * `id`, matching the PracticeText shape in types/practice-text.ts. See
 * README.md for the full guide.
 */
export const PRACTICE_TEXTS: PracticeText[] = [
  {
    id: "genel-01",
    category: "genel",
    difficulty: "baslangic",
    title: "Günlük Yazışma",
    body: "Merhaba, bugün size kısa bir mesaj yazmak istedim. Umarım işleriniz yolundadır ve gününüz güzel geçiyordur. Yakında görüşmek dileğiyle, iyi çalışmalar.",
  },
  {
    id: "genel-02",
    category: "genel",
    difficulty: "orta",
    title: "Genel Metin",
    body: "Türkiye'de kamu kurumlarına personel alımı, genellikle merkezi sınavlar ve kurum içi mülakatlar yoluyla gerçekleştirilir. Adayların hem yazılı sınavda hem de uygulamalı sınavda başarılı olması beklenir.",
  },
  {
    id: "hukuki-01",
    category: "hukuki",
    difficulty: "ileri",
    title: "Mahkeme Tutanağı Örneği",
    body: "Davacı vekili, duruşmada beyanda bulunarak müvekkilinin taleplerini tekrar etmiş, davalı tarafın ise süresinde cevap dilekçesi sunmadığını belirtmiştir. Mahkeme, tarafların beyanlarını dinledikten sonra duruşmayı bir sonraki celseye bırakmıştır.",
  },
  {
    id: "resmi-01",
    category: "resmi",
    difficulty: "orta",
    title: "Resmî Yazışma Örneği",
    body: "İlgi yazınız incelenmiş olup, konu hakkında gerekli işlemlerin başlatıldığı ve sonucun tarafınıza en kısa sürede bildirileceği hususu bilgilerinize sunulur.",
  },
  {
    id: "genel-03",
    category: "genel",
    difficulty: "baslangic",
    title: "Kısa Tanıtım",
    body: "Bu platform, kamu kurumlarının uyguladığı klavye sınavlarına hazırlanan adaylar için tasarlanmıştır. Hem F hem de Q klavye ile pratik yapabilirsiniz.",
  },
  {
    id: "genel-04",
    category: "genel",
    difficulty: "orta",
    title: "Zaman Yönetimi",
    body: "Sınava hazırlık sürecinde düzenli çalışma programı oluşturmak, hem hızınızı hem de doğruluğunuzu artırmanın en etkili yoludur. Kısa aralıklarla sık tekrar yapmak, uzun ve seyrek çalışmaktan daha verimlidir.",
  },
  {
    id: "genel-05",
    category: "genel",
    difficulty: "ileri",
    title: "Motivasyon",
    body: "Uygulamalı sınavlarda başarı, yalnızca hız değil aynı zamanda doğruluk ve stres yönetimi ile de yakından ilgilidir. Düzenli pratik yaparak hem parmaklarınızı hem de zihninizi sınav temposuna alıştırabilirsiniz.",
  },
  {
    id: "genel-06",
    category: "genel",
    difficulty: "orta",
    title: "Klavye Ergonomisi",
    body: "Doğru oturuş pozisyonu, bilek açısı ve ekran mesafesi, uzun süreli yazım sırasında yorgunluğu azaltır. Omuzlarınızı gevşek tutarak ve gözlerinizi ekrandan ayırmadan yazmaya çalışın.",
  },
  {
    id: "hukuki-02",
    category: "hukuki",
    difficulty: "ileri",
    title: "Dilekçe Örneği",
    body: "Yukarıda belirtilen nedenlerle, müvekkilim hakkında açılan davanın reddine, yargılama giderleri ile vekalet ücretinin karşı tarafa yükletilmesine karar verilmesini saygılarımla arz ve talep ederim.",
  },
  {
    id: "hukuki-03",
    category: "hukuki",
    difficulty: "ileri",
    title: "Duruşma Zaptı",
    body: "Celse açıldı, taraflar hazır bulundu. Hakim tarafından duruşmaya devam olunacağı ve tanıkların bir sonraki celsede dinleneceği tutanağa geçirildi. Duruşma saat on dörtte ertelendi.",
  },
  {
    id: "hukuki-04",
    category: "hukuki",
    difficulty: "orta",
    title: "İcra Takip Talebi",
    body: "Alacaklı vekili tarafından borçlu aleyhine icra takibi başlatılmış olup, ödeme emrinin borçluya usulüne uygun şekilde tebliğ edilmesi talep olunur.",
  },
  {
    id: "resmi-02",
    category: "resmi",
    difficulty: "orta",
    title: "Bilgi Edinme Başvurusu",
    body: "Kurumunuzdan talep ettiğim bilgi ve belgelerin, Bilgi Edinme Hakkı Kanunu çerçevesinde tarafıma en kısa sürede iletilmesini saygılarımla rica ederim.",
  },
  {
    id: "resmi-03",
    category: "resmi",
    difficulty: "ileri",
    title: "Genelge Örneği",
    body: "İlgili birimlerce yürütülen iş ve işlemlerin, yürürlükteki mevzuata uygun şekilde ve gecikmeye mahal verilmeksizin sonuçlandırılması hususunda gereğinin yapılması rica olunur.",
  },
  {
    id: "resmi-04",
    category: "resmi",
    difficulty: "baslangic",
    title: "Kısa Bildirim",
    body: "Söz konusu evrak incelenmek üzere ilgili birime gönderilmiştir. Sonuç hakkında ayrıca bilgi verilecektir.",
  },
  {
    id: "hukuki-05",
    category: "hukuki",
    difficulty: "baslangic",
    title: "Kısa Hukuki İfade",
    body: "Taraflar arasındaki uyuşmazlığın giderilmesi amacıyla arabuluculuk yoluna başvurulması uygun görülmüştür.",
  },
];

export function getPracticeTextById(id: string): PracticeText | undefined {
  return PRACTICE_TEXTS.find((t) => t.id === id);
}

/**
 * Concatenates multiple seed texts into one long body, long enough that a
 * timed exam simulation runs out the clock instead of hitting end-of-text.
 * Prefers the given category (falls back to all texts) to roughly match an
 * institution's dikte/printed material style.
 */
export function buildExamText(id: string, category?: PracticeText["category"]): PracticeText {
  const pool = category ? PRACTICE_TEXTS.filter((t) => t.category === category) : PRACTICE_TEXTS;
  const source = pool.length > 0 ? pool : PRACTICE_TEXTS;
  const body = [...source, ...source].map((t) => t.body).join(" ");
  return {
    id,
    category: category ?? "genel",
    difficulty: "ileri",
    title: "Sınav Metni",
    body,
  };
}
