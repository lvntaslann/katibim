# Design System

Direction: **modern, confident, editorial-technical.** Sharp, high-contrast,
generous whitespace, strong type hierarchy — a well-designed developer tool
or modern editorial site, not a dashboard template. The interface recedes so
the typing text is unmistakably the main event.

Single source of truth: `app/globals.css`. All tokens are plain CSS custom
properties on `:root` (light) and `.dark` (dark, toggled by next-themes),
mapped once into Tailwind's theme via `@theme inline` so every component
uses ordinary utility classes (`bg-base`, `text-ink`, `border-hairline`,
`text-accent`, `text-danger`, …) instead of hardcoded colors.

## Dark mode

Implemented with **next-themes** (`components/layout/ThemeProvider.tsx`,
`attribute="class"`) plus a matching Tailwind v4 variant:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`defaultTheme="system"` — first visit respects `prefers-color-scheme`; the
choice is then persisted by next-themes (`localStorage`, key `theme`) and
applied via next-themes' own blocking pre-hydration script, so there is no
flash of the wrong theme. `components/layout/ThemeToggle.tsx` cycles
light → dark → system with lucide-react `Sun`/`Moon`/`Monitor` icons.

**Every component that ships must be checked in both themes.** There is no
separate light-only or dark-only code path anywhere — components read the
same token names in both.

## Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `base` | `#FBFBFA` | `#141413` | Page background |
| `surface` | `#F2F1EE` | `#1C1B19` | One-step-raised panels (typing area) |
| `ink` | `#131211` | `#EDEAE3` | Primary text |
| `ink-muted` | `#6B675E` | `#A29C8E` | Secondary text, labels, pending characters |
| `hairline` | `#E2E0DA` | `#302E2A` | 1px rules, borders, separators |
| `accent` | `#0A6B63` (teal) | `#4FBDB3` | Links, active nav state, focus ring, primary actions, next-key highlight |
| `success` | `#1E7A3E` | `#5FCB82` | Correct keystroke **only** |
| `danger` | `#B23A2E` | `#E28074` | Incorrect keystroke **only** |

Every pair above is ≥4.5:1 against its base/surface (verified). Accent is a
teal specifically so it never reads as red or green — it must never be
reused for typing feedback, and typing feedback must never be reused for UI
chrome.

Correct/incorrect feedback is never color-only: incorrect characters also
get an underline and heavier weight (`components/typing/TextDisplay.tsx`,
the char spans in `WordFocusRunner.tsx`) so the distinction holds for
red-green color blindness.

**Known gap:** `components/analytics/KeyboardHeatmap.tsx`'s intensity scale
is not yet theme-aware (a scale tuned for light will be unreadable on dark).
It lives on `/dashboard` and `/sonuc`, out of scope for this pass — fix
before shipping those pages in dark mode.

## Typography

Two families, loaded via `next/font/google` with `latin-ext` (Turkish
glyphs) in `app/layout.tsx`:

- **Geist** (`font-sans`, the default body font) — all UI text.
- **JetBrains Mono** (`font-mono`) — the typing passage, every score, timer
  and countdown.

Every live numeric metric (WPM, accuracy, timers, countdowns) uses the
`.tabular-figures` utility (`font-variant-numeric: tabular-nums`) so digits
don't shift width while counting — see `MetricsBar` and the antrenman
control bar's countdown.

Section labels use small tracked uppercase text
(`text-xs uppercase tracking-[0.08em]` or similar) instead of a third font.

## Layout

- Top masthead (`components/layout/Navbar.tsx`): full-width bar, one
  hairline rule beneath it, plain text nav links with a bottom-border active
  state. No floating/rounded pill navbar.
- Left-aligned content, not centered, with a real content column.
- Hairlines (`border-hairline`) and vertical rhythm are the primary
  separators — most content sits directly on `bg-base`. Reach for
  `bg-surface` only where a surface genuinely needs to read as a distinct
  object (the typing panel).
- No `rounded-xl border bg-card shadow` treatment as a default wrapper, no
  `shadow-2xl`/heavy drop shadows. Radii, when used at all, are small
  (`--radius-sm` / `--radius-md`, 3–5px).
- No glassmorphism, no glow, no animated gradients, no decorative
  illustrations or blob shapes, no emoji as icons — use `lucide-react`.

## Motion

Keep GSAP/Motion/AOS usage, but quiet: short durations, ease-out, opacity
and small translate only. No spring bounce, no staggered cascades on page
load. The word-focus panel's line-scroll transform (`WordFocusRunner.tsx`)
uses a 150ms ease-out CSS transition. Everything respects
`prefers-reduced-motion` via the global media query in `app/globals.css`
that collapses animation/transition durations to ~0.

## Word-focus typing layout

`components/typing/WordFocusRunner.tsx` + `hooks/useWordFocusEngine.ts`
replace the old "wall of paragraph text" runner for Antrenman and Ders.
Sınav Simülasyonu keeps the previous continuous-paragraph runner
(`ClassicRunner.tsx` + `hooks/useTypingEngine.ts`) by default, faithful to
real exam conditions, with word-focus available as an opt-in.

Key points for anyone touching this code:

- **The underlying `TypingEngine` (`lib/typing-engine/engine.ts`) is the
  single source of truth for scoring**, unchanged by word-focus mode except
  for one addition: `advanceToWordBoundary()`, called only when Space is
  pressed before the caret reached the passage's real space character (the
  typed word was short). It marks the remainder as missed using the exact
  same fields (`charStates`, `incorrectChars`, `errorCount`) a wrong
  keystroke already touches — there is no second, parallel error model.
- Per-character correctness (not word-level) drives all visible feedback,
  because that's what the engine actually records — a word with one wrong
  letter shows that one letter in the error style, not the whole word.
- The active word is promoted via a `data-active` attribute toggled
  imperatively (see `.word-focus-word` rules in `app/globals.css`); pending
  characters in every other word are dimmed via CSS only — already-typed
  (correct/incorrect) characters keep full opacity everywhere so past
  mistakes stay reviewable.
- "Sadece aktif kelime" is a pure CSS layer (`.only-active-word` on the
  panel) driven by the same imperative `data-active`/`data-next`
  attributes — no separate rendering path.
- Keystrokes are captured on a hidden, always-focused `<input>`
  (`autoComplete/autoCorrect/autoCapitalize/spellCheck` off) instead of a
  `window` listener, but every keydown still flows through the same
  per-character `TypingEngine.handleKeyDown` used everywhere else — nothing
  about hot-path performance changed. Do not re-render the passage or the
  active word's siblings on keystroke; only the touched char/word DOM nodes
  are mutated, exactly like the classic runner.
- The keyboard overlay needs no changes for word-focus: it already reads
  `engine.getCaretIndex()`/`engine.text` directly, so it's automatically in
  sync with whichever runner is active.

## Applying this to a new page or component

1. Use `bg-base` / `bg-surface` / `text-ink` / `text-ink-muted` /
   `border-hairline` / `text-accent` — never a raw Tailwind color
   (`neutral-*`, `blue-*`, etc.), and verify it in both themes.
2. Typing text, scores, timers: `font-mono` + `.tabular-figures` for numbers.
3. Left-align page content; reserve centering for genuinely symmetric
   objects (the physical keyboard overlay, a countdown number).
4. Prefer a hairline rule over a card border. Prefer whitespace over a
   background tint.
5. Correct/incorrect feedback: `success`/`danger` plus a non-color signal
   (underline, weight) — never color alone, never reused for anything else.

## Status

Implemented so far: tokens, real dark mode (next-themes), masthead
nav/footer, and the practice runner end-to-end — `app/antrenman/page.tsx`,
`TypingSession` (dispatcher), `WordFocusRunner`, `ClassicRunner`,
`TextDisplay`, `MetricsBar`, `KeyboardOverlay`. Sınav and Ders pages inherit
the new tokens through the shared runner components but haven't had their
own page-level chrome (control bars, selectors) rebuilt yet. Dashboard,
Kurumlar, Mülakat, the landing page, and the results page (including the
heatmap's theme-awareness) are next.
