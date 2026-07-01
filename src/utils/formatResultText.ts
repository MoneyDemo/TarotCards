import type { DrawResult } from '../types/tarot'
import { meaningFor } from '../types/tarot'

/** Format a draw result as shareable plain text for clipboard copy. */
export function formatResultText(result: DrawResult): string {
  const meaning = meaningFor(result.card, result.orientation)
  const orientationLabel = result.orientation === 'upright' ? '正位' : '逆位'

  return [
    `🔮 今日塔羅：${result.card.nameZh}（${orientationLabel}）`,
    `解讀：${meaning.interpretation}`,
    `小行動：${meaning.action}`,
    `小問題：${meaning.question}`,
  ].join('\n')
}
