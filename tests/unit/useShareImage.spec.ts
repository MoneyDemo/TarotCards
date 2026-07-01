import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toPng } from 'html-to-image'
import { useShareImage } from '../../src/composables/useShareImage'

vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}))

describe('useShareImage', () => {
  const toPngMock = vi.mocked(toPng)

  beforeEach(() => {
    document.body.innerHTML = ''
    toPngMock.mockReset()
    vi.restoreAllMocks()

    global.fetch = vi.fn()

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:tarot-reading'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    })
  })

  it('returns an inline error when the target element does not exist', async () => {
    const { shareOrDownload, error, isProcessing } = useShareImage()

    await shareOrDownload('missing-element')

    expect(error.value).toBe('找不到要分享的內容')
    expect(isProcessing.value).toBe(false)
    expect(toPngMock).not.toHaveBeenCalled()
  })

  it('shares the generated png file when the browser supports file sharing', async () => {
    document.body.innerHTML = '<article id="reading-result-card">今日塔羅</article>'

    const blob = new Blob(['png-data'], { type: 'image/png' })
    const share = vi.fn().mockResolvedValue(undefined)
    const canShare = vi.fn().mockReturnValue(true)

    Object.defineProperty(global.navigator, 'share', {
      configurable: true,
      value: share,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      configurable: true,
      value: canShare,
    })

    toPngMock.mockResolvedValue('data:image/png;base64,ZmFrZQ==')
    vi.mocked(global.fetch).mockResolvedValue({
      blob: async () => blob,
    } as Response)

    const { shareOrDownload, error } = useShareImage()

    await shareOrDownload('reading-result-card')

    expect(canShare).toHaveBeenCalledTimes(1)
    expect(share).toHaveBeenCalledTimes(1)
    expect(share.mock.calls[0]?.[0]).toMatchObject({
      title: '今日塔羅',
      text: '我的今日塔羅指引',
    })
    expect(share.mock.calls[0]?.[0].files).toHaveLength(1)
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(error.value).toBeNull()
  })

  it('downloads the generated png when file sharing is unavailable', async () => {
    document.body.innerHTML = '<article id="reading-result-card">今日塔羅</article>'

    const blob = new Blob(['png-data'], { type: 'image/png' })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    Object.defineProperty(global.navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      configurable: true,
      value: undefined,
    })

    toPngMock.mockResolvedValue('data:image/png;base64,ZmFrZQ==')
    vi.mocked(global.fetch).mockResolvedValue({
      blob: async () => blob,
    } as Response)

    const { shareOrDownload, error } = useShareImage()

    await shareOrDownload('reading-result-card', 'tarot-reading.png')

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:tarot-reading')
    expect(error.value).toBeNull()
  })

  it('silently does nothing when the user cancels the native share sheet', async () => {
    document.body.innerHTML = '<article id="reading-result-card">今日塔羅</article>'

    const blob = new Blob(['png-data'], { type: 'image/png' })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const abortError = new DOMException('Share canceled', 'AbortError')
    const share = vi.fn().mockRejectedValue(abortError)
    const canShare = vi.fn().mockReturnValue(true)

    Object.defineProperty(global.navigator, 'share', {
      configurable: true,
      value: share,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      configurable: true,
      value: canShare,
    })

    toPngMock.mockResolvedValue('data:image/png;base64,ZmFrZQ==')
    vi.mocked(global.fetch).mockResolvedValue({
      blob: async () => blob,
    } as Response)

    const { shareOrDownload, error, isProcessing } = useShareImage()

    await shareOrDownload('reading-result-card')

    expect(share).toHaveBeenCalledTimes(1)
    expect(click).not.toHaveBeenCalled()
    expect(error.value).toBeNull()
    expect(isProcessing.value).toBe(false)
  })

  it('falls back to downloading the png when navigator.share fails for a reason other than cancellation', async () => {
    document.body.innerHTML = '<article id="reading-result-card">今日塔羅</article>'

    const blob = new Blob(['png-data'], { type: 'image/png' })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const share = vi.fn().mockRejectedValue(new Error('Share failed'))
    const canShare = vi.fn().mockReturnValue(true)

    Object.defineProperty(global.navigator, 'share', {
      configurable: true,
      value: share,
    })
    Object.defineProperty(global.navigator, 'canShare', {
      configurable: true,
      value: canShare,
    })

    toPngMock.mockResolvedValue('data:image/png;base64,ZmFrZQ==')
    vi.mocked(global.fetch).mockResolvedValue({
      blob: async () => blob,
    } as Response)

    const { shareOrDownload, error } = useShareImage()

    await shareOrDownload('reading-result-card', 'tarot-reading.png')

    expect(share).toHaveBeenCalledTimes(1)
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledTimes(1)
    expect(error.value).toBeNull()
  })
})
