<script setup lang="ts">
import { ref } from 'vue'

import CardVisual from './CardVisual.vue'
import { ART_STYLES, type CardArtStyleId } from '../data/artStyles'
import { useCardArtStyle } from '../composables/useCardArtStyle'
import { ALL_CARDS } from '../data/cards'

const isOpen = ref(false)
const { activeStyle, setStyle } = useCardArtStyle()

const cardsById = new Map(ALL_CARDS.map((card) => [card.id, card]))

function selectStyle(id: CardArtStyleId) {
  setStyle(id)
}
</script>

<template>
  <div>
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg-elevated p-2.5 text-lg leading-none text-mystic-text transition hover:border-mystic-gold hover:bg-mystic-gold/10"
      aria-label="選擇卡牌圖案風格"
      @click="isOpen = true"
    >
      <span aria-hidden="true">🎨</span>
    </button>

    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click="isOpen = false"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="art-style-picker-title"
        class="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-mystic-gold/40 bg-mystic-bg-elevated p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
        @click.stop
      >
        <header class="mb-5 flex items-start justify-between gap-4">
          <div class="space-y-1">
            <h2
              id="art-style-picker-title"
              class="font-heading text-2xl text-mystic-gold"
            >
              選擇卡牌圖案
            </h2>
            <p class="font-body text-sm text-mystic-text-muted">選擇喜歡的風格，會自動記住你的選擇。</p>
          </div>

          <button
            type="button"
            class="rounded-full border border-mystic-gold/30 px-3 py-1 text-sm text-mystic-text transition hover:border-mystic-gold hover:bg-mystic-gold/10"
            @click="isOpen = false"
          >
            ✕
          </button>
        </header>

        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="style in ART_STYLES"
            :key="style.id"
            type="button"
            class="flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition"
            :class="
              activeStyle === style.id
                ? 'border-mystic-gold bg-mystic-gold/10'
                : 'border-mystic-gold/20 hover:border-mystic-gold/50 hover:bg-mystic-gold/5'
            "
            @click="selectStyle(style.id)"
          >
            <div class="aspect-[5/7] w-full max-w-[120px] overflow-hidden rounded-lg">
              <CardVisual
                v-if="cardsById.get(style.previewCardId)"
                :card="cardsById.get(style.previewCardId)!"
                :force-style="style.id"
                class="h-full w-full"
              />
            </div>

            <span class="font-body text-sm font-semibold text-mystic-text">{{ style.nameZh }}</span>
            <span class="font-body text-xs leading-snug text-mystic-text-muted">{{ style.description }}</span>
            <span
              v-if="activeStyle === style.id"
              class="rounded-full bg-mystic-gold px-2 py-0.5 text-xs font-semibold text-mystic-bg"
            >
              使用中
            </span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
