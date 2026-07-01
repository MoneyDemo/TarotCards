---
applyTo: "**"
---
# 塔羅牌網站 Design System 指引

> 🔮 **設計系統 SSOT**：本專案為純前端 Vue 3 + Tailwind CSS v4 網站，設計 token 以
> [`src/style.css`](../../src/style.css) 內的 CSS-first `@theme` 定義為單一真實來源。
> 本檔案聚焦 Copilot 的操作規則與檢查清單；若文字描述與 `@theme` token 不一致，以
> `src/style.css` 內實際 token 為準。

本網站採用 **mystical starry night** 視覺語言：深邃夜空、微暖金色點綴、帶有靈性與儀式感，
但整體氛圍應保持 **溫暖、歡迎、可親近**，避免走向恐怖、陰森或獵奇式的 occult-horror 風格。

## 設計哲學

- **神秘但不驚悚**：營造星夜、靜謐、儀式感，而非詛咒、恐嚇、宿命感
- **溫暖引導**：內容與視覺都應鼓勵自我覺察，而不是替使用者下絕對判決
- **原創優先**：牌面視覺必須為原創表現，不重現任何既有出版塔羅牌組的具體插畫
- **符號清晰**：大阿爾克那使用傳統象徵圖像（太陽、月亮、星星、命運之輪、高塔等）的獨特詮釋；小阿爾克那採 **Marseille-style pip** 排列（依數字重複花色符號，宮廷牌使用簡潔人物剪影）
- **語義化設計 token**：所有色彩與字型皆透過 `@theme` token 引用，禁止硬編碼

## 卡牌圖案風格系統

- 可選風格清單集中定義於 `src/data/artStyles.ts` 的 `ART_STYLES` registry；新增風格時先在此註冊 `id`、名稱與預覽資訊
- `useCardArtStyle()` 負責讀寫目前風格選擇（含 `localStorage` 持久化），`CardVisual.vue` 依 style id 在 `CardArt.vue`（原創 SVG）與 `CardArtImage.vue`（真實牌面/圖片風格）之間切換
- 若未來再加入其他牌面風格，請保留既有 `original` 風格，並同步教會 `CardVisual.vue` 如何渲染新 style；圖片型風格也要補齊來源與授權註記

## 色彩系統

### 共享設計 Token

色彩 token 定義在 `src/style.css` 的 `@theme` 區塊中，為本專案單一真實來源：

| Token | 值 | 用途 |
|-------|----|------|
| `mystic-bg` | `#181225` | 頁面主背景；深邃靛藍 / 午夜紫夜空底色 |
| `mystic-bg-elevated` | `#241a38` | 卡片、彈窗、浮層背景；比主背景略亮的層次色 |
| `mystic-gold` | `#d4af37` | 主要點綴、關鍵 CTA、星象/神聖符號高亮 |
| `mystic-gold-soft` | `#e7c86a` | 次要金色描邊、hover、柔和高光 |
| `mystic-amethyst` | `#6b46c1` | 次要強調色、互動狀態、神秘感輔助色 |
| `mystic-text` | `#f4eefc` | 主要文字；深色背景上的高可讀淺色字 |
| `mystic-text-muted` | `#b9aecf` | 輔助文字、說明、次要資訊 |
| `wands` | `#e97a4a` | 權杖花色主題色；火元素的橘紅暖焰感 |
| `cups` | `#4ba3c7` | 聖杯花色主題色；水元素的藍青流動感 |
| `swords` | `#b8bec9` | 寶劍花色主題色；風元素的銀灰清冽感 |
| `pentacles` | `#9ea94b` | 錢幣花色主題色；土元素的綠金豐饒感 |

### 花色使用原則

| 花色 | 主題 | 視覺方向 |
|------|------|----------|
| Wands / 權杖 | 火 | 活力、行動、創造、熱度 |
| Cups / 聖杯 | 水 | 情感、直覺、連結、流動 |
| Swords / 寶劍 | 風 | 思考、決斷、清晰、張力 |
| Pentacles / 錢幣 | 土 | 現實、資源、身體感、落地 |

### 用色規則

- 主介面以 `mystic-bg` / `mystic-bg-elevated` / `mystic-text` 為基底
- 金色系 (`mystic-gold`, `mystic-gold-soft`) 用於品牌識別、按鈕、邊框高亮、牌面神聖符號
- 花色色彩用於卡牌分類、標籤、細節裝飾，不應搶走整體夜空基調
- 避免大量高飽和純紅、純藍、純綠，保持低噪音且沉靜的夜空氛圍

## 字型系統

| 用途 | 字型 | Tailwind / Token |
|------|------|------------------|
| 標題 | Cinzel (serif) | `font-heading` |
| 內文 | Noto Sans TC | `font-body` |

- `font-heading` 用於頁面標題、牌名、儀式感較強的短句
- `font-body` 用於說明文、解牌內容、行動建議、反思問題
- 保持標題有神秘感、內文有可讀性，避免過度裝飾字影響閱讀

## 文案語氣原則

- **溫暖、正向、鼓勵自我覺察**
- 強調「可能性」、「提醒」、「邀請你留意」等開放式語氣
- 避免宿命式、恐嚇式、不可逆的斷言
- 避免把牌義寫成絕對預言；應引導使用者思考當下狀態與可採取的行動

## 專案技術與主題規則

- **平台**：本專案為 **Web-only**
- **框架**：Vue 3 + Vite + TypeScript
- **樣式**：Tailwind CSS v4，採 CSS-first `@theme` token
- **設定來源**：不要期待 `tailwind.config.js`；主題 token 以 `src/style.css` 為準
- **主題模式**：僅提供深色主題；**不需要** light/dark toggle

## 新元件開發檢查清單

1. 使用 `mystic-*` 與四花色 token，**不要硬編碼 hex 值**
2. 需要層次時優先使用 `mystic-bg-elevated`，不要脫離整體夜空底色
3. 卡牌展示必須清楚區分 **正位 / 逆位**
4. 花色色彩只作語義輔助，避免整體畫面過度花俏
5. 標題使用 `font-heading`，正文使用 `font-body`
6. 文案保持溫暖、反思導向，避免宿命式斷言
7. 若新增視覺素材，必須維持原創，不重製任何特定出版牌組插畫
