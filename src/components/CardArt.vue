<script setup lang="ts">
import { computed, useId } from 'vue'

import type { Arcana, Suit } from '../types/tarot'

interface Props {
  icon: string
  arcana: Arcana
  suit?: Suit
  number: number
}

interface PipPosition {
  x: number
  y: number
}

interface PipLayout {
  positions: PipPosition[]
  scale: number
}

interface WreathTick {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

const props = defineProps<Props>()

const titleId = useId()

const pipLayouts: Record<number, PipLayout> = {
  1: { positions: [{ x: 50, y: 70 }], scale: 1.25 },
  2: { positions: [{ x: 50, y: 44 }, { x: 50, y: 96 }], scale: 1.12 },
  3: { positions: [{ x: 50, y: 36 }, { x: 50, y: 70 }, { x: 50, y: 104 }], scale: 1.08 },
  4: {
    positions: [
      { x: 34, y: 44 },
      { x: 66, y: 44 },
      { x: 34, y: 96 },
      { x: 66, y: 96 },
    ],
    scale: 1,
  },
  5: {
    positions: [
      { x: 34, y: 40 },
      { x: 66, y: 40 },
      { x: 50, y: 70 },
      { x: 34, y: 100 },
      { x: 66, y: 100 },
    ],
    scale: 0.96,
  },
  6: {
    positions: [
      { x: 34, y: 36 },
      { x: 66, y: 36 },
      { x: 34, y: 70 },
      { x: 66, y: 70 },
      { x: 34, y: 104 },
      { x: 66, y: 104 },
    ],
    scale: 0.92,
  },
  7: {
    positions: [
      { x: 34, y: 32 },
      { x: 66, y: 32 },
      { x: 34, y: 58 },
      { x: 66, y: 58 },
      { x: 50, y: 82 },
      { x: 34, y: 108 },
      { x: 66, y: 108 },
    ],
    scale: 0.88,
  },
  8: {
    positions: [
      { x: 34, y: 30 },
      { x: 66, y: 30 },
      { x: 34, y: 54 },
      { x: 66, y: 54 },
      { x: 34, y: 78 },
      { x: 66, y: 78 },
      { x: 34, y: 102 },
      { x: 66, y: 102 },
    ],
    scale: 0.84,
  },
  9: {
    positions: [
      { x: 34, y: 28 },
      { x: 66, y: 28 },
      { x: 34, y: 50 },
      { x: 66, y: 50 },
      { x: 50, y: 70 },
      { x: 34, y: 90 },
      { x: 66, y: 90 },
      { x: 34, y: 112 },
      { x: 66, y: 112 },
    ],
    scale: 0.8,
  },
  10: {
    positions: [
      { x: 34, y: 24 },
      { x: 66, y: 24 },
      { x: 34, y: 46 },
      { x: 66, y: 46 },
      { x: 34, y: 68 },
      { x: 66, y: 68 },
      { x: 34, y: 90 },
      { x: 66, y: 90 },
      { x: 34, y: 112 },
      { x: 66, y: 112 },
    ],
    scale: 0.78,
  },
}

function makeStarPoints(points: number, outerRadius: number, innerRadius: number) {
  const total = points * 2

  return Array.from({ length: total }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius
    const angle = -Math.PI / 2 + (index * Math.PI) / points
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

function makeWreathTicks(): WreathTick[] {
  const count = 16
  const centerX = 50
  const centerY = 70
  const innerRadiusX = 24
  const innerRadiusY = 38
  const outerRadiusX = 29
  const outerRadiusY = 44

  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2

    return {
      key: `tick-${index}`,
      x1: centerX + Math.cos(angle) * innerRadiusX,
      y1: centerY + Math.sin(angle) * innerRadiusY,
      x2: centerX + Math.cos(angle) * outerRadiusX,
      y2: centerY + Math.sin(angle) * outerRadiusY,
    }
  })
}

const suitLabelMap: Record<Suit, string> = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
}

const pipStarPoints = makeStarPoints(5, 6.5, 2.7)
const majorStarPoints = makeStarPoints(7, 12, 5.4)
const wreathTicks: WreathTick[] = makeWreathTicks()

const courtRankLabel = computed(() => {
  switch (props.number) {
    case 11:
      return 'Page'
    case 12:
      return 'Knight'
    case 13:
      return 'Queen'
    case 14:
      return 'King'
    default:
      return ''
  }
})

const suitClass = computed(() => {
  switch (props.suit) {
    case 'wands':
      return 'text-wands'
    case 'cups':
      return 'text-cups'
    case 'swords':
      return 'text-swords'
    case 'pentacles':
      return 'text-pentacles'
    default:
      return 'text-mystic-text-muted'
  }
})

const isMajor = computed(() => props.arcana === 'major')
const isMinorPip = computed(() => props.arcana === 'minor' && props.number >= 1 && props.number <= 10)
const isMinorCourt = computed(() => props.arcana === 'minor' && props.number >= 11 && props.number <= 14)

// Fixed layouts keep the Marseille-style pips centered and readable as counts increase.
const pipLayout = computed<PipLayout>(() => pipLayouts[props.number] ?? pipLayouts[1])

const accessibleLabel = computed(() => {
  if (isMajor.value) {
    return `Major Arcana ${props.number}: ${props.icon.replace(/-/g, ' ')}`
  }

  if (props.suit) {
    const rank = courtRankLabel.value || String(props.number)
    return `Minor Arcana ${suitLabelMap[props.suit]} ${rank}`
  }

  return `Tarot card ${props.icon}`
})

function glyphTransform(position: PipPosition, scale: number) {
  return `translate(${position.x} ${position.y}) scale(${scale})`
}
</script>

<template>
  <svg
    viewBox="0 0 100 140"
    class="h-full w-full"
    fill="none"
    role="img"
    :aria-labelledby="titleId"
  >
    <title :id="titleId">{{ accessibleLabel }}</title>

    <g
      v-if="isMajor"
      class="text-mystic-gold"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <template v-if="icon === 'fool-cliff'">
        <circle cx="72" cy="34" r="10" />
        <path d="M20 102 L44 60 L66 102" />
        <path d="M66 102 H84" />
        <path d="M58 102 L70 92" />
      </template>

      <template v-else-if="icon === 'magician-infinity'">
        <path d="M22 70 C22 52 40 50 50 66 C60 82 78 80 78 62 C78 48 64 46 56 54 C53 57 51 61 50 66 C49 71 47 75 44 78 C36 86 22 84 22 70 Z" />
      </template>

      <template v-else-if="icon === 'high-priestess-veil'">
        <line x1="28" y1="36" x2="28" y2="104" />
        <line x1="72" y1="36" x2="72" y2="104" />
        <path d="M40 44 A12 12 0 1 0 40 68 A9 12 0 1 1 40 44" />
        <path d="M34 92 Q50 74 66 92" />
      </template>

      <template v-else-if="icon === 'empress-venus'">
        <circle cx="50" cy="48" r="18" />
        <line x1="50" y1="66" x2="50" y2="100" />
        <line x1="38" y1="86" x2="62" y2="86" />
      </template>

      <template v-else-if="icon === 'emperor-throne'">
        <rect x="28" y="54" width="44" height="38" rx="4" />
        <path d="M34 54 L40 40 L50 50 L60 40 L66 54" />
        <line x1="36" y1="92" x2="36" y2="104" />
        <line x1="64" y1="92" x2="64" y2="104" />
      </template>

      <template v-else-if="icon === 'hierophant-keys'">
        <circle cx="40" cy="48" r="8" />
        <circle cx="60" cy="60" r="8" />
        <path d="M45 53 L67 75" />
        <path d="M35 53 L23 65 L29 71" />
        <path d="M55 65 L43 77 L49 83" />
      </template>

      <template v-else-if="icon === 'lovers-union'">
        <circle cx="42" cy="70" r="16" />
        <circle cx="58" cy="70" r="16" />
      </template>

      <template v-else-if="icon === 'chariot-wheels'">
        <rect x="34" y="42" width="32" height="26" rx="6" />
        <circle cx="38" cy="90" r="12" />
        <circle cx="62" cy="90" r="12" />
        <line x1="38" y1="78" x2="38" y2="102" />
        <line x1="26" y1="90" x2="50" y2="90" />
        <line x1="62" y1="78" x2="62" y2="102" />
        <line x1="50" y1="90" x2="74" y2="90" />
      </template>

      <template v-else-if="icon === 'strength-lion'">
        <path d="M34 26 C34 18 42 16 46 22 C49 27 51 27 54 22 C58 16 66 18 66 26 C66 34 58 36 54 30 C51 26 49 26 46 30 C42 36 34 34 34 26 Z" />
        <circle cx="50" cy="76" r="20" />
        <circle cx="44" cy="72" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="56" cy="72" r="1.5" fill="currentColor" stroke="none" />
        <path d="M46 82 Q50 86 54 82" />
        <line x1="50" y1="52" x2="50" y2="44" />
        <line x1="36" y1="62" x2="30" y2="56" />
        <line x1="64" y1="62" x2="70" y2="56" />
        <line x1="34" y1="80" x2="26" y2="82" />
        <line x1="66" y1="80" x2="74" y2="82" />
        <line x1="40" y1="94" x2="34" y2="102" />
        <line x1="60" y1="94" x2="66" y2="102" />
      </template>

      <template v-else-if="icon === 'hermit-lantern'">
        <path d="M50 36 L66 64 L50 92 L34 64 Z" />
        <circle cx="50" cy="64" r="3" fill="currentColor" stroke="none" />
        <path d="M50 26 V36" />
      </template>

      <template v-else-if="icon === 'wheel-of-fortune'">
        <circle cx="50" cy="70" r="24" />
        <circle cx="50" cy="70" r="6" />
        <line x1="50" y1="46" x2="50" y2="94" />
        <line x1="26" y1="70" x2="74" y2="70" />
        <line x1="33" y1="53" x2="67" y2="87" />
        <line x1="67" y1="53" x2="33" y2="87" />
      </template>

      <template v-else-if="icon === 'justice-scales'">
        <line x1="50" y1="34" x2="50" y2="102" />
        <line x1="34" y1="46" x2="66" y2="46" />
        <line x1="38" y1="46" x2="30" y2="66" />
        <line x1="62" y1="46" x2="70" y2="66" />
        <path d="M22 66 H38 Q36 82 30 82 Q24 82 22 66 Z" />
        <path d="M62 66 H78 Q76 82 70 82 Q64 82 62 66 Z" />
        <line x1="42" y1="102" x2="58" y2="102" />
      </template>

      <template v-else-if="icon === 'hanged-man-tree'">
        <line x1="26" y1="32" x2="74" y2="32" />
        <line x1="34" y1="32" x2="34" y2="110" />
        <line x1="50" y1="32" x2="50" y2="50" />
        <circle cx="50" cy="58" r="8" />
        <path d="M50 66 L40 84 L50 102 L60 84 Z" />
      </template>

      <template v-else-if="icon === 'death-skeleton'">
        <circle cx="50" cy="52" r="16" />
        <circle cx="44" cy="48" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="56" cy="48" r="1.8" fill="currentColor" stroke="none" />
        <path d="M50 54 L46 60 H54 Z" />
        <path d="M42 68 Q50 74 58 68" />
        <line x1="50" y1="68" x2="50" y2="96" />
        <line x1="38" y1="82" x2="62" y2="82" />
      </template>

      <template v-else-if="icon === 'temperance-cups'">
        <path d="M28 44 L44 44 L40 66 H32 Z" />
        <path d="M56 74 L72 74 L68 96 H60 Z" />
        <path d="M42 58 C54 56 58 68 58 74" />
        <path d="M54 66 L58 74 L48 74" />
      </template>

      <template v-else-if="icon === 'devil-chains'">
        <path d="M40 42 L46 30 H54 L60 42 Z" />
        <path d="M44 30 L40 22 L36 30" />
        <path d="M56 30 L60 22 L64 30" />
        <circle cx="50" cy="52" r="10" />
        <path d="M32 76 L42 86 L32 96 L42 106 L32 116" />
        <path d="M68 76 L58 86 L68 96 L58 106 L68 116" />
      </template>

      <template v-else-if="icon === 'tower-lightning'">
        <rect x="40" y="32" width="20" height="74" rx="3" />
        <path d="M46 32 L50 24 L54 32" />
        <path d="M72 38 L60 62 H68 L56 90" />
      </template>

      <template v-else-if="icon === 'star-water'">
        <g transform="translate(50 48)">
          <polygon :points="majorStarPoints" />
        </g>
        <path d="M28 88 Q36 84 44 88 T60 88 T76 88" />
        <path d="M24 98 Q32 94 40 98 T56 98 T72 98" />
        <path d="M30 108 Q38 104 46 108 T62 108 T78 108" />
      </template>

      <template v-else-if="icon === 'moon-path'">
        <path d="M56 24 A16 16 0 1 0 56 56 A12 16 0 1 1 56 24" />
        <path d="M50 66 C40 76 40 88 50 96 C60 104 60 116 50 122" stroke-dasharray="3 6" />
      </template>

      <template v-else-if="icon === 'sun-rays'">
        <circle cx="50" cy="70" r="18" />
        <line x1="50" y1="28" x2="50" y2="40" />
        <line x1="50" y1="100" x2="50" y2="112" />
        <line x1="28" y1="70" x2="40" y2="70" />
        <line x1="60" y1="70" x2="72" y2="70" />
        <line x1="35" y1="45" x2="43" y2="53" />
        <line x1="57" y1="87" x2="65" y2="95" />
        <line x1="35" y1="95" x2="43" y2="87" />
        <line x1="57" y1="53" x2="65" y2="45" />
      </template>

      <template v-else-if="icon === 'judgement-trumpet'">
        <path d="M32 56 H50" />
        <path d="M50 56 L70 44 V68 L50 56 Z" />
        <path d="M32 56 V78" />
        <path d="M76 50 Q84 56 76 62" />
        <path d="M82 44 Q92 56 82 68" />
      </template>

      <template v-else-if="icon === 'world-wreath'">
        <ellipse cx="50" cy="70" rx="24" ry="38" />
        <line
          v-for="tick in wreathTicks"
          :key="tick.key"
          :x1="tick.x1"
          :y1="tick.y1"
          :x2="tick.x2"
          :y2="tick.y2"
        />
      </template>

      <template v-else>
        <circle cx="50" cy="70" r="22" />
        <path d="M50 54 V86" />
        <path d="M34 70 H66" />
      </template>
    </g>

    <g
      v-else-if="isMinorPip && props.suit"
      :class="suitClass"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g
        v-for="(position, index) in pipLayout.positions"
        :key="`${props.icon}-${index}`"
        :transform="glyphTransform(position, pipLayout.scale)"
      >
        <template v-if="props.suit === 'wands'">
          <line x1="0" y1="-10" x2="0" y2="10" stroke-width="4.5" />
          <line x1="-3" y1="-5" x2="3" y2="-1" stroke-width="1.8" />
          <line x1="-3" y1="4" x2="3" y2="8" stroke-width="1.8" />
        </template>

        <template v-else-if="props.suit === 'cups'">
          <path d="M-8 -8 H8 L5 0 H-5 Z" />
          <line x1="0" y1="0" x2="0" y2="8" />
          <line x1="-5" y1="10" x2="5" y2="10" />
        </template>

        <template v-else-if="props.suit === 'swords'">
          <path d="M0 -11 L4 -2 L2 9 L0 12 L-2 9 L-4 -2 Z" />
          <line x1="-6" y1="-2" x2="6" y2="-2" />
        </template>

        <template v-else-if="props.suit === 'pentacles'">
          <circle cx="0" cy="0" r="10" />
          <polygon :points="pipStarPoints" />
        </template>
      </g>
    </g>

    <g
      v-else-if="isMinorCourt && props.suit"
      :class="suitClass"
      stroke="currentColor"
      stroke-width="2.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="50" cy="40" r="10" />
      <path d="M50 50 L50 64" />
      <path d="M34 74 Q50 58 66 74 L72 106 H28 Z" />
      <line x1="36" y1="74" x2="28" y2="90" />
      <line x1="64" y1="74" x2="72" y2="90" />

      <path v-if="props.number === 12" d="M62 52 L74 40" />
      <path v-else-if="props.number === 13" d="M42 28 Q50 20 58 28" />
      <path v-else-if="props.number === 14" d="M42 30 L46 22 L50 30 L54 22 L58 30" />

      <g transform="translate(50 120)">
        <template v-if="props.suit === 'wands'">
          <line x1="0" y1="-9" x2="0" y2="9" stroke-width="4.2" />
          <line x1="-3" y1="-5" x2="3" y2="-1" stroke-width="1.6" />
          <line x1="-3" y1="4" x2="3" y2="8" stroke-width="1.6" />
        </template>

        <template v-else-if="props.suit === 'cups'">
          <path d="M-8 -8 H8 L5 0 H-5 Z" />
          <line x1="0" y1="0" x2="0" y2="8" />
          <line x1="-5" y1="10" x2="5" y2="10" />
        </template>

        <template v-else-if="props.suit === 'swords'">
          <path d="M0 -11 L4 -2 L2 9 L0 12 L-2 9 L-4 -2 Z" />
          <line x1="-6" y1="-2" x2="6" y2="-2" />
        </template>

        <template v-else-if="props.suit === 'pentacles'">
          <circle cx="0" cy="0" r="10" />
          <polygon :points="pipStarPoints" />
        </template>
      </g>
    </g>

    <g
      v-else
      class="text-mystic-text-muted"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="28" y="32" width="44" height="76" rx="8" />
      <path d="M40 50 H60" />
      <path d="M40 70 H60" />
      <path d="M40 90 H60" />
    </g>
  </svg>
</template>
