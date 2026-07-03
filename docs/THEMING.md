# Theming

The site is built so a visitor can eventually pick their own theme
(Phase 5). Components never reference raw colors — only semantic tokens.

## How it works

1. `src/app/globals.css` defines each theme as one `[data-theme="…"]` block
   of CSS variables.
2. A `@theme inline` block maps those variables to Tailwind utilities, so
   `bg-background`, `text-foreground`, `text-accent`, `fill-surface`, etc.
   automatically follow the active theme.
3. `src/app/layout.tsx` sets `data-theme={DEFAULT_THEME}` on `<html>`.
4. `src/themes/themes.ts` is the registry (`ThemeId`, `THEMES`,
   `DEFAULT_THEME`) a future theme-picker UI will read from.

Switching themes at runtime is just flipping the `data-theme` attribute —
no component re-renders with new props, no styled-components, no context.

## Tokens

| Token             | Tailwind usage                        | Graveyard value | Role                                    |
| ----------------- | ------------------------------------- | --------------- | --------------------------------------- |
| `--background`    | `bg-background`                        | `#0d1118`       | page background, deep night             |
| `--surface`       | `bg-surface`, `fill-surface`           | `#060810`       | darker night — ground, silhouettes, panels |
| `--foreground`    | `text-foreground`, `fill-foreground`   | `#e8e2d3`       | pale bone / moonlight text              |
| `--accent`        | `text-accent`, `bg-accent`             | `#b8823a`       | burnt lantern amber — CTAs, highlights  |
| `--accent-bright` | `bg-accent-bright`, `text-accent-bright` | `#d9a45b`     | lit-up amber — hovers, lantern flames, glowing eyes |

Shades come from opacity modifiers (`text-foreground/60`,
`fill-foreground/10`), so the palette stays at 2–3 real colors.

Non-color tokens: `--font-display` (Cinzel, headings/epitaphs),
`--font-sans` (Geist, body), `--tracking-etched` (`tracking-etched`, the
carved-into-stone letter spacing), `--shadow-glow` (`shadow-glow`, the
amber lantern glow used on button hover — derived from `--accent` via
`color-mix`, so it re-tints per theme).

Gradients and glows in `globals.css` use `color-mix()` on the tokens
instead of hardcoded hexes, so they re-tint with the theme too.

## Adding a theme

1. Add a block to `globals.css`:

   ```css
   [data-theme="midnight-forest"] {
     --background: …;
     --surface: …;
     --foreground: …;
     --accent: …;
     --accent-bright: …;
   }
   ```

2. Register it in `src/themes/themes.ts`: extend the `ThemeId` union and add
   an entry to `THEMES`.
3. (Phase 5) The theme picker sets `document.documentElement.dataset.theme`
   and persists the choice.
