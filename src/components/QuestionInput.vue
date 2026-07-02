<script setup lang="ts">
import { useReadingQuestion } from '../composables/useReadingQuestion'

const { question } = useReadingQuestion()
</script>

<template>
  <section
    aria-labelledby="reading-question-heading"
    class="space-y-3 rounded-2xl border border-mystic-gold/30 bg-mystic-bg-elevated p-6"
  >
    <header class="space-y-1">
      <h2
        id="reading-question-heading"
        class="font-heading text-xl text-mystic-gold"
      >
        先想一個問題
      </h2>
      <p class="font-body text-sm leading-relaxed text-mystic-text-muted">
        抽牌前，先寫下今天想了解的主題或困惑。抽牌後就能把它連同你的牌一起交給 AI 深入解讀。留空也沒關係，會以整體運勢為主。
      </p>
    </header>

    <textarea
      id="reading-question-input"
      v-model="question"
      rows="3"
      aria-labelledby="reading-question-heading"
      placeholder="例如：我最近在考慮要不要換工作，想知道今天可以留意什麼？"
      class="w-full resize-y rounded-xl border border-mystic-gold/30 bg-mystic-bg/60 px-4 py-3 font-body text-sm leading-relaxed text-mystic-text transition-colors placeholder:text-mystic-text-muted/70 focus:border-mystic-gold focus:outline-none focus:ring-2 focus:ring-mystic-gold/30"
    />
  </section>
</template>
