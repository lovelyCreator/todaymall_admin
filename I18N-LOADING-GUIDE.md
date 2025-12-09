# Loading Screen i18n Implementation

## ✅ What Was Done

Added internationalization (i18n) support to the loading screen with **Korean as the default language**.

## 📁 Files Modified

### 1. Initial Loading Screen (Before React Loads)
**File:** `public/scripts/loading.js`

**Changes:**
- Added i18n support with 3 languages: Korean (ko-KR), English (en-US), Chinese (zh-CN)
- Default language: **Korean (ko-KR)**
- Automatically detects language from:
  1. localStorage (`umi_locale`)
  2. Browser language
  3. Falls back to Korean

**Translations:**
- **Korean (Default):**
  - Title: "리소스 로딩 중"
  - Subtitle: "초기 로딩 시 시간이 걸릴 수 있습니다. 잠시만 기다려 주세요."

- **English:**
  - Title: "Loading Resources"
  - Subtitle: "Initial loading may take some time. Please wait."

- **Chinese:**
  - Title: "正在加载资源"
  - Subtitle: "初次加载资源可能需要较多时间 请耐心等待"

### 2. React Loading Component
**File:** `src/loading.tsx`

**Changes:**
- Updated to use `useIntl` hook for i18n
- Changed from Skeleton to Spin with text
- Uses translation keys: `loading.title` and `loading.subtitle`

### 3. Translation Files Created

**Korean:** `src/locales/ko-KR/loading.ts`
```typescript
{
  'loading.title': '리소스 로딩 중',
  'loading.subtitle': '잠시만 기다려 주세요...',
  'loading.initial.title': '리소스 로딩 중',
  'loading.initial.subtitle': '초기 로딩 시 시간이 걸릴 수 있습니다. 잠시만 기다려 주세요.',
}
```

**English:** `src/locales/en-US/loading.ts`
```typescript
{
  'loading.title': 'Loading Resources',
  'loading.subtitle': 'Please wait...',
  'loading.initial.title': 'Loading Resources',
  'loading.initial.subtitle': 'Initial loading may take some time. Please wait.',
}
```

**Chinese:** `src/locales/zh-CN/loading.ts`
```typescript
{
  'loading.title': '正在加载资源',
  'loading.subtitle': '请稍候...',
  'loading.initial.title': '正在加载资源',
  'loading.initial.subtitle': '初次加载资源可能需要较多时间 请耐心等待',
}
```

### 4. Locale Index Files Updated

**Files:**
- `src/locales/ko-KR.ts`
- `src/locales/en-US.ts`
- `src/locales/zh-CN.ts`

**Changes:**
- Added `import loading from './[locale]/loading';`
- Added `...loading,` to the export

## 🎯 How It Works

### Initial Loading (Before React)
1. User opens the app
2. `loading.js` runs immediately
3. Checks for saved language preference in localStorage
4. Falls back to browser language
5. Defaults to Korean if no match
6. Shows loading screen in the detected language

### React Loading (After React Loads)
1. React app initializes
2. `Loading` component uses `useIntl` hook
3. Gets current locale from UmiJS
4. Shows loading text in current language

## 🌐 Language Detection Priority

1. **localStorage** (`umi_locale`) - User's saved preference
2. **Browser language** (`navigator.language`)
3. **Default** - Korean (ko-KR)

## 🔧 How to Test

### Test Initial Loading Screen
1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Should show Korean by default

### Test Language Switching
1. Change language in the app (top-right language selector)
2. Refresh the page
3. Loading screen should show in the selected language

### Test Browser Language
1. Clear localStorage
2. Change browser language to English
3. Refresh the page
4. Should show English loading screen

## 📝 Translation Keys

### For Initial Loading (loading.js)
- Hardcoded in the script
- No translation keys needed

### For React Loading (loading.tsx)
- `loading.title` - Main loading title
- `loading.subtitle` - Loading subtitle
- `loading.initial.title` - Initial loading title (for future use)
- `loading.initial.subtitle` - Initial loading subtitle (for future use)

## 🎨 Customization

### Add More Languages

1. **Add to loading.js:**
```javascript
const messages = {
  'ko-KR': { ... },
  'en-US': { ... },
  'zh-CN': { ... },
  'ja-JP': {  // Add Japanese
    title: 'リソースを読み込んでいます',
    subtitle: '初回読み込みには時間がかかる場合があります。お待ちください。'
  }
};
```

2. **Create locale file:**
```bash
src/locales/ja-JP/loading.ts
```

3. **Update locale index:**
```typescript
// src/locales/ja-JP.ts
import loading from './ja-JP/loading';
export default {
  ...
  ...loading,
};
```

### Change Default Language

**In loading.js:**
```javascript
return 'ko-KR'; // Change to 'en-US' or 'zh-CN'
```

**In config.ts:**
```typescript
locale: {
  default: 'ko-KR', // Change to 'en-US' or 'zh-CN'
  ...
}
```

## ✅ Verification

After implementation, you should see:

1. **Korean loading screen by default** (first visit)
2. **Loading screen matches app language** (after language selection)
3. **Smooth transition** from initial loading to React loading
4. **No English text** when Korean is selected

## 🚀 Next Steps

1. Test all three languages
2. Verify language persistence
3. Check on different browsers
4. Test with cleared cache

---

**Default Language:** Korean (ko-KR) ✅  
**Supported Languages:** Korean, English, Chinese ✅  
**Auto-detection:** Yes ✅  
**Persistence:** Yes (localStorage) ✅
