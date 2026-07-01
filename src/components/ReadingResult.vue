<script setup lang="ts">
import { computed } from 'vue'

import { meaningFor, type DrawResult } from '../types/tarot'

interface Props {
  result: DrawResult | null
}

const props = defineProps<Props>()

const meaning = computed(() =>
  props.result ? meaningFor(props.result.card, props.result.orientation) : null,
)
</script>

<template>
  <article
    id="reading-result-card"
    class="rounded-2xl border border-mystic-gold/30 bg-mystic-bg-elevated p-6"
  >
    <p
      v-if="!result"
      class="font-body leading-relaxed text-mystic-text-muted"
    >
      尚未抽牌，點擊上方的牌堆開始今天的塔羅指引，讓宇宙給你一個溫柔提醒 🔮
    </p>

    <div
      v-else-if="meaning"
      class="space-y-6"
    >
      <header class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-1">
          <h2 class="font-heading text-3xl text-mystic-gold">
            {{ result.card.nameZh }}
          </h2>
          <p class="font-body text-sm text-mystic-text-muted">
            {{ result.card.nameEn }}
          </p>
        </div>

        <span
          class="inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium"
          :class="
            result.orientation === 'upright'
              ? 'border-mystic-gold/40 bg-mystic-gold/15 text-mystic-gold'
              : 'border-mystic-amethyst/40 bg-mystic-amethyst/15 text-mystic-amethyst'
          "
        >
          {{ result.orientation === 'upright' ? '正位' : '逆位' }}
        </span>
      </header>

      <section
        aria-labelledby="reading-interpretation-heading"
        class="space-y-2"
      >
        <h3
          id="reading-interpretation-heading"
          class="font-body text-sm font-semibold tracking-[0.2em] text-mystic-gold-soft uppercase"
        >
          解讀
        </h3>
        <p class="font-body leading-relaxed text-mystic-text">
          {{ meaning.interpretation }}
        </p>
      </section>

      <section
        aria-labelledby="reading-action-heading"
        class="space-y-2"
      >
        <h3
          id="reading-action-heading"
          class="font-body text-sm font-semibold tracking-[0.2em] text-mystic-gold-soft uppercase"
        >
          小行動
        </h3>
        <p class="font-body leading-relaxed text-mystic-text">
          {{ meaning.action }}
        </p>
      </section>

      <section
        aria-labelledby="reading-question-heading"
        class="space-y-2"
      >
        <h3
          id="reading-question-heading"
          class="font-body text-sm font-semibold tracking-[0.2em] text-mystic-gold-soft uppercase"
        >
          小問題
        </h3>
        <p class="font-body leading-relaxed text-mystic-text">
          {{ meaning.question }}
        </p>
      </section>
    </div>
  </article>
</template>
