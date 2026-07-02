# TarotCards — Agent Instructions

Pure-frontend Vue 3 tarot daily-fortune SPA deployed to GitHub Pages.
Live: <https://moneydemo.github.io/TarotCards/>

## Essential Commands

```bash
npm install
npm run dev        # Vite dev server
npm run build      # vue-tsc type check + Vite production build → dist/
npm run test       # Vitest unit tests (run once)
npm run test:watch # Vitest in watch mode
npm run lint       # ESLint with auto-fix
npm run format     # Prettier (src/ and tests/)
```

## Tech Stack

- **Vue 3** with `<script setup>` + Composition API only — no Options API
- **Vite 8 + TypeScript 6** — strict mode via `tsconfig.app.json`
- **Tailwind CSS v4** — CSS-first configuration; **no `tailwind.config.js`**
- **Vitest + @vue/test-utils** with jsdom environment

## Project Layout

```
src/
  components/     # UI: CardDeck, TarotCard, CardVisual, CardArt, CardArtImage,
                  #     ReadingResult, ActionBar, ShareImageButton, HistoryDrawer
  composables/    # Shared logic: useTarotDraw, useDrawHistory, useClipboardCopy,
                  #               useShareImage, useCardArtStyle
  data/
    cards/        # 78-card data: major.ts, wands.ts, cups.ts, swords.ts, pentacles.ts
    artStyles.ts  # ART_STYLES registry — add new styles here first
  types/tarot.ts  # Core types: TarotCard, CardMeaning, DrawResult, Suit, Orientation
  utils/          # Pure helpers (formatResultText)
  style.css       # @theme tokens — SINGLE SOURCE OF TRUTH for all design tokens
tests/unit/       # Vitest specs mirroring src/ structure
```

## Key Conventions

### Styling — Tailwind v4 CSS-first
- Design tokens live **only** in `src/style.css` inside `@theme { … }`
- Use semantic token names (`bg-mystic-bg`, `text-mystic-gold`, `text-wands`, etc.) — **never hardcode hex values**
- Only dark theme — no light/dark toggle needed

### TypeScript
- Prefer `interface` over `type` alias for object shapes
- Avoid `any`; use `unknown` when type is truly unknown
- API/composable functions must have explicit return types

### Vue Components
- Always use `<script setup lang="ts">` + `defineProps<T>()` with an interface
- Composables follow `use*` naming and live in `src/composables/`
- `useTarotDraw` uses a **module-level singleton** ref — no Pinia/Vuex needed

### Card Art Style System
1. Register new styles in `src/data/artStyles.ts` (`ART_STYLES` array + `CardArtStyleId` union)
2. Update `CardVisual.vue` to render the new style id
3. SVG-based styles use `CardArt.vue`; image-based styles use `CardArtImage.vue`

### Card Data
- Each card needs a unique `id` (`major-00` … `major-21`, `minor-wands-01` … `minor-pentacles-14`)
- `icon` field maps to a symbol rendered in `CardArt.vue`
- Both `upright` and `reversed` meanings required: `{ interpretation, action, question }`
- Content tone: warm, reflective, open-ended — **no fatalistic assertions**

## Design System Reference

See [`.github/instructions/design.instructions.md`](.github/instructions/design.instructions.md) for the full color palette, typography rules, and component checklist.

## Code Review Conventions

See [`.github/instructions/code-review.instructions.md`](.github/instructions/code-review.instructions.md) for review format and priorities.

## Testing Approach

- Tests validate **business logic and data integrity**, not coverage numbers
- Data integrity tests (e.g., `cardData.spec.ts`) assert all 78 cards are present with valid fields
- Composable tests mock randomness or loop many draws to verify statistical properties
- Component tests use `@vue/test-utils` mount; avoid testing implementation details

## Common Pitfalls

- Tailwind v4: use `@theme` in CSS, not `theme()` in JS config — the config file doesn't exist
- `useTarotDraw` exposes `current` as `readonly(ref)` — don't mutate it from outside
- Card images for Rider-Waite-Smith style live in `public/tarot-art/rider-waite-smith/`; to re-fetch run `node scripts/fetch-rider-waite-images.mjs`
- Deployment is automatic on push to `main` via `.github/workflows/deploy.yml`
