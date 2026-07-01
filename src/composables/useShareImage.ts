import { ref } from 'vue'
import { toPng } from 'html-to-image'

/**
 * DOMException (e.g. the AbortError thrown when a user cancels the native
 * share sheet) is NOT `instanceof Error` in V8/JSDOM, so error handling here
 * reads `.name`/`.message` duck-typed instead of narrowing with `instanceof`.
 */
function getErrorName(err: unknown): string | undefined {
  return err && typeof err === 'object' && 'name' in err ? String((err as { name: unknown }).name) : undefined
}

function getErrorMessage(err: unknown): string | undefined {
  return err && typeof err === 'object' && 'message' in err
    ? String((err as { message: unknown }).message)
    : undefined
}

/** Capture a DOM element by id and share/download it as a PNG image. */
export function useShareImage() {
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  async function captureElementAsPngBlob(elementId: string): Promise<Blob | null> {
    const node = document.getElementById(elementId)

    if (!node) {
      error.value = '找不到要分享的內容'
      return null
    }

    const dataUrl = await toPng(node, { pixelRatio: 2 })
    const response = await fetch(dataUrl)
    return await response.blob()
  }

  function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  async function shareOrDownload(elementId: string, fileName = 'tarot-reading.png') {
    isProcessing.value = true
    error.value = null

    try {
      const blob = await captureElementAsPngBlob(elementId)
      if (!blob) return

      const file = new File([blob], fileName, { type: 'image/png' })

      // Prefer the Web Share API when the current browser can share files.
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: '今日塔羅',
            text: '我的今日塔羅指引',
          })
          return
        } catch (shareErr) {
          // The user cancelling the native share sheet is a normal outcome, not
          // an error worth surfacing.
          if (getErrorName(shareErr) === 'AbortError') {
            return
          }
          // Any other share failure (e.g. no OS share target available) falls
          // back to a plain download so the user still gets their image.
          downloadBlob(blob, fileName)
          return
        }
      }

      downloadBlob(blob, fileName)
    } catch (err) {
      error.value = getErrorMessage(err) ?? '圖片產生失敗，請再試一次'
    } finally {
      isProcessing.value = false
    }
  }

  return { isProcessing, error, shareOrDownload }
}
