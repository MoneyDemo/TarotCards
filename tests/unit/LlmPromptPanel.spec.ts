import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LlmPromptPanel from '../../src/components/LlmPromptPanel.vue'
import { useReadingQuestion } from '../../src/composables/useReadingQuestion'
import type { DrawResult } from '../../src/types/tarot'

const copy = vi.fn()
const copied = ref(false)

vi.mock('../../src/composables/useClipboardCopy', () => ({
  useClipboardCopy: () => ({
    copied,
    copy,
  }),
}))

const sampleResult: DrawResult = {
  card: {
    id: 'major-00',
    number: 0,
    arcana: 'major',
    nameZh: '愚者',
    nameEn: 'The Fool',
    keywords: ['新開始'],
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

describe('LlmPromptPanel', () => {
  beforeEach(() => {
    copy.mockReset()
    copy.mockResolvedValue(true)
    copied.value = false
    useReadingQuestion().question.value = ''
  })

  it('disables the copy button and shows a hint when there is no draw result', () => {
    const wrapper = mount(LlmPromptPanel, {
      props: { result: null },
    })

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toBe('複製 Prompt')
    expect(wrapper.text()).toContain('先抽一張牌')
  })

  it('previews the composed prompt with the drawn card and the shared question', () => {
    useReadingQuestion().question.value = '工作上的選擇'

    const wrapper = mount(LlmPromptPanel, {
      props: { result: sampleResult },
    })

    expect(wrapper.text()).toContain('愚者')
    expect(wrapper.text()).toContain('工作上的選擇')
  })

  it('copies the composed prompt including the card and shared question when the button is clicked', async () => {
    useReadingQuestion().question.value = '感情'

    const wrapper = mount(LlmPromptPanel, {
      props: { result: sampleResult },
    })

    await wrapper.get('button').trigger('click')

    expect(copy).toHaveBeenCalledTimes(1)
    const copiedText = copy.mock.calls[0]?.[0] as string
    expect(copiedText).toContain('愚者')
    expect(copiedText).toContain('感情')
    expect(copiedText).toContain('繁體中文')
  })
})
