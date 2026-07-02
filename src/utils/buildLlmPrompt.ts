import type { DrawResult, Suit } from '../types/tarot'
import { meaningFor } from '../types/tarot'

/** Default topic used when the user leaves the question field empty. */
const DEFAULT_TOPIC = '今天的整體狀態，以及有沒有什麼特別需要我留意的地方'

const SUIT_LABELS: Record<Suit, string> = {
  wands: '權杖',
  cups: '聖杯',
  swords: '寶劍',
  pentacles: '錢幣',
}

/** Human-friendly arcana / suit label, e.g. 「大阿爾克那」or「小阿爾克那（聖杯）」. */
function arcanaLabel(result: DrawResult): string {
  const { card } = result
  if (card.arcana === 'major' || !card.suit) {
    return '大阿爾克那'
  }
  return `小阿爾克那（${SUIT_LABELS[card.suit]}）`
}

/**
 * Compose a ready-to-paste Traditional-Chinese prompt for an external LLM
 * (ChatGPT, etc.) from a draw result and the user's topic.
 *
 * The prompt frames the model as a warm, reflection-oriented tarot reader,
 * supplies the drawn card plus the app's built-in meanings as reference
 * context, and asks for an open-ended, non-fatalistic reply.
 */
export function buildLlmPrompt(result: DrawResult, question: string): string {
  const meaning = meaningFor(result.card, result.orientation)
  const orientationLabel = result.orientation === 'upright' ? '正位' : '逆位'
  const topic = question.trim() || DEFAULT_TOPIC

  return [
    '你是一位溫暖、擅長引導自我覺察的塔羅牌解讀者。請根據我抽到的牌，為我做一次貼近生活、鼓勵自我覺察的解讀。',
    '',
    '【我想了解的主題】',
    topic,
    '',
    '【我抽到的牌】',
    `- 牌名：${result.card.nameZh}（${result.card.nameEn}）`,
    `- 牌位：${orientationLabel}`,
    `- 牌組：${arcanaLabel(result)}`,
    `- 關鍵字：${result.card.keywords.join('、')}`,
    '',
    '【這張牌的參考牌義（僅供參考，你可以自由延伸）】',
    `- 解讀：${meaning.interpretation}`,
    `- 小行動：${meaning.action}`,
    `- 小問題：${meaning.question}`,
    '',
    '【請你這樣回覆我】',
    '1. 用溫暖、鼓勵的語氣，結合「我想了解的主題」，說明這張牌想提醒我的事。',
    '2. 給我 1～2 個今天就能嘗試的具體小行動。',
    '3. 最後提出一個能引導我自我反思的問題。',
    '',
    '請用繁體中文回覆，語氣溫暖、開放，把牌義當成邀請我思考的提醒，避免宿命式或恐嚇式的斷言。',
  ].join('\n')
}
