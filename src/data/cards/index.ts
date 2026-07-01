import type { TarotCard } from '../../types/tarot'
import { majorArcanaCards } from './major'
import { wandsCards } from './wands'
import { cupsCards } from './cups'
import { swordsCards } from './swords'
import { pentaclesCards } from './pentacles'

/** The full 78-card deck: 22 Major Arcana + 56 Minor Arcana (4 suits x 14). */
export const ALL_CARDS: TarotCard[] = [
  ...majorArcanaCards,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards,
]

export { majorArcanaCards, wandsCards, cupsCards, swordsCards, pentaclesCards }
