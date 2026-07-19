import type { KeyGeometry } from "./types";

/**
 * Physical key geometry for a Turkish ISO-105 keyboard, row/width only
 * (no characters here — see f-klavye.ts / q-klavye.ts for that). Shared by
 * both layouts since the physical board is identical.
 */
export const KEYBOARD_GEOMETRY: KeyGeometry[] = [
  // Row 0: number row
  { code: "Backquote", width: 1, row: 0 },
  { code: "Digit1", width: 1, row: 0 },
  { code: "Digit2", width: 1, row: 0 },
  { code: "Digit3", width: 1, row: 0 },
  { code: "Digit4", width: 1, row: 0 },
  { code: "Digit5", width: 1, row: 0 },
  { code: "Digit6", width: 1, row: 0 },
  { code: "Digit7", width: 1, row: 0 },
  { code: "Digit8", width: 1, row: 0 },
  { code: "Digit9", width: 1, row: 0 },
  { code: "Digit0", width: 1, row: 0 },
  { code: "Minus", width: 1, row: 0 },
  { code: "Equal", width: 1, row: 0 },
  { code: "Backspace", width: 2, row: 0 },

  // Row 1: top letter row
  { code: "Tab", width: 1.5, row: 1 },
  { code: "KeyQ", width: 1, row: 1 },
  { code: "KeyW", width: 1, row: 1 },
  { code: "KeyE", width: 1, row: 1 },
  { code: "KeyR", width: 1, row: 1 },
  { code: "KeyT", width: 1, row: 1 },
  { code: "KeyY", width: 1, row: 1 },
  { code: "KeyU", width: 1, row: 1 },
  { code: "KeyI", width: 1, row: 1 },
  { code: "KeyO", width: 1, row: 1 },
  { code: "KeyP", width: 1, row: 1 },
  { code: "BracketLeft", width: 1, row: 1 },
  { code: "BracketRight", width: 1, row: 1 },

  // Row 2: home row
  { code: "CapsLock", width: 1.75, row: 2 },
  { code: "KeyA", width: 1, row: 2 },
  { code: "KeyS", width: 1, row: 2 },
  { code: "KeyD", width: 1, row: 2 },
  { code: "KeyF", width: 1, row: 2 },
  { code: "KeyG", width: 1, row: 2 },
  { code: "KeyH", width: 1, row: 2 },
  { code: "KeyJ", width: 1, row: 2 },
  { code: "KeyK", width: 1, row: 2 },
  { code: "KeyL", width: 1, row: 2 },
  { code: "Semicolon", width: 1, row: 2 },
  { code: "Quote", width: 1, row: 2 },
  { code: "Backslash", width: 1, row: 2 },
  { code: "Enter", width: 1.25, row: 2 },

  // Row 3: bottom letter row (ISO board: IntlBackslash left of Z)
  { code: "ShiftLeft", width: 1.25, row: 3 },
  { code: "IntlBackslash", width: 1, row: 3 },
  { code: "KeyZ", width: 1, row: 3 },
  { code: "KeyX", width: 1, row: 3 },
  { code: "KeyC", width: 1, row: 3 },
  { code: "KeyV", width: 1, row: 3 },
  { code: "KeyB", width: 1, row: 3 },
  { code: "KeyN", width: 1, row: 3 },
  { code: "KeyM", width: 1, row: 3 },
  { code: "Comma", width: 1, row: 3 },
  { code: "Period", width: 1, row: 3 },
  { code: "Slash", width: 1, row: 3 },
  { code: "ShiftRight", width: 2.25, row: 3 },

  // Row 4: space row
  { code: "ControlLeft", width: 1.25, row: 4 },
  { code: "AltLeft", width: 1.25, row: 4 },
  { code: "Space", width: 6.25, row: 4 },
  { code: "AltRight", width: 1.25, row: 4 },
  { code: "ControlRight", width: 1.25, row: 4 },
];
