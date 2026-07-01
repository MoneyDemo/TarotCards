import { ref } from 'vue'
import { toPng } from 'html-to-image'

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

  async function shareOrDownload(elementId: string, fileName = 'tarot-reading.png') {
    isProcessing.value = true
    error.value = null

    try {
      const blob = await captureElementAsPngBlob(elementId)
      if (!blob) return

      const file = new File([blob], fileName, { type: 'image/png' })

      // Prefer the Web Share API when the current browser can share files.
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '今日塔羅',
          text: '我的今日塔羅指引',
        })
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '圖片產生失敗，請再試一次'
    } finally {
      isProcessing.value = false
    }
  }

  return { isProcessing, error, shareOrDownload }
}
