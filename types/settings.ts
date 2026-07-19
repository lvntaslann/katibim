import type { KeyboardLayout } from "./institution";

export type Theme = "light" | "dark" | "system";

export interface Settings {
  theme: Theme;
  defaultLayout: KeyboardLayout;
  overlayEnabled: boolean;
  overlayOpacity: number;
  overlayDocked: boolean;
  sound: boolean;
  reducedMotion: boolean;
  allowBackspaceDefault: boolean;
  stopOnError: boolean;
  blindMode: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  defaultLayout: "F",
  overlayEnabled: true,
  overlayOpacity: 0.85,
  overlayDocked: true,
  sound: false,
  reducedMotion: false,
  allowBackspaceDefault: true,
  stopOnError: false,
  blindMode: false,
};
