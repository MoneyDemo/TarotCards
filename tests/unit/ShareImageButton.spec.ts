import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ShareImageButton from '../../src/components/ShareImageButton.vue'
import type { DrawResult } from '../../src/types/tarot'

const shareOrDownload = vi.fn()
const isProcessing = ref(false)
const error = ref<string | null>(null)

vi.mock('../../src/composables/useShareImage', () => ({
  useShareImage: () => ({
    isProcessing,
    error,
    shareOrDownload,
  }),
}))

const sampleResult: DrawResult = {
  card: {
    id: 'major-00',
    number: 0,
    arcana: 'major',
    nameZh: '愚者',
    nameEn: 'The Fool',
    keywords: ['new beginnings'],
    icon: 'fool',
    colorTheme: 'major',
    upright: {
      interpretation: '向前出發',
      action: '嘗試新的事物',
      question: '我願意相信什麼？',
    },
    reversed: {
      interpretation: '停下來覺察',
      action: '先確認下一步',
      question: '我忽略了什麼？',
    },
  },
  orientation: 'upright',
  timestamp: Date.now(),
}

describe('ShareImageButton', () => {
  beforeEach(() => {
    shareOrDownload.mockReset()
    isProcessing.value = false
    error.value = null
  })

  it('disables the button when there is no reading result to share', () => {
    const wrapper = mount(ShareImageButton, {
      props: {
        result: null,
      },
    })

    const button = wrapper.get('button')

    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toBe('分享圖片')
  })

  it('invokes shareOrDownload with the reading card id and filename when clicked', async () => {
    const wrapper = mount(ShareImageButton, {
      props: {
        result: sampleResult,
      },
    })

    await wrapper.get('button').trigger('click')

    expect(shareOrDownload).toHaveBeenCalledWith('reading-result-card', 'tarot-reading.png')
  })

  it('shows a loading label and keeps the button disabled while image generation is in progress', () => {
    isProcessing.value = true

    const wrapper = mount(ShareImageButton, {
      props: {
        result: sampleResult,
      },
    })

    const button = wrapper.get('button')

    expect(button.text()).toBe('產生圖片中…')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('renders the composable error message after a failed share attempt', () => {
    error.value = '圖片產生失敗，請再試一次'

    const wrapper = mount(ShareImageButton, {
      props: {
        result: sampleResult,
      },
    })

    expect(wrapper.text()).toContain('圖片產生失敗，請再試一次')
  })
})
