import type { LayoutKeyMap } from "./types";

/**
 * Turkish Q (QWERTY) keyboard layout, sourced from Microsoft's KBDTUQ
 * layout reference (learn.microsoft.com/en-us/globalization/keyboards/kbdtuq).
 * Letter positions match US QWERTY except: BracketLeft/Right -> ğ/ü,
 * Semicolon -> ş, Quote -> i/İ (dotted pair), KeyI -> ı/I (dotless pair,
 * matching the well-known Turkish "dotted/dotless I" case-folding rule),
 * Comma -> ö, Period -> ç.
 * AltGr symbol values beyond the core Turkish letters are best-effort and
 * not exercised by the typing trainer's exam/lesson content.
 */
export const Q_KLAVYE: LayoutKeyMap = {
  Backquote: { base: '"', shift: '"' },
  Digit1: { base: "1", shift: "!" },
  Digit2: { base: "2", shift: '"' },
  Digit3: { base: "3", shift: "^" },
  Digit4: { base: "4", shift: "$" },
  Digit5: { base: "5", shift: "%" },
  Digit6: { base: "6", shift: "&" },
  Digit7: { base: "7", shift: "'" },
  Digit8: { base: "8", shift: "(" },
  Digit9: { base: "9", shift: ")" },
  Digit0: { base: "0", shift: "=" },
  Minus: { base: "*", shift: "?" },
  Equal: { base: "-", shift: "_" },

  KeyQ: { base: "q", shift: "Q" },
  KeyW: { base: "w", shift: "W" },
  KeyE: { base: "e", shift: "E", altGr: "€" },
  KeyR: { base: "r", shift: "R" },
  KeyT: { base: "t", shift: "T", altGr: "₺" },
  KeyY: { base: "y", shift: "Y" },
  KeyU: { base: "u", shift: "U" },
  KeyI: { base: "ı", shift: "I", altGr: "i" },
  KeyO: { base: "o", shift: "O" },
  KeyP: { base: "p", shift: "P" },
  BracketLeft: { base: "ğ", shift: "Ğ" },
  BracketRight: { base: "ü", shift: "Ü" },

  KeyA: { base: "a", shift: "A" },
  KeyS: { base: "s", shift: "S", altGr: "ß" },
  KeyD: { base: "d", shift: "D" },
  KeyF: { base: "f", shift: "F" },
  KeyG: { base: "g", shift: "G" },
  KeyH: { base: "h", shift: "H" },
  KeyJ: { base: "j", shift: "J" },
  KeyK: { base: "k", shift: "K" },
  KeyL: { base: "l", shift: "L" },
  Semicolon: { base: "ş", shift: "Ş" },
  Quote: { base: "i", shift: "İ" },
  // ISO "Backslash" key (small key between Quote and Enter, distinct from
  // IntlBackslash below). Comma placement confirmed by source; shifted
  // semicolon is a reasonable convention, not independently confirmed.
  Backslash: { base: ",", shift: ";" },

  IntlBackslash: { base: "<", shift: ">" },
  KeyZ: { base: "z", shift: "Z" },
  KeyX: { base: "x", shift: "X" },
  KeyC: { base: "c", shift: "C" },
  KeyV: { base: "v", shift: "V" },
  KeyB: { base: "b", shift: "B" },
  KeyN: { base: "n", shift: "N" },
  KeyM: { base: "m", shift: "M" },
  Comma: { base: "ö", shift: "Ö" },
  Period: { base: "ç", shift: "Ç" },
  Slash: { base: ".", shift: ":" },

  Space: { base: " ", shift: " " },
};
