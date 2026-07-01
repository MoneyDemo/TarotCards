import { describe, it, expect } from 'vitest'
import { ALL_CARDS } from '../../src/data/cards'
import type { CardMeaning } from '../../src/types/tarot'

const VALID_SUITS = new Set(['wands', 'cups', 'swords', 'pentacles'])

function expectNonEmptyMeaning(meaning: CardMeaning, label: string) {
  expect(meaning.interpretation, `${label}.interpretation`).toBeTruthy()
  expect(meaning.interpretation.trim().length, `${label}.interpretation length`).toBeGreaterThan(0)
  expect(meaning.action, `${label}.action`).toBeTruthy()
  expect(meaning.action.trim().length, `${label}.action length`).toBeGreaterThan(0)
  expect(meaning.question, `${label}.question`).toBeTruthy()
  expect(meaning.question.trim().length, `${label}.question length`).toBeGreaterThan(0)
}

describe('tarot card data integrity', () => {
  it('has exactly 78 cards (22 Major + 56 Minor)', () => {
    expect(ALL_CARDS).toHaveLength(78)
  })

  it('has 22 Major Arcana cards numbered 0-21 with no suit', () => {
    const majors = ALL_CARDS.filter((c) => c.arcana === 'major')
    expect(majors).toHaveLength(22)
    const numbers = majors.map((c) => c.number).sort((a, b) => a - b)
    expect(numbers).toEqual(Array.from({ length: 22 }, (_, i) => i))
    for (const card of majors) {
      expect(card.suit, `${card.id} should have no suit`).toBeUndefined()
      expect(card.colorTheme).toBe('major')
    }
  })

  it('has 14 Minor Arcana cards per suit numbered 1-14', () => {
    for (const suit of VALID_SUITS) {
      const cards = ALL_CARDS.filter((c) => c.arcana === 'minor' && c.suit === suit)
      expect(cards, `suit ${suit}`).toHaveLength(14)
      const numbers = cards.map((c) => c.number).sort((a, b) => a - b)
      expect(numbers).toEqual(Array.from({ length: 14 }, (_, i) => i + 1))
      for (const card of cards) {
        expect(card.colorTheme).toBe(suit)
      }
    }
  })

  it('has unique, non-empty ids across the whole deck', () => {
    const ids = ALL_CARDS.map((c) => c.id)
    expect(ids.every((id) => !!id && id.trim().length > 0)).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has non-empty nameZh, nameEn, icon and at least one keyword for every card', () => {
    for (const card of ALL_CARDS) {
      expect(card.nameZh, `${card.id}.nameZh`).toBeTruthy()
      expect(card.nameEn, `${card.id}.nameEn`).toBeTruthy()
      expect(card.icon, `${card.id}.icon`).toBeTruthy()
      expect(card.keywords.length, `${card.id}.keywords`).toBeGreaterThan(0)
    }
  })

  it('has non-empty upright and reversed meanings (interpretation/action/question) for every card', () => {
    for (const card of ALL_CARDS) {
      expectNonEmptyMeaning(card.upright, `${card.id}.upright`)
      expectNonEmptyMeaning(card.reversed, `${card.id}.reversed`)
    }
  })

  it('gives every Minor Arcana card a suit that is one of the 4 valid suits', () => {
    const minors = ALL_CARDS.filter((c) => c.arcana === 'minor')
    expect(minors.length).toBe(56)
    for (const card of minors) {
      expect(card.suit && VALID_SUITS.has(card.suit), `${card.id}.suit`).toBe(true)
    }
  })
})
