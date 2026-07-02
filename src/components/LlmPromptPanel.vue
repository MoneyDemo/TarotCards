<script setup lang="ts">
import { computed } from 'vue'

import type { DrawResult } from '../types/tarot'
import { buildLlmPrompt } from '../utils/buildLlmPrompt'
import { useClipboardCopy } from '../composables/useClipboardCopy'
import { useReadingQuestion } from '../composables/useReadingQuestion'

interface Props {
  result: DrawResult | null
}

const props = defineProps<Props>()

const { question } = useReadingQuestion()
const { copied, copy } = useClipboardCopy()

const prompt = computed(() => (props.result ? buildLlmPrompt(props.result, question.value) : ''))

async function handleCopy() {
  if (!props.result) {
    return
  }

  await copy(prompt.value)
}
</script>

<template>
  <section
    aria-labelledby="llm-prompt-heading"
    class="space-y-4 rounded-2xl border border-mystic-gold/30 bg-mystic-bg-elevated p-6"
  >
    <header class="space-y-1">
      <h2
        id="llm-prompt-heading"
        class="font-heading text-xl text-mystic-gold"
      >
        ✨ 交給 AI 深入解讀
      </h2>
      <p class="font-body text-sm leading-relaxed text-mystic-text-muted">
        把你在上方輸入的主題，連同這張牌組成一段 Prompt。複製後貼到 ChatGPT、Gemini 等 AI，就能得到更貼近你的解讀。
      </p>
    </header>

    <div class="space-y-2">
      <h3
        class="font-body text-sm font-semibold tracking-[0.2em] text-mystic-gold-soft uppercase"
      >
        Prompt 預覽
      </h3>
      <div
        class="max-h-64 overflow-y-auto rounded-xl border border-mystic-gold/20 bg-mystic-bg/40 p-4 font-body text-xs leading-relaxed whitespace-pre-wrap text-mystic-text-muted"
      >
        <template v-if="props.result">{{ prompt }}</template>
        <span v-else>先抽一張牌，就能在這裡預覽並複製 Prompt。</span>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg-elevated px-5 py-2.5 font-body text-sm font-medium text-mystic-text transition-colors hover:border-mystic-gold hover:bg-mystic-gold/10 disabled:cursor-not-allowed disabled:border-mystic-gold/20 disabled:bg-mystic-bg-elevated/60 disabled:text-mystic-text-muted disabled:hover:border-mystic-gold/20 disabled:hover:bg-mystic-bg-elevated/60"
        :disabled="!props.result"
        @click="handleCopy"
      >
        {{ copied ? '已複製 ✓' : '複製 Prompt' }}
      </button>
    </div>
  </section>
</template>
