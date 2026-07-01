<script setup lang="ts">
import CardArt from './CardArt.vue'
import CardArtImage from './CardArtImage.vue'
import { useCardArtStyle } from '../composables/useCardArtStyle'
import type { TarotCard } from '../types/tarot'

interface Props {
  card: TarotCard
}

defineProps<Props>()

const { activeStyle } = useCardArtStyle()
</script>

<template>
  <CardArtImage
    v-if="activeStyle === 'rider-waite-smith'"
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
