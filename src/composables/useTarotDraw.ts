import { ref, readonly } from 'vue'
import type { TarotCard, DrawResult, Orientation } from '../types/tarot'
import { ALL_CARDS } from '../data/cards'

/**
 * Shared draw state (module-level singleton). This app only ever shows a single
 * active reading at a time, so CardDeck / ActionBar / ReadingResult / HistoryDrawer
 * all observe the same `current` ref without needing prop drilling or a store library.
 */
const current = ref<DrawResult | null>(null)

function randomOrientation(): Orientation {
  return Math.random() < 0.5 ? 'upright' : 'reversed'
}

function randomCard(): TarotCard {
  const index = Math.floor(Math.random() * ALL_CARDS.length)
  return ALL_CARDS[index]
}

/**
 * Draw a brand new, independent random card + orientation. There is no daily
 * lock: every call (first draw or "再選一次" redraw) produces a fresh result.
 */
function draw(): DrawResult {
  const result: DrawResult = {
    card: randomCard(),
    orientation: randomOrientation(),
    timestamp: Date.now(),
  }
  current.value = result
  return result
}

export function useTarotDraw() {
  return {
    /** The most recent draw result, or null before the first draw. */
    current: readonly(current),
    draw,
    /** Alias of draw() — redraw is just another independent draw. */
    redraw: draw,
  }
}
