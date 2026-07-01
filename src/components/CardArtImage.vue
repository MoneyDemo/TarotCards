<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import CardArt from './CardArt.vue'
import type { TarotCard } from '../types/tarot'

interface Props {
  card: TarotCard
}

const props = defineProps<Props>()

// Runtime-constructed path — Vite can't statically rewrite this for the
// GitHub Pages /TarotCards/ base path, so BASE_URL must be prefixed manually.
const imageSrc = computed(
  () => `${import.meta.env.BASE_URL}tarot-art/rider-waite-smith/${props.card.id}.jpg`,
)

const isLoaded = ref(false)
const hasError = ref(false)

// Reset load/error state whenever the underlying image path changes (new draw).
watch(imageSrc, () => {
  isLoaded.value = false
  hasError.value = false
})
</script>

<template>
  <div class="relative h-full w-full">
    <!-- Fall back to the original SVG art if the photo is missing/fails to load,
         so a broken image icon is never shown to the user. -->
    <CardArt
      v-if="hasError"
      class="h-full w-full"
      :icon="card.icon"
      :arcana="card.arcana"
      :suit="card.suit"
      :number="card.number"
    />
    <template v-else>
      <div
        v-if="!isLoaded"
        class="absolute inset-0 animate-pulse rounded-lg bg-mystic-bg/60"
        aria-hidden="true"
      />
      <img
        :src="imageSrc"
        :alt="`${card.nameZh}（${card.nameEn}）`"
        class="h-full w-full rounded-lg object-contain transition-opacity duration-300"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @load="isLoaded = true"
        @error="hasError = true"
      >
    </template>
  </div>
</template>
