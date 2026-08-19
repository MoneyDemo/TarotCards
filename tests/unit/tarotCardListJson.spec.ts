import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ALL_CARDS } from '../../src/data/cards'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imageDir = path.resolve(__dirname, '../../public/tarot-art/rider-waite-smith')
const jsonPath = path.join(imageDir, 'tarot-card-list.json')

interface CardListEntry {
  id: string
  number: number
  arcana: string
  suit: string | null
  fileName: string
  nameZh: string
  nameEn: string
}

interface CardListFile {
  cardCount: number
  cards: CardListEntry[]
}

describe('rider-waite-smith tarot-card-list.json', () => {
  let data: CardListFile

  beforeAll(() => {
    const raw = readFileSync(jsonPath, 'utf-8')
    data = JSON.parse(raw) as CardListFile
  })

  it('contains exactly 78 unique-id entries matching cardCount', () => {
    expect(data.cards).toHaveLength(78)
    expect(data.cardCount).toBe(78)
    expect(new Set(data.cards.map((c) => c.id)).size).toBe(78)
  })

  it('has a matching image file on disk for every fileName', () => {
    for (const entry of data.cards) {
      expect(existsSync(path.join(imageDir, entry.fileName)), entry.fileName).toBe(true)
    }
  })

  it('stays in sync with the app card data (id, number, arcana, suit, names)', () => {
    const byId = new Map(data.cards.map((entry) => [entry.id, entry]))
    expect(byId.size).toBe(ALL_CARDS.length)

    for (const card of ALL_CARDS) {
      const entry = byId.get(card.id)
      expect(entry, `missing entry for ${card.id}`).toBeDefined()
      expect(entry!.number).toBe(card.number)
      expect(entry!.arcana).toBe(card.arcana)
      expect(entry!.suit).toBe(card.suit ?? null)
      expect(entry!.fileName).toBe(`${card.id}.jpg`)
      expect(entry!.nameZh).toBe(card.nameZh)
      expect(entry!.nameEn).toBe(card.nameEn)
    }
  })
})
