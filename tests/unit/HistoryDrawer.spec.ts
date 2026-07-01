import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const HISTORY_STORAGE_KEY = 'tarot-draw-history'

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

describe('HistoryDrawer', () => {
  let storage: Storage

  beforeEach(() => {
    storage = installMockStorage()
    vi.resetModules()
  })

  it('renders history entries newest first and closes when the backdrop is clicked', async () => {
    const { ALL_CARDS } = await import('../../src/data/cards')

    storage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([
        {
          timestamp: 1_720_000_000_000,
          cardId: ALL_CARDS[0].id,
          orientation: 'upright',
        },
        {
          timestamp: 1_720_000_000_100,
          cardId: ALL_CARDS[1].id,
          orientation: 'reversed',
        },
      ]),
    )

    const { default: HistoryDrawer } = await import('../../src/components/HistoryDrawer.vue')
    const wrapper = mount(HistoryDrawer)

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('歷史抽卡紀錄')

    const rows = wrapper.findAll('li')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain(ALL_CARDS[1].nameZh)
    expect(rows[0].text()).toContain('逆位')
    expect(rows[1].text()).toContain(ALL_CARDS[0].nameZh)
    expect(rows[1].text()).toContain('正位')

    await wrapper.get('[data-testid="history-backdrop"]').trigger('click')
    await nextTick()

    expect(wrapper.text()).not.toContain('歷史抽卡紀錄')
  })

  it('shows an empty state after clearing history', async () => {
    const { ALL_CARDS } = await import('../../src/data/cards')

    storage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([
        {
          timestamp: 1_720_000_000_000,
          cardId: ALL_CARDS[0].id,
          orientation: 'upright',
        },
      ]),
    )

    const { default: HistoryDrawer } = await import('../../src/components/HistoryDrawer.vue')
    const wrapper = mount(HistoryDrawer)

    await wrapper.get('button').trigger('click')
    await wrapper.get('button[type="button"][data-action="clear-history"]').trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('尚無歷史紀錄')
    expect(storage.getItem(HISTORY_STORAGE_KEY)).toBeNull()
  })
})
