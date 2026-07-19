import type { LayoutKeyMap } from "./types";

/**
 * Turkish F keyboard layout (TS 2117 standard, designed 1955 by İhsan Yener),
 * sourced from Microsoft's KBDTUF layout reference
 * (learn.microsoft.com/en-us/globalization/keyboards/kbdtuf). Unlike the Q
 * layout, F rearranges nearly all letters by Turkish letter frequency; only
 * the digit row's shift symbols match the Q layout's national standard.
 * q, w, x are not part of the Turkish alphabet and sit on low-priority keys
 * (bracket positions and the ISO "Backslash" key) for typing foreign words.
 * AltGr symbol values beyond the core Turkish letters are best-effort and
 * not exercised by the typing trainer's exam/lesson content.
 */
export const F_KLAVYE: LayoutKeyMap = {
  Backquote: { base: "+", shift: "*" },
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
  Minus: { base: "/", shift: "?" },
  Equal: { base: "-", shift: "_" },

  KeyQ: { base: "f", shift: "F" },
  KeyW: { base: "g", shift: "G" },
  KeyE: { base: "ğ", shift: "Ğ" },
  KeyR: { base: "ı", shift: "I" },
  KeyT: { base: "o", shift: "O" },
  KeyY: { base: "d", shift: "D" },
  KeyU: { base: "r", shift: "R" },
  KeyI: { base: "n", shift: "N" },
  KeyO: { base: "h", shift: "H" },
  KeyP: { base: "p", shift: "P" },
  BracketLeft: { base: "q", shift: "Q" },
  BracketRight: { base: "w", shift: "W" },

  KeyA: { base: "u", shift: "U" },
  KeyS: { base: "i", shift: "İ" },
  KeyD: { base: "e", shift: "E", altGr: "€" },
  KeyF: { base: "a", shift: "A" },
  KeyG: { base: "ü", shift: "Ü" },
  KeyH: { base: "t", shift: "T", altGr: "₺" },
  KeyJ: { base: "k", shift: "K" },
  KeyK: { base: "m", shift: "M" },
  KeyL: { base: "l", shift: "L" },
  Semicolon: { base: "y", shift: "Y" },
  Quote: { base: "ş", shift: "Ş" },
  Backslash: { base: "x", shift: "X" },

  IntlBackslash: { base: "<", shift: ">" },
  KeyZ: { base: "j", shift: "J" },
  KeyX: { base: "ö", shift: "Ö" },
  KeyC: { base: "v", shift: "V" },
  KeyV: { base: "c", shift: "C" },
  KeyB: { base: "ç", shift: "Ç" },
  KeyN: { base: "z", shift: "Z" },
  KeyM: { base: "s", shift: "S" },
  Comma: { base: "b", shift: "B" },
  Period: { base: ".", shift: "." },
  Slash: { base: ",", shift: "," },

  Space: { base: " ", shift: " " },
};
