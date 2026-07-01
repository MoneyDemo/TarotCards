<script setup lang="ts">
import { computed } from 'vue'

import CardArt from './CardArt.vue'
import CardArtImage from './CardArtImage.vue'
import { useCardArtStyle } from '../composables/useCardArtStyle'
import type { CardArtStyleId } from '../data/artStyles'
import type { TarotCard } from '../types/tarot'

interface Props {
  card: TarotCard
  /**
   * Override the globally active style for this instance only. Used by
   * CardArtStylePicker to render an accurate preview of each style option
   * regardless of which style is currently selected app-wide.
   */
  forceStyle?: CardArtStyleId
}

const props = defineProps<Props>()

const { activeStyle } = useCardArtStyle()

const resolvedStyle = computed(() => props.forceStyle ?? activeStyle.value)
</script>

<template>
  <CardArtImage
    v-if="resolvedStyle === 'rider-waite-smith'"
    class="h-full w-full"
    :card="card"
  />
  <CardArt
    v-else
    class="h-full w-full"
    :icon="card.icon"
    :arcana="card.arcana"
    :suit="card.suit"
    :number="card.number"
  />
</template>
