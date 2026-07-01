<script setup lang="ts">
import type { DrawResult } from '../types/tarot'
import { useTarotDraw } from '../composables/useTarotDraw'
import { useClipboardCopy } from '../composables/useClipboardCopy'
import { formatResultText } from '../utils/formatResultText'

interface Props {
  result: DrawResult | null
}

const props = defineProps<Props>()

const { redraw } = useTarotDraw()
const { copied, copy } = useClipboardCopy()

async function handleCopy() {
  if (!props.result) {
    return
  }

  await copy(formatResultText(props.result))
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg-elevated px-5 py-2.5 font-body text-sm font-medium text-mystic-text transition-colors hover:border-mystic-gold hover:bg-mystic-gold/10"
      @click="redraw"
    >
      再選一次
    </button>

    <button
      type="button"
      class="inline-flex items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg-elevated px-5 py-2.5 font-body text-sm font-medium text-mystic-text transition-colors hover:border-mystic-gold hover:bg-mystic-gold/10 disabled:cursor-not-allowed disabled:border-mystic-gold/20 disabled:bg-mystic-bg-elevated/60 disabled:text-mystic-text-muted disabled:hover:border-mystic-gold/20 disabled:hover:bg-mystic-bg-elevated/60"
      :disabled="!props.result"
      @click="handleCopy"
    >
      {{ copied ? '已複製 ✓' : '複製結果' }}
    </button>
  </div>
</template>
