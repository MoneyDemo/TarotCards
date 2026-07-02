<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg-elevated p-2.5 text-lg leading-none text-mystic-text transition hover:border-mystic-gold hover:bg-mystic-gold/10"
    :aria-label="theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'"
    :aria-pressed="theme === 'light'"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
  </button>
</template>
