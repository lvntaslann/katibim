import type { Institution } from "@/types";
import { INSTITUTION_DISCLAIMER } from "@/types";

/**
 * Seed institution records. Numeric exam parameters change per ilan
 * (announcement) — fields marked "ilana göre değişir" are intentionally
 * not guessed; see `sourceNote` and `uncertainFields` on each record, and
 * always show INSTITUTION_DISCLAIMER next to this data in the UI. Add new
 * institutions by appending an object with a unique `id`; see README.md.
 */
export const INSTITUTIONS: Institution[] = [
  {
    id: "adalet-bakanligi-zabit-katibi",
    name: "Adalet Bakanlığı",
    category: "adalet-bakanligi",
    roleTitle: "Zabıt Kâtibi / Mübaşir",
    acceptedLayouts: "both",
    durationSec: 180,
    minNetWordsPerMin: 90,
    penaltyPerError: "ilana göre değişir",
    textDelivery: "dikte",
    allowBackspace: false,
    uncertainFields: ["penaltyPerError", "minNetWordsPerMin"],
    sourceNote:
      "3 dakikalık uygulamalı sınav ve ~90 net kelime eşiği yaygın uygulamadır (özellikle F-klavye adayları için); F-klavye kullanan adaylara bazı ilanlarda ayrı/avantajlı bir değerlendirme uygulanabilir. Kesin rakamlar ilandan ilana değişir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "yargitay-katip",
    name: "Yargıtay",
    category: "yuksek-yargi",
    roleTitle: "Yazı İşleri Müdürü / Kâtip",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "dikte",
    allowBackspace: false,
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError"],
    sourceNote:
      "Yüksek yargı organlarının uygulamalı klavye sınavları genel olarak Adalet Bakanlığı katiplik sınavına benzer usul izler; ilan bazında farklılık gösterebilir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "danistay-katip",
    name: "Danıştay",
    category: "yuksek-yargi",
    roleTitle: "Kâtip / Büro Personeli",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "dikte",
    allowBackspace: false,
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError"],
    sourceNote: "Danıştay personel alım ilanlarındaki uygulamalı sınav usulü ilana göre belirlenir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "anayasa-mahkemesi-katip",
    name: "Anayasa Mahkemesi",
    category: "yuksek-yargi",
    roleTitle: "Raportör Yardımcısı / Kâtip",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "printed",
    allowBackspace: "ilana göre değişir",
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError", "allowBackspace"],
    sourceNote: "Anayasa Mahkemesi personel alımlarında uygulamalı sınav şartları ilan metninde belirtilir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "sayistay-katip",
    name: "Sayıştay",
    category: "yuksek-yargi",
    roleTitle: "Kâtip / Büro Personeli",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "dikte",
    allowBackspace: false,
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError"],
    sourceNote: "Sayıştay personel alım ilanlarındaki uygulamalı sınav usulü ilana göre belirlenir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "universite-sozlesmeli-buro",
    name: "Devlet Üniversiteleri",
    category: "universite",
    roleTitle: "Sözleşmeli Büro Personeli / Kâtip",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "printed",
    allowBackspace: "ilana göre değişir",
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError", "allowBackspace"],
    sourceNote:
      "Üniversitelerin sözleşmeli büro personeli/kâtip alımlarında uygulamalı sınav şartı ve ölçütleri kuruma ve ilana göre değişir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "belediye-buro-personeli",
    name: "Belediyeler",
    category: "belediye-bakanlik-kit",
    roleTitle: "Kâtip / Büro Personeli",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "printed",
    allowBackspace: "ilana göre değişir",
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError", "allowBackspace"],
    sourceNote: "Belediye personel alımlarında uygulamalı klavye sınavı şartı ilana göre değişir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
  {
    id: "bakanlik-kit-buro-personeli",
    name: "Bakanlıklar / KİT'ler",
    category: "belediye-bakanlik-kit",
    roleTitle: "Kâtip / Büro Personeli",
    acceptedLayouts: "both",
    durationSec: "ilana göre değişir",
    minNetWordsPerMin: "ilana göre değişir",
    penaltyPerError: "ilana göre değişir",
    textDelivery: "printed",
    allowBackspace: "ilana göre değişir",
    uncertainFields: ["durationSec", "minNetWordsPerMin", "penaltyPerError", "allowBackspace"],
    sourceNote: "Bakanlık ve KİT personel alımlarında uygulamalı klavye sınavı şartı ilana göre değişir.",
    disclaimer: INSTITUTION_DISCLAIMER,
  },
];

export function getInstitutionById(id: string): Institution | undefined {
  return INSTITUTIONS.find((i) => i.id === id);
}
