import type { Finger, Hand } from "./types";

/**
 * Physical key (event.code) -> touch-typing finger. This is layout-agnostic:
 * finger assignment follows hand ergonomics/physical column, not which
 * character a key produces, so F and Q layouts share this map.
 */
export const FINGER_MAP: Record<string, Finger> = {
  Backquote: "left-pinky",
  Digit1: "left-pinky",
  Digit2: "left-ring",
  Digit3: "left-middle",
  Digit4: "left-index",
  Digit5: "left-index",
  Digit6: "right-index",
  Digit7: "right-index",
  Digit8: "right-middle",
  Digit9: "right-ring",
  Digit0: "right-pinky",
  Minus: "right-pinky",
  Equal: "right-pinky",

  KeyQ: "left-pinky",
  KeyW: "left-ring",
  KeyE: "left-middle",
  KeyR: "left-index",
  KeyT: "left-index",
  KeyY: "right-index",
  KeyU: "right-index",
  KeyI: "right-middle",
  KeyO: "right-ring",
  KeyP: "right-pinky",
  BracketLeft: "right-pinky",
  BracketRight: "right-pinky",

  KeyA: "left-pinky",
  KeyS: "left-ring",
  KeyD: "left-middle",
  KeyF: "left-index",
  KeyG: "left-index",
  KeyH: "right-index",
  KeyJ: "right-index",
  KeyK: "right-middle",
  KeyL: "right-ring",
  Semicolon: "right-pinky",
  Quote: "right-pinky",
  Backslash: "right-pinky",

  IntlBackslash: "left-pinky",
  KeyZ: "left-pinky",
  KeyX: "left-ring",
  KeyC: "left-middle",
  KeyV: "left-index",
  KeyB: "left-index",
  KeyN: "right-index",
  KeyM: "right-index",
  Comma: "right-middle",
  Period: "right-ring",
  Slash: "right-pinky",

  Space: "left-thumb",
};

export function fingerToHand(finger: Finger): Hand {
  return finger.startsWith("left") ? "left" : "right";
}

/** Display labels in Turkish for the finger legend. */
export const FINGER_LABELS_TR: Record<Finger, string> = {
  "left-pinky": "Sol serçe",
  "left-ring": "Sol yüzük",
  "left-middle": "Sol orta",
  "left-index": "Sol işaret",
  "left-thumb": "Sol başparmak",
  "right-index": "Sağ işaret",
  "right-middle": "Sağ orta",
  "right-ring": "Sağ yüzük",
  "right-pinky": "Sağ serçe",
  "right-thumb": "Sağ başparmak",
};
