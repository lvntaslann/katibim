export type Finger =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "left-thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky"
  | "right-thumb";

export type Hand = "left" | "right";

/** One physical key: unshifted char, shifted char, and optional AltGr char. */
export interface KeyChars {
  base: string;
  shift: string;
  altGr?: string;
}

/**
 * Maps a physical key (event.code) to the characters it produces on a given
 * Turkish layout. Only printable/character-producing keys are listed.
 */
export type LayoutKeyMap = Record<string, KeyChars>;

/** Physical key geometry for rendering the on-screen keyboard, layout-agnostic. */
export interface KeyGeometry {
  code: string;
  /** Relative width, 1 = one standard keycap unit. */
  width: number;
  row: number;
}
