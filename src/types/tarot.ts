/**
 * Core data model for the tarot daily-fortune app.
 *
 * A single source of truth for card shape used by data files (src/data/cards/*),
 * composables (useTarotDraw, useDrawHistory) and display components
 * (CardArt, TarotCard, ReadingResult).
 */

/** The four Minor Arcana suits. */
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

/** Major Arcana (0-21) vs Minor Arcana (suit cards). */
export type Arcana = 'major' | 'minor'

/** Card orientation as drawn. 正位 (upright) / 逆位 (reversed). */
export type Orientation = 'upright' | 'reversed'

/** Minor Arcana rank. 1 = Ace ... 10 = Ten, 11-14 = court cards. */
export type MinorRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

/** The written content shown for one orientation of a card. */
export interface CardMeaning {
  /** 解讀：整體牌義解讀 */
  interpretation: string
  /** 小行動：今天可以嘗試的小行動 */
  action: string
  /** 小問題：給自己的反思提問 */
  question: string
}

/** A single tarot card, including both upright and reversed meanings. */
export interface TarotCard {
  /** Stable unique id, e.g. 'major-00', 'minor-wands-05', 'minor-cups-11' (Page). */
  id: string
  /** Major: 0-21. Minor: 1-14 (11=Page, 12=Knight, 13=Queen, 14=King). */
  number: number
  arcana: Arcana
  /** Present only when arcana === 'minor'. */
  suit?: Suit
  /** 中文牌名，例如「愚者」 */
  nameZh: string
  /** English name, e.g. 'The Fool' */
  nameEn: string
  /** Short thematic keywords used for quick scanning / accessibility labels. */
  keywords: string[]
  /** Symbolic icon id rendered by CardArt.vue (see src/components/CardArt.vue). */
  icon: string
  /** Palette key: 'major' | Suit — resolved to Tailwind classes in CardArt.vue. */
  colorTheme: string
  upright: CardMeaning
  reversed: CardMeaning
}

/** The result of a single draw, as shown in ReadingResult and stored in history. */
export interface DrawResult {
  card: TarotCard
  orientation: Orientation
  /** Unix ms timestamp of when the draw happened. */
  timestamp: number
}

/** Convenience accessor: pick the CardMeaning matching a DrawResult's orientation. */
export function meaningFor(card: TarotCard, orientation: Orientation): CardMeaning {
  return orientation === 'upright' ? card.upright : card.reversed
}
