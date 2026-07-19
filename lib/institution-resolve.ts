import type { AnnouncementDependent, Institution } from "@/types";

const DEFAULT_DURATION_SEC = 180;
/** Generic benchmark (Adalet Bakanlığı flagship exam) reused for exam-readiness estimates elsewhere. */
export const DEFAULT_MIN_NET_WORDS_PER_MIN = 90;
const DEFAULT_PENALTY_PER_ERROR = 2;
const DEFAULT_ALLOW_BACKSPACE = false;

function resolve<T>(value: AnnouncementDependent<T>, fallback: T): { value: T; isDefault: boolean } {
  return value === "ilana göre değişir" ? { value: fallback, isDefault: true } : { value, isDefault: false };
}

/**
 * Resolves an institution's announcement-dependent fields to concrete
 * numbers usable by the typing engine, falling back to generic exam
 * defaults when the ilan-specific value is unknown. Callers should surface
 * `isDefault` flags to the user alongside INSTITUTION_DISCLAIMER.
 */
export function resolveInstitutionExamConfig(institution: Institution) {
  const duration = resolve(institution.durationSec, DEFAULT_DURATION_SEC);
  const minNetWords = resolve(institution.minNetWordsPerMin, DEFAULT_MIN_NET_WORDS_PER_MIN);
  const penalty = resolve(institution.penaltyPerError, DEFAULT_PENALTY_PER_ERROR);
  const allowBackspace = resolve(institution.allowBackspace, DEFAULT_ALLOW_BACKSPACE);

  return {
    durationSec: duration.value,
    minNetWordsPerMin: minNetWords.value,
    penaltyPerError: penalty.value,
    allowBackspace: allowBackspace.value,
    usedDefaults: [
      duration.isDefault && "süre",
      minNetWords.isDefault && "asgari hız",
      penalty.isDefault && "hata katsayısı",
      allowBackspace.isDefault && "geri silme kuralı",
    ].filter((v): v is string => Boolean(v)),
  };
}
