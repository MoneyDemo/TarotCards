import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

const HISTORY_STORAGE_KEY = 'tarot-draw-history'
const BASE_TIMESTAMP = 1_720_000_000_000

function createStorage(): Storage {
  const data = new Map<string, string>()

  return {
    get length() {
      return data.size
    },
    clear() {
      data.clear()
    },
    getItem(key) {
      return data.get(key) ?? null
    },
    key(index) {
      return Array.from(data.keys())[index] ?? null
    },
    removeItem(key) {
      data.delete(key)
    },
    setItem(key, value) {
      data.set(key, value)
    },
  }
}

function installMockStorage(): Storage {
  const mockStorage = createStorage()
  vi.stubGlobal('localStorage', mockStorage)
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    configurable: true,
  })
  return mockStorage
}

describe('useDrawHistory', () => {
  let storage: Storage

  beforeEach(() => {
    storage = installMockStorage()
    vi.resetModules()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    storage.clear()
    vi.unstubAllGlobals()
  })

  it('appends draw results, persists them, and caps history at 50 entries', async () => {
    const { useDrawHistory } = await import('../../src/composables/useDrawHistory')
    const { useTarotDraw } = await import('../../src/composables/useTarotDraw')

    const { history } = useDrawHistory()
    const { draw } = useTarotDraw()

    for (let i = 0; i < 52; i++) {
      vi.setSystemTime(new Date(BASE_TIMESTAMP + i))
      draw()
      await nextTick()
    }

    expect(history.value).toHaveLength(50)
    expect(history.value[0]?.timestamp).toBe(BASE_TIMESTAMP + 2)
    expect(history.value.at(-1)?.timestamp).toBe(BASE_TIMESTAMP + 51)
    expect(history.value.every((entry) => !!entry.cardId)).toBe(true)
    expect(history.value.every((entry) => ['upright', 'reversed'].includes(entry.orientation))).toBe(true)

    const stored = JSON.parse(storage.getItem(HISTORY_STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(50)
    expect(stored[0]?.timestamp).toBe(BASE_TIMESTAMP + 2)
    expect(stored.at(-1)?.timestamp).toBe(BASE_TIMESTAMP + 51)
  })

  it('loads valid persisted history and clears it on demand', async () => {
    const persisted = [
      {
        timestamp: BASE_TIMESTAMP,
        cardId: 'major-00',
        orientation: 'upright',
      },
    ]

    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(persisted))

    const { useDrawHistory } = await import('../../src/composables/useDrawHistory')
    const { history, clearHistory } = useDrawHistory()

    expect(history.value).toEqual(persisted)

    clearHistory()
    await nextTick()

    expect(history.value).toEqual([])
    expect(storage.getItem(HISTORY_STORAGE_KEY)).toBeNull()
  })

  it('falls back to an empty history when localStorage data is corrupted', async () => {
    storage.setItem(HISTORY_STORAGE_KEY, '{not-valid-json')

    const { useDrawHistory } = await import('../../src/composables/useDrawHistory')
    const { history } = useDrawHistory()

    expect(history.value).toEqual([])
  })
})
