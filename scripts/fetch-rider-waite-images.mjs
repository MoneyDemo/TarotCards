#!/usr/bin/env node
/**
 * Usage: node scripts/fetch-rider-waite-images.mjs
 *
 * Re-download the 1909 Rider-Waite-Smith tarot deck images used by this site.
 * These images are public domain in the US/UK, were illustrated by Pamela
 * Colman Smith (d. 1951), and are sourced from Wikimedia Commons. This script
 * exists so the committed images can be reproduced or refreshed later if needed.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const outputDir = path.join(repoRoot, 'public', 'tarot-art', 'rider-waite-smith')
const wikimediaFilePathBase = 'https://commons.wikimedia.org/wiki/Special:FilePath'
const requestDelayMinMs = 800
const requestDelayMaxMs = 1000
const retryDelayMs = 2500
const retryCount = 1

const majorArcanaFileMap = {
  'major-00': 'RWS_Tarot_00_Fool.jpg',
  'major-01': 'RWS_Tarot_01_Magician.jpg',
  'major-02': 'RWS_Tarot_02_High_Priestess.jpg',
  'major-03': 'RWS_Tarot_03_Empress.jpg',
  'major-04': 'RWS_Tarot_04_Emperor.jpg',
  'major-05': 'RWS_Tarot_05_Hierophant.jpg',
  'major-06': 'RWS_Tarot_06_Lovers.jpg',
  'major-07': 'RWS_Tarot_07_Chariot.jpg',
  'major-08': 'RWS_Tarot_08_Strength.jpg',
  'major-09': 'RWS_Tarot_09_Hermit.jpg',
  'major-10': 'RWS_Tarot_10_Wheel_of_Fortune.jpg',
  'major-11': 'RWS_Tarot_11_Justice.jpg',
  'major-12': 'RWS_Tarot_12_Hanged_Man.jpg',
  'major-13': 'RWS_Tarot_13_Death.jpg',
  'major-14': 'RWS_Tarot_14_Temperance.jpg',
  'major-15': 'RWS_Tarot_15_Devil.jpg',
  'major-16': 'RWS_Tarot_16_Tower.jpg',
  'major-17': 'RWS_Tarot_17_Star.jpg',
  'major-18': 'RWS_Tarot_18_Moon.jpg',
  'major-19': 'RWS_Tarot_19_Sun.jpg',
  'major-20': 'RWS_Tarot_20_Judgement.jpg',
  'major-21': 'RWS_Tarot_21_World.jpg',
}

function padCardNumber(value) {
  return String(value).padStart(2, '0')
}

function createSequentialFileMap(idPrefix, filenameBuilder) {
  return Object.fromEntries(
    Array.from({ length: 14 }, (_, index) => {
      const cardNumber = index + 1
      const padded = padCardNumber(cardNumber)
      return [`${idPrefix}-${padded}`, filenameBuilder(padded)]
    }),
  )
}

const cardFilenameMap = {
  ...majorArcanaFileMap,
  ...createSequentialFileMap('minor-wands', (number) => `RWS1909 - Wands ${number}.jpeg`),
  ...createSequentialFileMap('minor-cups', (number) => `Cups${number}.jpg`),
  ...createSequentialFileMap('minor-swords', (number) => `Swords${number}.jpg`),
  ...createSequentialFileMap('minor-pentacles', (number) => `Pents${number}.jpg`),
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function randomDelay(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

function buildSourceUrl(filename) {
  return `${wikimediaFilePathBase}/${encodeURIComponent(filename)}?width=500`
}

async function fetchImage(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'TarotCards image refresh script/1.0 (Wikimedia Commons source fetch)',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

async function downloadCardImage(id, filename) {
  const sourceUrl = buildSourceUrl(filename)
  const outputPath = path.join(outputDir, `${id}.jpg`)

  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    try {
      const bytes = await fetchImage(sourceUrl)
      await writeFile(outputPath, bytes)
      console.log(`Saved ${id}.jpg <- ${filename}`)
      return
    } catch (error) {
      if (attempt >= retryCount) {
        throw error
      }

      console.warn(
        `Retrying ${id} after failure (${error instanceof Error ? error.message : String(error)})...`,
      )
      await sleep(retryDelayMs)
    }
  }
}

async function main() {
  const entries = Object.entries(cardFilenameMap)

  if (entries.length !== 78) {
    throw new Error(`Expected 78 card mappings, received ${entries.length}.`)
  }

  await mkdir(outputDir, { recursive: true })

  for (const [index, [id, filename]] of entries.entries()) {
    await downloadCardImage(id, filename)

    if (index < entries.length - 1) {
      await sleep(randomDelay(requestDelayMinMs, requestDelayMaxMs))
    }
  }

  console.log(`Done. Refreshed ${entries.length} Rider-Waite-Smith images in ${outputDir}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
