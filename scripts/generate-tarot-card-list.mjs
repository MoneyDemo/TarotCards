#!/usr/bin/env node
/**
 * Usage: node scripts/generate-tarot-card-list.mjs
 *
 * Regenerates public/tarot-art/rider-waite-smith/tarot-card-list.json — a
 * simple, stable JSON index mapping each Rider-Waite-Smith image file name to
 * the tarot card it depicts. This lets an AI (or a human) look up which card
 * a given image file represents without having to visually identify it.
 *
 * The card list is derived directly from the single source of truth in
 * src/data/cards/*, via Vite's SSR module loader, so this file can never
 * drift out of sync with the app's own card data. Image file names follow
 * the project convention of `${card.id}.jpg` (see CardArtImage.vue).
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const outputPath = path.join(
  repoRoot,
  'public',
  'tarot-art',
  'rider-waite-smith',
  'tarot-card-list.json',
)

async function loadAllCards() {
  const server = await createServer({
    configFile: false,
    root: repoRoot,
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true },
  })
  try {
    const mod = await server.ssrLoadModule('/src/data/cards/index.ts')
    return mod.ALL_CARDS
  } finally {
    await server.close()
  }
}

function toEntry(card) {
  return {
    id: card.id,
    number: card.number,
    arcana: card.arcana,
    suit: card.suit ?? null,
    fileName: `${card.id}.jpg`,
    nameZh: card.nameZh,
    nameEn: card.nameEn,
  }
}

async function main() {
  const allCards = await loadAllCards()

  if (allCards.length !== 78) {
    throw new Error(`Expected 78 tarot cards, found ${allCards.length}.`)
  }

  const ids = new Set(allCards.map((card) => card.id))
  if (ids.size !== allCards.length) {
    throw new Error('Duplicate card ids found while generating tarot-card-list.json.')
  }

  const cards = allCards
    .map(toEntry)
    .sort((a, b) => a.id.localeCompare(b.id))

  const output = {
    description:
      'Rider-Waite-Smith tarot deck image index. Each entry maps an image file ' +
      'in this folder to the tarot card it depicts, so an AI assistant can ' +
      'identify a card from its file name without visually inspecting the image.',
    imageDirectory: 'public/tarot-art/rider-waite-smith/',
    cardCount: cards.length,
    cards,
  }

  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf-8')
  console.log(`Wrote ${cards.length} cards to ${path.relative(repoRoot, outputPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
