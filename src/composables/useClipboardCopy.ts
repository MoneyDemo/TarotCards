import { onBeforeUnmount, ref } from 'vue'

/** Generic clipboard-copy helper with a transient "copied" success flag. */
export function useClipboardCopy() {
  const copied = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function clearResetTimer() {
    if (resetTimer !== null) {
      clearTimeout(resetTimer)
      resetTimer = null
    }
  }

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      clearResetTimer()
      resetTimer = setTimeout(() => {
        copied.value = false
        resetTimer = null
      }, 2000)
      return true
    } catch {
      return false
    }
  }

  onBeforeUnmount(() => {
    clearResetTimer()
  })

  return { copied, copy }
}
