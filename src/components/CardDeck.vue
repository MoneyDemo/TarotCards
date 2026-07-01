<script setup lang="ts">
import { computed } from 'vue'

import TarotCard from './TarotCard.vue'
import { useTarotDraw } from '../composables/useTarotDraw'

const { current, draw } = useTarotDraw()

function formatTodayLabel(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day} 的每日運勢`
}

const todayLabel = computed(() => formatTodayLabel(new Date()))
const hasDrawn = computed(() => current.value !== null)
const ctaText = computed(() => (hasDrawn.value ? '再選一次' : '🔮 抽一張塔羅牌'))
const ctaAriaLabel = computed(() => (hasDrawn.value ? '重新抽取一張塔羅牌' : '抽取一張塔羅牌'))
</script>

<template>
  <section class="flex w-full flex-col items-center gap-5 px-4 py-6 sm:gap-6 sm:px-6">
    <p class="font-body text-sm text-mystic-text-muted">
      {{ todayLabel }}
    </p>

    <TarotCard :result="current" />

    <div class="flex w-full max-w-sm flex-col items-center gap-3">
      <button
        type="button"
        class="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-mystic-gold px-6 py-3 font-body text-base font-semibold text-mystic-bg shadow-[0_12px_30px_rgba(212,175,55,0.24)] transition-colors hover:bg-mystic-gold-soft focus:outline-none focus:ring-2 focus:ring-mystic-gold-soft focus:ring-offset-2 focus:ring-offset-mystic-bg active:bg-mystic-gold-soft/90"
        :aria-label="ctaAriaLabel"
        @click="draw"
      >
        {{ ctaText }}
      </button>

      <p class="text-center font-body text-sm text-mystic-text-muted">
        {{ hasDrawn ? '想換個指引？再抽一次看看新的訊息。' : '靜下心來，點擊按鈕展開今天的塔羅指引。' }}
      </p>
    </div>
  </section>
</template>
