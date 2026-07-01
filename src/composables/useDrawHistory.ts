import { readonly, ref, watch, type Ref } from 'vue'

import { useTarotDraw } from '../composables/useTarotDraw'
import type { Orientation } from '../types/tarot'

export interface HistoryEntry {
  timestamp: number
  cardId: string
  orientation: Orientation
}

const HISTORY_STORAGE_KEY = 'tarot-draw-history'
const MAX_HISTORY_ENTRIES = 50

const history = ref<HistoryEntry[]>([])
let hasLoadedHistory = false

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }

  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    return globalThis.localStorage ?? null
  }

  return null
}

function isOrientation(value: unknown): value is Orientation {
  return value === 'upright' || value === 'reversed'
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const entry = value as Partial<HistoryEntry>
  return (
    typeof entry.timestamp === 'number'
    && typeof entry.cardId === 'string'
    && isOrientation(entry.orientation)
  )
}

function loadHistory(): HistoryEntry[] {
  const storage = getStorage()
  if (!storage) {
    return []
  }

  try {
    const raw = storage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isHistoryEntry).slice(-MAX_HISTORY_ENTRIES)
  } catch {
    return []
  }
}

function saveHistory() {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.value))
}

function ensureHistoryLoaded() {
  if (hasLoadedHistory) {
    return
  }

  history.value = loadHistory()
  hasLoadedHistory = true
}

function appendHistoryEntry(entry: HistoryEntry) {
  ensureHistoryLoaded()
  history.value = [...history.value, entry].slice(-MAX_HISTORY_ENTRIES)
  saveHistory()
}

function clearHistory() {
  ensureHistoryLoaded()
  history.value = []

  const storage = getStorage()
  if (storage) {
    storage.removeItem(HISTORY_STORAGE_KEY)
  }
}

const { current } = useTarotDraw()

watch(current, (result) => {
  if (!result) {
    return
  }

  appendHistoryEntry({
    timestamp: result.timestamp,
    cardId: result.card.id,
    orientation: result.orientation,
  })
})

export function useDrawHistory(): {
  history: Readonly<Ref<readonly HistoryEntry[]>>
  clearHistory: () => void
} {
  ensureHistoryLoaded()

  return {
    history: readonly(history),
    clearHistory,
  }
}
