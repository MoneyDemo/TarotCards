<script setup lang="ts">
import CardDeck from './components/CardDeck.vue'
import ReadingResult from './components/ReadingResult.vue'
import ActionBar from './components/ActionBar.vue'
import ShareImageButton from './components/ShareImageButton.vue'
import HistoryDrawer from './components/HistoryDrawer.vue'
import CardArtStylePicker from './components/CardArtStylePicker.vue'
import { useTarotDraw } from './composables/useTarotDraw'

const { current } = useTarotDraw()
</script>

<template>
  <div class="min-h-svh bg-mystic-bg text-mystic-text">
    <div class="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:py-14">
      <header class="relative text-center">
        <div class="absolute right-0 top-0">
          <CardArtStylePicker />
        </div>
        <h1 class="font-heading text-4xl text-mystic-gold sm:text-5xl">🔮 塔羅牌每日運勢</h1>
        <p class="mt-2 font-body text-mystic-text-muted">抽一張牌，給自己今天一個溫柔的提醒</p>
      </header>

      <CardDeck />

      <ReadingResult :result="current" />

      <div class="flex flex-col items-center gap-3">
        <ActionBar :result="current" />
        <div class="flex flex-wrap items-center justify-center gap-3">
          <ShareImageButton :result="current" />
          <HistoryDrawer />
        </div>
      </div>

      <footer class="pt-4 text-center font-body text-xs text-mystic-text-muted">
        塔羅牌義為原創內容，僅供每日自我反思參考，並非命定預言。
      </footer>
    </div>
  </div>
</template>
