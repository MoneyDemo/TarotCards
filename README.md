# 🔮 塔羅牌每日運勢

一個純前端的塔羅牌每日運勢占卜網站。抽一張塔羅牌，獲得今天的解讀、一個小行動建議，以及一個自我反思的小問題。

線上體驗：<https://moneydemo.github.io/TarotCards/>

## 功能

- 完整 78 張塔羅牌（22 張大阿爾克那 + 56 張小阿爾克那：權杖／聖杯／寶劍／錢幣）
- 每次抽牌隨機決定正位／逆位，內容各自獨立撰寫
- 翻牌動畫、原創 SVG 卡牌插畫（不重製任何既有出版塔羅牌組的插畫）
- 不鎖定每日一次：可隨時「再選一次」，每次都是全新獨立的結果
- 複製結果為文字、產生分享圖片（Web Share API，桌面版則下載 PNG）
- 歷史抽卡紀錄（保留最近 50 筆，儲存在瀏覽器 localStorage）

## 卡牌圖案風格

- Header 提供風格選擇器，可在 **原創符號風** 與 **經典萊德偉特塔羅（1909）** 間切換
- 風格選擇會記住在瀏覽器 `localStorage`
- 經典萊德偉特塔羅牌面為 Pamela Colman Smith 繪製的公共領域作品，圖片來源為 Wikimedia Commons；如需重抓或更新素材，可執行 `scripts/fetch-rider-waite-images.mjs`

## 技術棧

- [Vue 3](https://vuejs.org/) + `<script setup>` Composition API
- [Vite](https://vite.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)（CSS-first `@theme` 設計 token，見 `src/style.css`）
- [Vitest](https://vitest.dev/) + `@vue/test-utils`
- [html-to-image](https://github.com/bubkoo/html-to-image) 用於分享圖片
- 純前端 SPA，無後端、無資料庫

## 開發

```bash
npm install
npm run dev       # 開發伺服器
npm run build     # 型別檢查 + 正式建置到 dist/
npm run preview   # 預覽正式建置
npm run test      # 執行 Vitest 單元測試
npm run lint      # ESLint（含自動修正）
npm run format    # Prettier 格式化
```

## 專案結構

```
src/
├── components/     # CardDeck, TarotCard, CardArt, ReadingResult, ActionBar,
│                   # ShareImageButton, HistoryDrawer
├── composables/     # useTarotDraw, useDrawHistory, useClipboardCopy, useShareImage
├── data/cards/      # 78 張牌的內容資料（major/wands/cups/swords/pentacles + index）
├── types/tarot.ts   # 核心型別定義（TarotCard、CardMeaning、DrawResult…）
└── utils/           # formatResultText 等工具函式
tests/unit/          # Vitest 單元測試（資料完整性、抽卡邏輯、元件行為）
```

## 部署

`main` 分支 push 後，`.github/workflows/deploy.yml` 會自動建置並部署到 GitHub Pages
（`https://moneydemo.github.io/TarotCards/`）。

## 內容與設計原則

- 牌義文案原創撰寫，基於塔羅牌傳統/通用象徵意義，語氣溫暖、正向、鼓勵自我覺察，
  避免宿命式斷言（詳見 `.github/instructions/design.instructions.md`）
- 卡牌視覺為原創 SVG（大阿爾克那使用獨特傳統象徵圖示；小阿爾克那採「馬賽塔羅式」
  pip 排列），未重製任何既有出版塔羅牌組的插畫
