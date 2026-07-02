import { readonly, ref } from 'vue'

export type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'tarot-theme'

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  return null
}

function applyTheme(t: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
}

function loadStoredTheme(): Theme {
  const storage = getStorage()
  if (storage) {
    try {
      const raw = storage.getItem(THEME_STORAGE_KEY)
      if (raw === 'dark' || raw === 'light') return raw
    } catch {
      // ignore
    }
  }
  return 'dark'
}

// Module-level singleton so the theme is shared across all components.
const theme = ref<Theme>(loadStoredTheme())
applyTheme(theme.value)

function setTheme(t: Theme): void {
  theme.value = t
  applyTheme(t)
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(THEME_STORAGE_KEY, t)
  } catch {
    // Ignore storage failures — the in-memory selection still works.
  }
}

function toggleTheme(): void {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
  }
}
