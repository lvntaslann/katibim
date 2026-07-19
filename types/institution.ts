export type KeyboardLayout = "F" | "Q";

export type AcceptedLayout = KeyboardLayout | "both";

export type InstitutionCategory =
  | "adalet-bakanligi"
  | "yuksek-yargi"
  | "universite"
  | "belediye-bakanlik-kit";

export type TextDelivery = "dikte" | "printed";

/**
 * A value that may not be precisely known because it changes per ilan
 * (announcement). Use "ilana göre değişir" instead of guessing a number.
 */
export type AnnouncementDependent<T> = T | "ilana göre değişir";

export interface Institution {
  id: string;
  name: string;
  category: InstitutionCategory;
  /** Short description of the role(s) this record covers, e.g. "Zabıt Kâtibi / Mübaşir". */
  roleTitle: string;
  acceptedLayouts: AcceptedLayout;
  durationSec: AnnouncementDependent<number>;
  /** Net kelime/dakika (5 karakter = 1 kelime kuralına göre). */
  minNetWordsPerMin: AnnouncementDependent<number>;
  /** Net puan hesaplamasında hata başına düşülen kelime/puan katsayısı. */
  penaltyPerError: AnnouncementDependent<number>;
  textDelivery: TextDelivery;
  allowBackspace: AnnouncementDependent<boolean>;
  /** Fields in this record whose exact values are uncertain / announcement-dependent. */
  uncertainFields: string[];
  /** Where this information was sourced from, or a note on how to verify it. */
  sourceNote: string;
  /** Always shown alongside this record in the UI. */
  disclaimer: string;
}

export const INSTITUTION_DISCLAIMER =
  "Kesin bilgi için ilgili kurumun güncel ilan metnini kontrol ediniz.";
