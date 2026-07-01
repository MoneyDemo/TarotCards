<script setup lang="ts">
import { computed } from 'vue'

import { useShareImage } from '../composables/useShareImage'
import type { DrawResult } from '../types/tarot'

interface Props {
  result: DrawResult | null
}

const props = defineProps<Props>()

const { isProcessing, error, shareOrDownload } = useShareImage()

const isDisabled = computed(() => props.result === null || isProcessing.value)

async function handleClick() {
  if (isDisabled.value) {
    return
  }

  await shareOrDownload('reading-result-card', 'tarot-reading.png')
}
</script>

<template>
  <div class="space-y-2">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-full border border-mystic-gold/40 px-5 py-2.5 font-body text-sm font-medium text-mystic-text transition hover:bg-mystic-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="isDisabled"
      @click="handleClick"
    >
      {{ isProcessing ? '產生圖片中…' : '分享圖片' }}
    </button>

    <p
      v-if="error"
      class="font-body text-xs text-mystic-text-muted"
    >
      {{ error }}
    </p>
  </div>
</template>
