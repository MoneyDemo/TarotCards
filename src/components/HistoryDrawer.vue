<script setup lang="ts">
import { computed, ref } from 'vue'

import { ALL_CARDS } from '../data/cards'
import { useDrawHistory } from '../composables/useDrawHistory'
import type { HistoryEntry } from '../composables/useDrawHistory'

const isOpen = ref(false)

const { history, clearHistory } = useDrawHistory()

const cardsById = new Map(ALL_CARDS.map((card) => [card.id, card]))

const displayHistory = computed(() => [...history.value].reverse())

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-TW')
}

function cardName(entry: HistoryEntry): string {
  return cardsById.get(entry.cardId)?.nameZh ?? entry.cardId
}

function orientationLabel(entry: HistoryEntry): string {
  return entry.orientation === 'upright' ? '正位' : '逆位'
}
</script>

<template>
  <div class="font-body">
    <button
      type="button"
      class="inline-flex items-center rounded-full border border-mystic-gold/40 px-5 py-3 text-sm font-medium text-mystic-text transition hover:border-mystic-gold hover:bg-mystic-gold/10"
      @click="isOpen = true"
    >
      📜 查看歷史
    </button>

    <div
      v-if="isOpen"
      data-testid="history-backdrop"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click="isOpen = false"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-drawer-title"
        class="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-mystic-gold/40 bg-mystic-bg-elevated p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
        @click.stop
      >
        <header class="mb-6 flex items-start justify-between gap-4">
          <div class="space-y-2">
            <h2
              id="history-drawer-title"
              class="font-heading text-2xl text-mystic-gold"
            >
              歷史抽卡紀錄
            </h2>
            <p class="text-sm text-mystic-text-muted">
              保留最近 50 次抽卡結果。
            </p>
          </div>

          <button
            type="button"
            class="rounded-full border border-mystic-gold/30 px-3 py-1 text-sm text-mystic-text transition hover:border-mystic-gold hover:bg-mystic-gold/10"
            @click="isOpen = false"
          >
            ✕
          </button>
        </header>

        <div class="mb-6 flex justify-end">
          <button
            type="button"
            data-action="clear-history"
            class="rounded-full border border-mystic-gold/30 px-4 py-2 text-sm text-mystic-text transition hover:border-mystic-gold hover:bg-mystic-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="history.length === 0"
            @click="clearHistory"
          >
            清空紀錄
          </button>
        </div>

        <p
          v-if="displayHistory.length === 0"
          class="text-center text-mystic-text-muted"
        >
          尚無歷史紀錄
        </p>

        <ul
          v-else
          class="space-y-3"
        >
          <li
            v-for="entry in displayHistory"
            :key="`${entry.timestamp}-${entry.cardId}-${entry.orientation}`"
            class="rounded-2xl border border-mystic-gold/20 bg-black/10 p-4"
          >
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-1">
                <p class="text-sm text-mystic-text-muted">
                  {{ formatTimestamp(entry.timestamp) }}
                </p>
                <p class="text-base text-mystic-text">
                  {{ cardName(entry) }}
                </p>
              </div>

              <span
                class="inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium"
                :class="
                  entry.orientation === 'upright'
                    ? 'border-mystic-gold/40 bg-mystic-gold/15 text-mystic-gold'
                    : 'border-mystic-amethyst/40 bg-mystic-amethyst/20 text-mystic-amethyst'
                "
              >
                {{ orientationLabel(entry) }}
              </span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
