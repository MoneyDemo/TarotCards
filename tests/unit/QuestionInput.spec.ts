import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import QuestionInput from '../../src/components/QuestionInput.vue'
import { useReadingQuestion } from '../../src/composables/useReadingQuestion'

describe('QuestionInput', () => {
  beforeEach(() => {
    useReadingQuestion().question.value = ''
  })

  afterEach(() => {
    useReadingQuestion().question.value = ''
  })

  it('writes the typed topic into the shared reading question', async () => {
    const wrapper = mount(QuestionInput)

    await wrapper.get('textarea').setValue('我想了解人際關係')

    expect(useReadingQuestion().question.value).toBe('我想了解人際關係')
  })

  it('reflects an existing shared question value in the textarea', () => {
    useReadingQuestion().question.value = '財務規劃'

    const wrapper = mount(QuestionInput)

    expect(wrapper.get('textarea').element.value).toBe('財務規劃')
  })
})
