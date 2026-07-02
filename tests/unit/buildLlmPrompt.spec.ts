import { describe, expect, it } from 'vitest'

import { buildLlmPrompt } from '../../src/utils/buildLlmPrompt'
import type { DrawResult, TarotCard } from '../../src/types/tarot'

const majorCard: TarotCard = {
  id: 'major-00',
  number: 0,
  arcana: 'major',
  nameZh: '愚者',
  nameEn: 'The Fool',
  keywords: ['新開始', '冒險', '天真'],
  icon: 'fool-cliff',
  colorTheme: 'major',
  upright: {
    interpretation: 'UPRIGHT_INTERP',
    action: 'UPRIGHT_ACTION',
    question: 'UPRIGHT_QUESTION',
  },
  reversed: {
    interpretation: 'REVERSED_INTERP',
    action: 'REVERSED_ACTION',
    question: 'REVERSED_QUESTION',
  },
}

const minorCard: TarotCard = {
  id: 'minor-cups-11',
  number: 11,
  arcana: 'minor',
  suit: 'cups',
  nameZh: '聖杯侍者',
  nameEn: 'Page of Cups',
  keywords: ['直覺', '訊息'],
  icon: 'cups-11',
  colorTheme: 'cups',
  upright: { interpretation: 'ci', action: 'ca', question: 'cq' },
  reversed: { interpretation: 'ri', action: 'ra', question: 'rq' },
}

function drawOf(card: TarotCard, orientation: DrawResult['orientation']): DrawResult {
  return { card, orientation, timestamp: 0 }
}

describe('buildLlmPrompt', () => {
  it('includes card identity, upright meaning, keywords, topic and reply-language instruction', () => {
    const prompt = buildLlmPrompt(drawOf(majorCard, 'upright'), '工作上的選擇')

    expect(prompt).toContain('愚者')
    expect(prompt).toContain('The Fool')
    expect(prompt).toContain('正位')
    expect(prompt).toContain('大阿爾克那')
    expect(prompt).toContain('新開始')
    expect(prompt).toContain('冒險')
    expect(prompt).toContain('天真')
    expect(prompt).toContain('UPRIGHT_INTERP')
    expect(prompt).toContain('UPRIGHT_ACTION')
    expect(prompt).toContain('UPRIGHT_QUESTION')
    expect(prompt).toContain('工作上的選擇')
    expect(prompt).toContain('繁體中文')
  })

  it('uses the reversed meaning and 逆位 label for a reversed draw', () => {
    const prompt = buildLlmPrompt(drawOf(majorCard, 'reversed'), '感情')

    expect(prompt).toContain('逆位')
    expect(prompt).toContain('REVERSED_INTERP')
    expect(prompt).toContain('REVERSED_ACTION')
    expect(prompt).toContain('REVERSED_QUESTION')
    expect(prompt).not.toContain('UPRIGHT_INTERP')
  })

  it('falls back to a default topic when the question is empty or whitespace', () => {
    const blank = buildLlmPrompt(drawOf(majorCard, 'upright'), '   ')
    const empty = buildLlmPrompt(drawOf(majorCard, 'upright'), '')

    expect(blank).toContain('整體狀態')
    expect(empty).toContain('整體狀態')
  })

  it('trims the user topic before embedding it', () => {
    const prompt = buildLlmPrompt(drawOf(majorCard, 'upright'), '  人際關係  ')

    expect(prompt).toContain('人際關係')
    expect(prompt).not.toContain('  人際關係  ')
  })

  it('labels minor arcana with its suit', () => {
    const prompt = buildLlmPrompt(drawOf(minorCard, 'upright'), '財務')

    expect(prompt).toContain('小阿爾克那（聖杯）')
  })
})
