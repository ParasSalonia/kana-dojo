# Design Document: Japanese Translation Page

## Overview

The Japanese Translation Page is a new feature for KanaDojo that provides English-Japanese translation functionality with a strong focus on SEO optimization. The page aims to rank highly for search queries like "translate japanese", "english to japanese", and "japanese translator" while providing a polished user experience consistent with KanaDojo's aesthetic.

The feature integrates with Google Cloud Translation API for translation services and uses localforage for persistent translation history storage. The page will be accessible at the `/translate` route and will be fully internationalized using next-intl.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    app/[locale]/translate/                       │
│                         page.tsx                                 │
│              (SEO metadata, structured data, layout)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  features/Translator/                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   components/   │  │    services/    │  │     store/      │  │
│  │                 │  │                 │  │                 │  │
│  │ TranslatorPage  │  │ translationAPI  │  │ useTranslator   │  │
│  │ TranslatorInput │  │ historyService  │  │    Store        │  │
│  │ TranslatorOutput│  │                 │  │                 │  │
│  │ TranslationHist │  │                 │  │                 │  │
│  │ SEOContent      │  │                 │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │  Google Translation API │  │       localforage           │   │
│  │    (via API route)      │  │   (IndexedDB storage)       │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Page Component (app/[locale]/translate/page.tsx)

Server component responsible for SEO metadata and page structure.

```typescript
interface TranslatePageMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: OpenGraphMetadata;
  alternates: AlternateURLs;
}
```

### TranslatorPage Component

Main client component orchestrating the translation UI.

```typescript
interface TranslatorPageProps {
  initialHistory?: TranslationEntry[];
}
```

### TranslatorInput Component

Handles text input with character counting and validation.

```typescript
interface TranslatorInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  sourceLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  maxLength: number;
  isLoading: boolean;
  error?: string;
}
```

### TranslatorOutput Component

Displays translation results with copy functionality.

```typescript
interface TranslatorOutputProps {
  translation: string;
  romanization?: string;
  targetLanguage: Language;
  isLoading: boolean;
  onCopy: () => void;
}
```

### TranslationHistory Component

Displays and manages translation history.

```typescript
interface TranslationHistoryProps {
  entries: TranslationEntry[];
  onSelect: (entry: TranslationEntry) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}
```

### SEOContent Component

Static educational content for SEO purposes.

```typescript
interface SEOContentProps {
  locale: string;
}
```

## Data Models

### Language Type

```typescript
type Language = 'en' | 'ja';
```

### TranslationEntry

```typescript
interface TranslationEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  romanization?: string;
  timestamp: number;
}
```

### TranslatorState (Zustand Store)

```typescript
interface TranslatorState {
  // Input state
  sourceText: string;
  sourceLanguage: Language;
  targetLanguage: Language;

  // Output state
  translatedText: string;
  romanization: string | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;

  // History
  history: TranslationEntry[];

  // Actions
  setSourceText: (text: string) => void;
  setSourceLanguage: (lang: Language) => void;
  swapLanguages: () => void;
  translate: () => Promise<void>;
  clearInput: () => void;
  loadHistory: () => Promise<void>;
  addToHistory: (entry: TranslationEntry) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  restoreFromHistory: (entry: TranslationEntry) => void;
}
```

### API Response Types

```typescript
interface TranslationAPIResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

interface TranslationAPIError {
  code: string;
  message: string;
  status: number;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Based on the prework analysis, the following correctness properties must be maintained:

### Property 1: Translation produces result

_For any_ valid non-empty input text and selected language pair, calling the translate function should produce a non-empty translated text result (assuming API is available).
**Validates: Requirements 2.1**

### Property 2: Language auto-swap

_For any_ source language selection, the target language should automatically be set to the opposite language (en → ja, ja → en).
**Validates: Requirements 2.2**

### Property 3: Swap preserves content

_For any_ translator state with source text and translated text, swapping languages should exchange the source and target languages AND swap the source text with the translated text.
**Validates: Requirements 2.3**

### Property 4: Japanese input shows romanization

_For any_ translation where the source language is Japanese, the output should include a non-empty romanization string.
**Validates: Requirements 2.5**

### Property 5: Translation history round-trip

_For any_ translation entry saved to history, loading the history should return an entry with identical sourceText, translatedText, sourceLanguage, targetLanguage, and timestamp.
**Validates: Requirements 3.1, 3.2**

### Property 6: History click restores state

_For any_ history entry, selecting it should set the sourceText to the entry's sourceText and translatedText to the entry's translatedText.
**Validates: Requirements 3.3**

### Property 7: History delete removes entry

_For any_ history entry, after deletion, the history should not contain an entry with that id.
**Validates: Requirements 3.4**

### Property 8: Clear all empties history

_For any_ non-empty history, after clearing all, the history length should be zero.
**Validates: Requirements 3.5**

### Property 9: Clear button empties fields

_For any_ state with non-empty sourceText or translatedText, calling clearInput should result in both fields being empty strings.
**Validates: Requirements 4.2**

### Property 10: Character count accuracy

_For any_ sourceText value, the displayed character count should equal sourceText.length.
**Validates: Requirements 4.3**

### Property 11: API errors show messages

_For any_ API error response, the error state should contain a non-empty user-friendly message.
**Validates: Requirements 5.1**

## Error Handling

### API Errors

| Error Type    | Status Code | User Message                                                | Action                   |
| ------------- | ----------- | ----------------------------------------------------------- | ------------------------ |
| Network Error | -           | "Unable to connect. Please check your internet connection." | Disable translate button |
| Rate Limit    | 429         | "Too many requests. Please wait a moment and try again."    | Show retry timer         |
| Invalid Input | 400         | "Please enter valid text to translate."                     | Highlight input field    |
| Server Error  | 500         | "Translation service is temporarily unavailable."           | Suggest retry            |
| Auth Error    | 401/403     | "Translation service configuration error."                  | Log error                |

### Validation Errors

| Condition          | Message                                          |
| ------------------ | ------------------------------------------------ |
| Empty input        | "Please enter text to translate"                 |
| Exceeds 5000 chars | "Text exceeds maximum length of 5000 characters" |

### Offline Handling

- Monitor `navigator.onLine` status
- Display offline indicator in UI
- Disable translate button when offline
- History operations remain available (localforage works offline)

## Testing Strategy

### Property-Based Testing

The project uses `fast-check` for property-based testing. Each correctness property will be implemented as a property-based test with a minimum of 100 iterations.

Test file location: `features/Translator/__tests__/translator.property.test.ts`

Property tests will use generators for:

- Random text strings (including Unicode, Japanese characters)
- Random language selections
- Random translation entries
- Random history states

### Unit Testing

Unit tests will cover:

- Component rendering and interactions
- API service error handling
- History service CRUD operations
- Store action behaviors

Test file locations:

- `features/Translator/__tests__/translationAPI.test.ts`
- `features/Translator/__tests__/historyService.test.ts`
- `features/Translator/__tests__/useTranslatorStore.test.ts`

### Test Annotations

All property-based tests must include the annotation format:

```typescript
// **Feature: japanese-translator, Property {number}: {property_text}**
```

## SEO Implementation Details

### Meta Tags Strategy

```typescript
export const metadata: Metadata = {
  title:
    'Japanese Translator - Translate English to Japanese & Japanese to English | KanaDojo',
  description:
    'Free online Japanese translator. Translate English to Japanese or Japanese to English instantly. Features romanization (romaji), translation history, and accurate translations powered by Google Translate.',
  keywords: [
    'translate japanese',
    'japanese translator',
    'english to japanese',
    'japanese to english',
    'japanese translation',
    'translate to japanese',
    'japanese english translator',
    'romaji translator',
    'hiragana translator',
    'katakana translator',
    'free japanese translator',
  ],
  // ... additional metadata
};
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "KanaDojo Japanese Translator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "English to Japanese translation",
    "Japanese to English translation",
    "Romanization (romaji) display",
    "Translation history",
    "Copy to clipboard"
  ]
}
```

### Static SEO Content

The page will include a collapsible educational section with:

- "How to use the Japanese translator"
- "About Japanese writing systems"
- "Tips for accurate translations"
- FAQ section with common translation questions

This content targets long-tail keywords and improves content relevance.

### URL Structure

- Primary: `/translate`
- Localized: `/en/translate`, `/es/translate`, `/ja/translate`
- Canonical: `https://kanadojo.com/translate`
