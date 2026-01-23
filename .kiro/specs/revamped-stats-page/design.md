# Design Document: Revamped Stats Page

## Overview

The revamped Stats page will be a comprehensive dashboard that consolidates all learning statistics tracked by KanaDojo into a visually appealing, organized interface. The design follows the existing KanaDojo aesthetic with themed cards, consistent spacing, and responsive layouts.

The page will replace the current `SimpleProgress.tsx` component with a new `StatsPage.tsx` component that aggregates data from multiple stores:

- `useStatsStore` - Core session and character mastery data
- `useVisitStore` - Visit streak data
- `useAchievementStore` - Achievement progress
- Gauntlet stats from `localforage` via utility functions

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        StatsPage.tsx                            │
│                    (Main Container Component)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ OverviewStats │     │ CharacterPanel│     │ TimedModePanel│
│   Component   │     │   Component   │     │   Component   │
└───────────────┘     └───────────────┘     └───────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│GauntletPanel  │     │ MasteryChart  │     │ AchievementBar│
│   Component   │     │   Component   │     │   Component   │
└───────────────┘     └───────────────┘     └───────────────┘
```

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  useStatsStore  │     │ useVisitStore   │     │useAchievementStore│
│                 │     │                 │     │                 │
│ - allTimeStats  │     │ - visits[]      │     │ - totalPoints   │
│ - characterMastery│   │ - isLoaded      │     │ - level         │
│ - timedStats    │     │                 │     │ - unlocked      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   useStatsAggregator    │
                    │   (Custom Hook)         │
                    │                         │
                    │ Combines all stats into │
                    │ unified display format  │
                    └─────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      StatsPage.tsx      │
                    └─────────────────────────┘
```

## Components and Interfaces

### StatsPage Component

The main container component that orchestrates all sub-components.

```typescript
interface StatsPageProps {
  // No props - uses hooks for data
}

// Internal state
interface StatsPageState {
  activeContentFilter: 'all' | 'kana' | 'kanji' | 'vocabulary';
  showResetModal: boolean;
  gauntletStats: GauntletOverallStats | null;
  isLoading: boolean;
}
```

### OverviewStatsCard Component

Displays key metrics in a card grid layout.

```typescript
interface OverviewStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
```

### CharacterMasteryPanel Component

Displays character mastery with filtering and grouping.

```typescript
interface CharacterMasteryPanelProps {
  characterMastery: Record<string, { correct: number; incorrect: number }>;
  contentFilter: 'all' | 'kana' | 'kanji' | 'vocabulary';
  onFilterChange: (filter: 'all' | 'kana' | 'kanji' | 'vocabulary') => void;
}

interface CharacterMasteryItem {
  character: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
  masteryLevel: 'mastered' | 'learning' | 'needs-practice';
}
```

### TimedModeStatsPanel Component

Displays timed mode statistics per content type.

```typescript
interface TimedModeStatsPanelProps {
  kanaStats: TimedStats;
  kanjiStats: TimedStats;
  vocabularyStats: TimedStats;
}

interface TimedStats {
  correct: number;
  wrong: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
}
```

### GauntletStatsPanel Component

Displays gauntlet mode performance.

```typescript
interface GauntletStatsPanelProps {
  stats: GauntletOverallStats | null;
  isLoading: boolean;
}

interface GauntletOverallStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  totalCorrect: number;
  totalWrong: number;
  bestStreak: number;
  fastestTime: number | null;
  accuracy: number;
}
```

### MasteryDistributionChart Component

Visual representation of character mastery distribution.

```typescript
interface MasteryDistributionChartProps {
  mastered: number;
  learning: number;
  needsPractice: number;
  total: number;
}
```

### AchievementSummaryBar Component

Compact achievement progress display.

```typescript
interface AchievementSummaryBarProps {
  totalPoints: number;
  level: number;
  unlockedCount: number;
  totalAchievements: number;
}
```

## Data Models

### Aggregated Stats Model

```typescript
interface AggregatedStats {
  // Overview
  totalSessions: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number;
  bestStreak: number;
  uniqueCharactersLearned: number;

  // Character Mastery
  characterMastery: CharacterMasteryItem[];
  masteredCount: number;
  learningCount: number;
  needsPracticeCount: number;

  // Timed Mode
  timedKana: TimedStats;
  timedKanji: TimedStats;
  timedVocabulary: TimedStats;

  // Gauntlet
  gauntlet: GauntletOverallStats | null;

  // Achievements
  achievementPoints: number;
  achievementLevel: number;
  unlockedAchievements: number;
  totalAchievements: number;
}
```

### Character Classification Logic

```typescript
function classifyCharacter(
  correct: number,
  incorrect: number,
): 'mastered' | 'learning' | 'needs-practice' {
  const total = correct + incorrect;
  const accuracy = total > 0 ? correct / total : 0;

  if (total >= 10 && accuracy >= 0.9) {
    return 'mastered';
  }
  if (total >= 5 && accuracy < 0.7) {
    return 'needs-practice';
  }
  return 'learning';
}
```

### Content Type Detection

```typescript
function detectContentType(character: string): 'kana' | 'kanji' | 'vocabulary' {
  // Hiragana: U+3040 - U+309F
  // Katakana: U+30A0 - U+30FF
  // Kanji: U+4E00 - U+9FAF
  const code = character.charCodeAt(0);

  if (code >= 0x3040 && code <= 0x309f) return 'kana'; // Hiragana
  if (code >= 0x30a0 && code <= 0x30ff) return 'kana'; // Katakana
  if (code >= 0x4e00 && code <= 0x9faf) return 'kanji';

  // Multi-character strings are likely vocabulary
  if (character.length > 1) return 'vocabulary';

  return 'kanji'; // Default for single characters
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Stats Overview Display Completeness

_For any_ valid stats data containing sessions, correct/incorrect counts, best streak, and character mastery, the rendered Stats_Dashboard output should contain all key metrics: total sessions, overall accuracy percentage, best streak, unique characters count, and total correct/incorrect answers.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: Character Mastery Classification - Mastered Threshold

_For any_ character with correct count C and incorrect count I where (C + I) >= 10 and C / (C + I) >= 0.9, the classifyCharacter function should return 'mastered'.

**Validates: Requirements 2.2**

### Property 3: Character Mastery Classification - Needs Practice Threshold

_For any_ character with correct count C and incorrect count I where (C + I) >= 5 and C / (C + I) < 0.7, the classifyCharacter function should return 'needs-practice'.

**Validates: Requirements 2.3**

### Property 4: Character Filtering by Content Type

_For any_ set of characters with mixed content types (kana, kanji, vocabulary), when filtered by a specific content type, the result should only contain characters of that type, and the count should equal the number of characters of that type in the original set.

**Validates: Requirements 2.5**

### Property 5: Top Characters Identification

_For any_ set of characters with accuracy data, the top 5 most difficult characters should be the 5 characters with the lowest accuracy (among those with sufficient attempts), and the top 5 mastered characters should be the 5 characters with the highest accuracy (among those meeting mastery criteria).

**Validates: Requirements 2.6, 2.7**

### Property 6: Timed Mode Stats Display

_For any_ timed mode stats containing correct, wrong, streak, and bestStreak values, the rendered Timed_Mode_Panel should display all these values plus a correctly calculated accuracy percentage (correct / (correct + wrong) \* 100).

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 7: Gauntlet Stats Display

_For any_ gauntlet stats containing totalSessions, completedSessions, totalCorrect, totalWrong, bestStreak, and fastestTime, the rendered Gauntlet_Stats_Panel should display all these values plus correctly calculated completion rate and accuracy percentages.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 8: Mastery Distribution Calculation

_For any_ set of character mastery data, the sum of mastered + learning + needsPractice counts should equal the total number of characters, and the percentage proportions should sum to 100%.

**Validates: Requirements 5.1, 5.2**

### Property 9: Achievement Summary Display

_For any_ achievement data containing totalPoints, level, unlockedCount, and totalAchievements, the rendered achievement summary should display all these values correctly.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 10: Accuracy Calculation Correctness

_For any_ correct count C and incorrect count I where (C + I) > 0, the calculated accuracy should equal C / (C + I) \* 100, rounded appropriately. When (C + I) = 0, accuracy should be 0.

**Validates: Requirements 1.2, 3.4, 4.4**

## Error Handling

### Empty State Handling

- When `allTimeStats` has zero sessions, display a friendly empty state message encouraging the user to start practicing
- When `characterMastery` is empty, show "No characters practiced yet" message
- When gauntlet stats fail to load from localforage, display "Unable to load gauntlet stats" with a retry option
- When timed mode stats are all zeros, display the zeros with appropriate context

### Data Validation

- Validate that accuracy calculations handle division by zero (return 0 when total attempts is 0)
- Validate that character mastery data has valid correct/incorrect counts (non-negative integers)
- Handle malformed character strings gracefully in content type detection

### Loading States

- Display skeleton loaders while gauntlet stats are being fetched from localforage
- Show loading indicator during stats aggregation if data is large

### Reset Error Handling

- If `clearAllProgress` fails, display an error toast and maintain current state
- Log errors to console for debugging purposes

## Testing Strategy

### Property-Based Testing Configuration

- **Library**: fast-check for TypeScript property-based testing
- **Minimum iterations**: 100 per property test
- **Tag format**: `Feature: revamped-stats-page, Property {number}: {property_text}`

### Unit Tests

Unit tests will cover:

- Specific examples of character classification at boundary values
- Edge cases for empty data states
- Reset dialog interaction flow
- Content type detection for known character sets

### Property Tests

Each correctness property will be implemented as a property-based test:

1. **Stats Overview Display**: Generate random stats objects, render component, verify all metrics present
2. **Mastery Classification**: Generate random correct/incorrect pairs, verify classification logic
3. **Content Type Filtering**: Generate mixed character sets, verify filtering correctness
4. **Top Characters**: Generate character sets with varying accuracies, verify sorting
5. **Timed Mode Display**: Generate random timed stats, verify display completeness
6. **Gauntlet Display**: Generate random gauntlet stats, verify calculations
7. **Distribution Calculation**: Generate character sets, verify proportions sum correctly
8. **Achievement Display**: Generate achievement data, verify display
9. **Accuracy Calculation**: Generate correct/incorrect pairs, verify formula

### Test File Structure

```
features/Progress/__tests__/
├── StatsPage.test.tsx           # Unit tests for main component
├── StatsPage.property.test.tsx  # Property tests for display
├── classifyCharacter.property.test.ts  # Property tests for classification
├── calculateAccuracy.property.test.ts  # Property tests for accuracy
├── detectContentType.property.test.ts  # Property tests for content detection
└── masteryDistribution.property.test.ts # Property tests for distribution
```

### Integration Points

- Test that `useStatsStore` data flows correctly to display components
- Test that gauntlet stats load asynchronously and update UI
- Test reset functionality clears all relevant stores
