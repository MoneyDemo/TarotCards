import { describe, it, expect } from 'vitest'
import { useTarotDraw } from '../../src/composables/useTarotDraw'
import { ALL_CARDS } from '../../src/data/cards'

describe('useTarotDraw', () => {
  it('draw() returns a card that belongs to the full 78-card deck', () => {
    const { draw } = useTarotDraw()
    const result = draw()
    expect(ALL_CARDS.some((c) => c.id === result.card.id)).toBe(true)
    expect(['upright', 'reversed']).toContain(result.orientation)
    expect(typeof result.timestamp).toBe('number')
  })

  it('draw() updates the shared current ref', () => {
    const { draw, current } = useTarotDraw()
    const result = draw()
    expect(current.value?.card.id).toBe(result.card.id)
    expect(current.value?.orientation).toBe(result.orientation)
  })

  it('redraw() is an independent fresh draw (no daily lock)', () => {
    const { redraw } = useTarotDraw()
    const first = redraw()
    const second = redraw()
    // Both draws must be valid cards; they are allowed to repeat since draws
    // are fully independent (no "no repeat" rule was requested).
    expect(ALL_CARDS.some((c) => c.id === first.card.id)).toBe(true)
    expect(ALL_CARDS.some((c) => c.id === second.card.id)).toBe(true)
  })

  it('produces variation across many draws (both card and orientation)', () => {
    const { draw } = useTarotDraw()
    const seenCardIds = new Set<string>()
    const seenOrientations = new Set<string>()
    for (let i = 0; i < 200; i++) {
      const result = draw()
      seenCardIds.add(result.card.id)
      seenOrientations.add(result.orientation)
    }
    expect(seenCardIds.size).toBeGreaterThan(1)
    expect(seenOrientations.size).toBe(2)
  })
})
