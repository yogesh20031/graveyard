// Theme registry. Each entry maps to a `[data-theme="<id>"]` token block in
// globals.css — adding a theme means one new block there plus one entry here.
// A future user-facing picker reads this registry and flips the attribute.

export type ThemeId = "graveyard";

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  description: string;
};

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  graveyard: {
    id: "graveyard",
    label: "Graveyard",
    description:
      "A moonlit night outside the cemetery gates — deep night blues, pale bone text, and warm lantern amber.",
  },
};

export const DEFAULT_THEME: ThemeId = "graveyard";
