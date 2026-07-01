<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

import CardVisual from './CardVisual.vue'
import type { DrawResult } from '../types/tarot'

interface Props {
  result: DrawResult | null
}

const props = defineProps<Props>()

const FLIP_REPLAY_DELAY_MS = 180

const revealed = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | null = null

function clearRevealTimer() {
  if (revealTimer !== null) {
    clearTimeout(revealTimer)
    revealTimer = null
  }
}

watch(
  () =>
    props.result
      ? `${props.result.timestamp}:${props.result.card.id}:${props.result.orientation}`
      : null,
  (resultKey) => {
    clearRevealTimer()

    if (resultKey === null) {
      revealed.value = false
      return
    }

    // Force the card briefly back to its hidden state so every new draw replays the flip.
    revealed.value = false
    revealTimer = setTimeout(() => {
      revealed.value = true
      revealTimer = null
    }, FLIP_REPLAY_DELAY_MS)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearRevealTimer()
})
</script>

<template>
  <div
    class="mx-auto aspect-[5/7] w-full max-w-[240px]"
    style="perspective: 1200px;"
  >
    <div
      class="card-inner h-full w-full"
      :style="{
        transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transitionDuration: result ? undefined : '0ms',
      }"
    >
      <div class="card-face card-back overflow-hidden rounded-[1.5rem] border-2 border-mystic-gold bg-mystic-bg-elevated shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <div class="absolute inset-[7%] rounded-[1.2rem] border border-mystic-gold/35" />
        <div class="card-back-pattern absolute inset-0 opacity-35" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(107,70,193,0.14),_transparent_32%)]" />

        <div class="relative flex h-full items-center justify-center">
          <div class="absolute inset-y-[16%] left-1/2 w-px -translate-x-1/2 bg-mystic-gold/25" />
          <div class="absolute inset-x-[16%] top-1/2 h-px -translate-y-1/2 bg-mystic-gold/25" />

          <div class="flex h-28 w-28 items-center justify-center rounded-full border border-mystic-gold/45 bg-mystic-bg/45 shadow-[0_0_35px_rgba(212,175,55,0.08)]">
            <svg
              viewBox="0 0 120 120"
              class="h-20 w-20 text-mystic-gold"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="60" cy="60" r="42" stroke="currentColor" stroke-width="1.5" opacity="0.65" />
              <circle cx="60" cy="60" r="28" stroke="currentColor" stroke-width="1.5" opacity="0.45" />
              <path
                d="M60 22 L68 52 L98 60 L68 68 L60 98 L52 68 L22 60 L52 52 Z"
                fill="currentColor"
                opacity="0.88"
              />
              <circle cx="60" cy="60" r="6" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card-face card-front overflow-hidden rounded-[1.5rem] border-2 border-mystic-gold bg-mystic-bg-elevated shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <template v-if="result">
          <div class="relative flex h-full flex-col p-4">
            <div class="mb-3 flex justify-end">
              <span
                class="rounded-full border px-3 py-1 text-xs font-medium tracking-[0.18em]"
                :class="
                  result.orientation === 'upright'
                    ? 'border-mystic-gold/50 bg-mystic-gold/15 text-mystic-gold'
                    : 'border-mystic-amethyst/65 bg-mystic-amethyst/35 text-mystic-text'
                "
              >
                {{ result.orientation === 'upright' ? '正位' : '逆位' }}
              </span>
            </div>

            <div
              class="flex flex-1 flex-col transition-transform duration-500 ease-out"
              :class="result.orientation === 'reversed' ? 'rotate-180' : ''"
            >
              <div class="min-h-0 flex-1 px-2 pb-4">
                <CardVisual
                  class="h-full w-full"
                  :card="result.card"
                />
              </div>

              <div class="px-3 pb-2 text-center">
                <div class="font-heading text-xl text-mystic-gold">
                  {{ result.card.nameZh }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
}

.card-back-pattern {
  background-image:
    linear-gradient(45deg, transparent 46%, rgb(212 175 55 / 0.18) 50%, transparent 54%),
    linear-gradient(-45deg, transparent 46%, rgb(212 175 55 / 0.18) 50%, transparent 54%);
  background-size: 32px 32px;
  background-position: center;
}

@media (prefers-reduced-motion: reduce) {
  .card-inner {
    transition-duration: 0.01ms;
  }
}
</style>
