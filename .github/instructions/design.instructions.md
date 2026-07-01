---
applyTo: "**"
---
# Monē Design System 指引

> 📐 **設計系統 SSOT**：完整的視覺識別（色票、字級、間距、圓角、元件、淺/深雙主題）以根目錄
> [`DESIGN.md`](../../DESIGN.md) 為**單一真實來源**（符合 Google DESIGN.md 規範）。
> 本檔案聚焦 Copilot 的操作規則與檢查清單；色彩 token 程式碼來源為
> [`src/shared/src/design-tokens/`](../../src/shared/src/design-tokens/)。三者若有出入，以 `design-tokens` 程式碼為準。

Monē 採用 **暖色莫蘭迪 (Warm Morandi)** 設計語言，以低飽和度、沉穩溫暖的色調為核心，傳達專業且親切的理財體驗。

## 設計哲學

- **溫暖沉穩**：避免高飽和度的冷色系，偏好大地、鼠尾草、奶油色調
- **一致跨平台**：Mobile (React Native) 與 Web (Vue 3 + Tailwind) 共享相同的色彩系統
- **語義化色彩**：所有色彩透過語義化 token 引用，禁止硬編碼 hex 值

## 色彩系統

### 共享設計 Token

色彩 token 定義在 `src/shared/src/design-tokens/` 中，為跨平台單一真實來源 (Single Source of Truth)：

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `primary` | `#81b29a` 鼠尾草綠 | `#4ade80` 亮綠 | 主要操作、按鈕、強調 |
| `primaryDark` | `#5a9a7a` | `#22c55e` | 主色深色變體 |
| `primaryLight` | `#a8d4be` | `#86efac` | 主色淺色變體 |
| `bgPrimary` | `#faf8f5` 奶油白 | `#0a0a0b` 近黑 | 頁面主背景 |
| `bgCard` | `#ffffff` 純白 | `#141416` | 卡片、面板背景 |
| `bgSecondary` | `#f0eeeb` 暖灰 | `#1a1a1c` | 次要背景區塊 |
| `textPrimary` | `#3d3a36` 暖棕 | `#e8e6e3` | 主要文字 |
| `textSecondary` | `#9a9590` | `#666666` | 輔助文字 |
| `textTertiary` | `#b5b0ab` | `#4a4a4a` | 提示、禁用文字 |
| `border` | `#e8e6e3` | `#2a2a2c` | 一般邊框 |
| `borderSubtle` | `rgba(0,0,0,0.03)` | `rgba(255,255,255,0.03)` | 細微邊框 |
| `success` | `#81b29a` | `#4ade80` | 成功狀態 |
| `warning` | `#f2cc8f` | `#ffe66d` | 警告狀態 |
| `error` | `#e07a5f` 陶土紅 | `#ff6b6b` | 錯誤狀態 |
| `info` | `#3d405b` 靛藍灰 | `#4ecdc4` | 資訊狀態 |
| `income` | `#81b29a` | `#4ade80` | 收入金額 |
| `expense` | `#e07a5f` | `#ff6b6b` | 支出金額 |
| `onPrimary` | `#ffffff` | `#000000` | Primary 上的前景色 |
| `onError` | `#ffffff` | `#ffffff` | Error 上的前景色 |

### 狀態容器色 (Status Containers)

低飽和度背景色，用於狀態提示區塊：

| Token | Light | Dark |
|-------|-------|------|
| `successContainer` | `#e8f5e9` | `#1a3a2a` |
| `warningContainer` | `#fff8e1` | `#3a3020` |
| `errorContainer` | `#fce4de` | `#3a1a1a` |
| `infoContainer` | `#e3edf8` | `#1a2a3a` |

### 圖表配色 (Chart Palette)

資料視覺化統一使用 `CHART_PALETTE`：
```
#e07a5f, #81b29a, #f2cc8f, #3d405b, #6d597a, #b56576, #355070, #eaac8b, #9a9590
```

### 品牌專屬色 (保留不變)

以下色值為外部品牌規範，**不納入設計 token 系統**：
- Google Sign-In：`#131314` / `#FFFFFF` / `#4285F4` 等 (遵循 Google Brand Guidelines)
- 分類色彩 (Category Colors)：各分類有固定色碼，建立在 API 回傳中

## 字型系統

### Web
| 用途 | 字型 | Tailwind class |
|------|------|---------------|
| 標題 | Libre Baskerville (serif) | `font-title` |
| 內文 | Noto Sans TC + 系統字型 | `font-body` |
| 程式碼 | JetBrains Mono | `font-mono` |

### Mobile
- 使用 React Native 系統預設字型
- 不額外載入自訂字型

## 間距系統

| Token | 值 |
|-------|-----|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 20px |
| `2xl` | 24px |
| `3xl` | 32px |

## 圓角系統

| Token | 值 |
|-------|-----|
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 20px |
| `full` | 9999px |

## 深色模式規則

### 核心原則
1. **背景**：使用近黑色 (`#0a0a0b`)，避免純黑 `#000000`
2. **Primary**：亮綠 `#4ade80`（非鼠尾草綠，確保深色背景上的可辨識度）
3. **onPrimary**：深色模式下為 `#000000`（黑字在亮綠按鈕上）
4. **Status 色**：略調高亮度確保深色背景上的可讀性
5. **Status Container**：使用低亮度、低飽和度的深色背景

### 切換策略
- **Web**：CSS class 策略 (`darkMode: 'class'`)，根元素添加 `.dark` class
- **Mobile**：React Context (`useTheme()`) 提供 `colors` 和 `isDark`

## 跨平台一致性原則

### 色彩引用方式

**Web (Vue + Tailwind)**：
```html
<div class="bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary">
```

**Mobile (React Native)**：
```tsx
const { colors } = useTheme()
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>...</Text>
</View>
```

### 禁止事項
- ❌ 在 Mobile 中硬編碼 hex 色值（`#FFFFFF`、`#000000` 等）
- ❌ 在 Web 中直接使用 hex 色值而不透過 Tailwind color token
- ❌ 使用高飽和度的冷色系（如 Tailwind 預設的 emerald、indigo）
- ❌ 在 `StyleSheet.create` 靜態樣式中放入主題色（應使用 inline style override）

### 允許例外
- ✅ `shadowColor: '#000'` — React Native shadow 系統慣例
- ✅ Camera 相關的 `backgroundColor: '#000'` — 功能性純黑
- ✅ `rgba(0,0,0,0.x)` — 半透明遮罩 (overlay)
- ✅ Google 品牌色 — 遵循外部品牌規範

## 新元件開發檢查清單

1. 從 `useTheme()` 取得 `colors`，而非硬編碼色值
2. 卡片邊框使用 `colors.borderSubtle`
3. 按鈕上的文字/圖示使用 `colors.onPrimary`
4. 錯誤提示背景使用 `colors.errorContainer`
5. 圖表取色使用 `CHART_PALETTE` (從 `@mone/shared/design-tokens` 匯入)
6. 深色模式下確認文字在新背景上有足夠對比度
