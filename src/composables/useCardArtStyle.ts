import { readonly, ref } from 'vue'

import { ART_STYLES, DEFAULT_ART_STYLE_ID, type CardArtStyleId } from '../data/artStyles'

const STYLE_STORAGE_KEY = 'tarot-card-art-style'

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }

  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    return globalThis.localStorage ?? null
  }

  return null
}

function isValidStyleId(value: unknown): value is CardArtStyleId {
  return typeof value === 'string' && ART_STYLES.some((style) => style.id === value)
}

function loadStoredStyle(): CardArtStyleId {
  const storage = getStorage()
  if (!storage) {
    return DEFAULT_ART_STYLE_ID
  }

  try {
    const raw = storage.getItem(STYLE_STORAGE_KEY)
    return isValidStyleId(raw) ? raw : DEFAULT_ART_STYLE_ID
  } catch {
    return DEFAULT_ART_STYLE_ID
  }
}

// Module-level singleton (same pattern as useTarotDraw/useDrawHistory) so every
// component reading the active style reacts to the same shared selection.
const activeStyle = ref<CardArtStyleId>(loadStoredStyle())

function setStyle(id: CardArtStyleId) {
  activeStyle.value = id

  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(STYLE_STORAGE_KEY, id)
  } catch {
    // Ignore storage failures (e.g. private browsing quota) — the in-memory
    // selection still works for the current session.
  }
}

export function useCardArtStyle() {
  return {
    activeStyle: readonly(activeStyle),
    setStyle,
  }
}
