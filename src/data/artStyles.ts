/**
 * Registry of selectable card-art rendering styles.
 *
 * Adding a new style later just means: add an entry here, and make
 * CardVisual.vue know how to render that style id. No changes needed to
 * card content data (src/data/cards/*) or to CardArt.vue.
 */

export type CardArtStyleId = 'original' | 'rider-waite-smith'

export interface ArtStyleOption {
  id: CardArtStyleId
  nameZh: string
  description: string
  /** Card id used to render a live preview thumbnail for this style. */
  previewCardId: string
}

export const ART_STYLES: ArtStyleOption[] = [
  {
    id: 'original',
    nameZh: '原創符號風',
    description: '本站原創設計的簡約 SVG 圖示，大阿爾克那使用獨特傳統符號，小阿爾克那採馬賽塔羅式 pip 排列。',
    previewCardId: 'major-00',
  },
  {
    id: 'rider-waite-smith',
    nameZh: '經典萊德偉特塔羅（1909）',
    description:
      '1909 年出版的經典塔羅牌插畫，繪師 Pamela Colman Smith，公共領域作品，圖片來源：Wikimedia Commons。',
    previewCardId: 'major-00',
  },
]

export const DEFAULT_ART_STYLE_ID: CardArtStyleId = 'original'
