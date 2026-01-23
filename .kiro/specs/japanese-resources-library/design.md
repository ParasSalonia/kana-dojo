# Design Document: Japanese Resources Library

## Overview

The Japanese Resources Library is a comprehensive, standalone feature that provides a curated catalogue of high-quality Japanese learning resources. It functions as a self-contained mini-application accessible at `/resources`, featuring premium visual design, extensive SEO optimization, and a data-driven architecture for easy maintenance.

The library will contain 200+ resources across 15+ categories, with dedicated crawlable routes for each category and subcategory to maximize search engine visibility. The design prioritizes static visual appeal with tasteful animations, responsive layouts, and full accessibility compliance.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         App Router (Next.js 15)                      │
├─────────────────────────────────────────────────────────────────────┤
│  /[locale]/resources                    → Main Library Page (SSG)    │
│  /[locale]/resources/[category]         → Category Page (SSG)        │
│  /[locale]/resources/[category]/[sub]   → Subcategory Page (SSG)     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    features/Resources Module                         │
├─────────────────────────────────────────────────────────────────────┤
│  components/     → UI Components (Cards, Filters, Search, etc.)      │
│  data/           → Resource JSON data files                          │
│  lib/            → Filtering, search, and utility functions          │
│  types/          → TypeScript interfaces                             │
│  hooks/          → Custom React hooks                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Shared Components                               │
├─────────────────────────────────────────────────────────────────────┤
│  SEO/            → BreadcrumbSchema, FAQSchema, ItemListSchema       │
│  ui/             → Button, Input, Dialog, etc.                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Routing Structure (SEO-Optimized)

All routes are statically generated (SSG) for optimal crawlability:

```
/resources                              → Main library landing page
/resources/apps                         → Apps category
/resources/apps/flashcards              → Flashcard apps subcategory
/resources/apps/dictionaries            → Dictionary apps subcategory
/resources/textbooks                    → Textbooks category
/resources/textbooks/beginner           → Beginner textbooks
/resources/youtube                      → YouTube channels category
/resources/youtube/grammar              → Grammar-focused channels
/resources/games                        → Video games category
/resources/jlpt                         → JLPT preparation category
/resources/jlpt/n5                      → JLPT N5 resources
... (all categories and subcategories)
```

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  JSON Data   │────▶│  Data Layer  │────▶│  Components  │
│  (Static)    │     │  (Filtering) │     │  (UI)        │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  URL State   │
                     │  (Filters)   │
                     └──────────────┘
```

## Components and Interfaces

### Page Components

```typescript
// Main Library Page
interface ResourcesPageProps {
  params: { locale: string };
}

// Category Page
interface CategoryPageProps {
  params: { locale: string; category: string };
}

// Subcategory Page
interface SubcategoryPageProps {
  params: { locale: string; category: string; subcategory: string };
}
```

### Core UI Components

```typescript
// ResourceCard - Displays a single resource
interface ResourceCardProps {
  resource: Resource;
  onSelect: (resource: Resource) => void;
  isCompact?: boolean;
}

// ResourceGrid - Grid layout for resource cards
interface ResourceGridProps {
  resources: Resource[];
  onResourceSelect: (resource: Resource) => void;
  isLoading?: boolean;
}

// CategoryNav - Category navigation sidebar/tabs
interface CategoryNavProps {
  categories: CategoryWithCount[];
  activeCategory?: string;
  activeSubcategory?: string;
}

// SearchBar - Search input with instant results
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}

// FilterPanel - Advanced filtering controls
interface FilterPanelProps {
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  availableFilters: FilterOptions;
}

// ResourceDetailModal - Detailed resource view
interface ResourceDetailModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  relatedResources?: Resource[];
}

// Breadcrumbs - Navigation breadcrumbs with SEO
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// CategoryHeader - Category page header with description
interface CategoryHeaderProps {
  category: Category;
  resourceCount: number;
}
```

### Filter Components

```typescript
// DifficultyFilter
interface DifficultyFilterProps {
  selected: DifficultyLevel[];
  onChange: (levels: DifficultyLevel[]) => void;
}

// PriceFilter
interface PriceFilterProps {
  selected: PriceType[];
  onChange: (types: PriceType[]) => void;
}

// PlatformFilter
interface PlatformFilterProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

// ActiveFilterTags - Shows active filters with remove buttons
interface ActiveFilterTagsProps {
  filters: ActiveFilters;
  onRemove: (filterType: string, value: string) => void;
  onClearAll: () => void;
}
```

## Data Models

### Core Types

```typescript
// Resource - A single learning resource
interface Resource {
  id: string;
  name: string;
  nameJa?: string; // Japanese name if applicable
  description: string;
  descriptionLong?: string; // Extended description for detail view
  category: CategoryId;
  subcategory: SubcategoryId;
  tags: string[];
  difficulty: DifficultyLevel;
  priceType: PriceType;
  priceDetails?: string; // e.g., "$9.99/month", "Free with ads"
  platforms: Platform[];
  url: string;
  imageUrl?: string;
  rating?: number; // 1-5 scale
  featured?: boolean;
  notes?: string;
  lastUpdated?: string; // ISO date
}

// Category definition
interface Category {
  id: CategoryId;
  name: string;
  nameJa: string;
  description: string;
  descriptionLong: string; // SEO content for category pages
  icon: string; // Lucide icon name
  subcategories: Subcategory[];
  order: number;
}

// Subcategory definition
interface Subcategory {
  id: SubcategoryId;
  name: string;
  nameJa: string;
  description: string;
  descriptionLong: string;
  parentCategory: CategoryId;
}

// Enums
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

type PriceType = 'free' | 'freemium' | 'paid' | 'subscription';

type Platform =
  | 'web'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'linux'
  | 'physical'
  | 'browser-extension'
  | 'api';

type CategoryId =
  | 'apps'
  | 'websites'
  | 'textbooks'
  | 'youtube'
  | 'podcasts'
  | 'games'
  | 'jlpt'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'grammar'
  | 'vocabulary'
  | 'kanji'
  | 'immersion'
  | 'community';

type SubcategoryId = string; // Dynamic based on category
```

### Filter Types

```typescript
interface ActiveFilters {
  difficulty: DifficultyLevel[];
  priceType: PriceType[];
  platforms: Platform[];
  search: string;
}

interface FilterOptions {
  difficulties: { value: DifficultyLevel; count: number }[];
  priceTypes: { value: PriceType; count: number }[];
  platforms: { value: Platform; count: number }[];
}

interface CategoryWithCount extends Category {
  resourceCount: number;
  subcategoriesWithCount: (Subcategory & { resourceCount: number })[];
}
```

### SEO Types

```typescript
interface ResourcePageSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  breadcrumbs: BreadcrumbItem[];
  structuredData: {
    itemList: ItemListSchema;
    breadcrumb: BreadcrumbListSchema;
    faq?: FAQPageSchema;
  };
}
```

## Data Structure

### JSON File Organization

```
features/Resources/data/
├── categories.json          # Category and subcategory definitions
├── resources/
│   ├── apps.json            # App resources
│   ├── websites.json        # Website resources
│   ├── textbooks.json       # Textbook resources
│   ├── youtube.json         # YouTube channel resources
│   ├── podcasts.json        # Podcast resources
│   ├── games.json           # Video game resources
│   ├── jlpt.json            # JLPT-specific resources
│   ├── reading.json         # Reading resources
│   ├── listening.json       # Listening resources
│   ├── speaking.json        # Speaking resources
│   ├── writing.json         # Writing resources
│   ├── grammar.json         # Grammar resources
│   ├── vocabulary.json      # Vocabulary resources
│   ├── kanji.json           # Kanji resources
│   ├── immersion.json       # Immersion tools
│   └── community.json       # Community resources
└── index.ts                 # Data aggregation and exports
```

### Sample Resource Entry

```json
{
  "id": "anki",
  "name": "Anki",
  "nameJa": "アンキ",
  "description": "Powerful, intelligent flashcard app using spaced repetition for efficient memorization.",
  "descriptionLong": "Anki is a free, open-source flashcard application that uses spaced repetition algorithms to optimize your learning. It's particularly popular among Japanese learners for memorizing kanji, vocabulary, and grammar patterns. The app supports multimedia cards, custom deck creation, and has a vast library of shared decks.",
  "category": "apps",
  "subcategory": "flashcards",
  "tags": [
    "flashcards",
    "SRS",
    "spaced-repetition",
    "vocabulary",
    "kanji",
    "free",
    "open-source"
  ],
  "difficulty": "all-levels",
  "priceType": "free",
  "platforms": ["web", "ios", "android", "windows", "macos", "linux"],
  "url": "https://apps.ankiweb.net/",
  "imageUrl": "/images/resources/anki.png",
  "rating": 4.8,
  "featured": true,
  "notes": "AnkiMobile (iOS) is paid ($24.99), but desktop and AnkiDroid are free."
}
```

## SEO Implementation

### URL Structure

Each category and subcategory has a dedicated, crawlable URL:

```
/en/resources                           → English main page
/es/resources                           → Spanish main page
/ja/resources                           → Japanese main page
/en/resources/apps                      → Apps category (English)
/en/resources/apps/flashcards           → Flashcard apps (English)
```

### Meta Tags Generation

```typescript
// Category page metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const category = getCategoryById(params.category);

  return {
    title: `Best ${category.name} for Learning Japanese - KanaDojo Resources`,
    description: `Discover the best ${category.name.toLowerCase()} for learning Japanese. Curated list of ${category.resourceCount}+ resources for all levels.`,
    keywords: [
      `japanese ${category.name.toLowerCase()}`,
      `learn japanese ${category.name.toLowerCase()}`,
      `best ${category.name.toLowerCase()} japanese`,
      ...category.seoKeywords,
    ],
    openGraph: {
      title: `Best ${category.name} for Learning Japanese`,
      description: category.description,
      type: 'website',
      url: `https://kanadojo.com/resources/${category.id}`,
    },
    alternates: {
      canonical: `https://kanadojo.com/resources/${category.id}`,
      languages: {
        en: `/en/resources/${category.id}`,
        es: `/es/resources/${category.id}`,
        ja: `/ja/resources/${category.id}`,
      },
    },
  };
}
```

### Structured Data

Each page includes appropriate JSON-LD structured data:

```typescript
// ItemList schema for resource listings
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Japanese Learning Apps',
  description: 'Curated list of the best apps for learning Japanese',
  numberOfItems: resources.length,
  itemListElement: resources.map((resource, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: resource.name,
      description: resource.description,
      url: resource.url,
      applicationCategory: 'EducationalApplication',
      operatingSystem: resource.platforms.join(', '),
      offers: {
        '@type': 'Offer',
        price: resource.priceType === 'free' ? '0' : undefined,
        priceCurrency: 'USD',
      },
    },
  })),
};

// BreadcrumbList schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://kanadojo.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Resources',
      item: 'https://kanadojo.com/resources',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Apps',
      item: 'https://kanadojo.com/resources/apps',
    },
  ],
};
```

### Static Generation

All pages are statically generated at build time:

```typescript
// Generate static params for all categories and subcategories
export async function generateStaticParams() {
  const categories = getAllCategories();
  const params = [];

  // Category pages
  for (const category of categories) {
    params.push({ category: category.id });

    // Subcategory pages
    for (const subcategory of category.subcategories) {
      params.push({
        category: category.id,
        subcategory: subcategory.id,
      });
    }
  }

  return params;
}

// ISR for periodic updates
export const revalidate = 86400; // Revalidate daily
```

### Internal Linking Strategy

- Each resource card links to related categories
- Category pages link to related categories
- Breadcrumbs provide hierarchical navigation
- Footer includes links to all top-level categories
- "Related Resources" section in detail modal

## Visual Design System

### Design Principles

1. **Premium Aesthetic**: Clean, modern design with generous whitespace
2. **Visual Hierarchy**: Clear distinction between categories, cards, and actions
3. **Subtle Animations**: Tasteful transitions that enhance UX without distraction
4. **Theme Consistency**: Full support for light/dark themes using CSS variables
5. **Responsive First**: Mobile-optimized with progressive enhancement

### Color System

Uses existing KanaDojo theme variables:

- `--background`: Page background
- `--card`: Card backgrounds
- `--border`: Borders and dividers
- `--main`: Primary accent color
- `--secondary`: Secondary accent color

### Typography

- **Headings**: System font stack with Japanese fallbacks
- **Body**: Readable size (16px base) with comfortable line height
- **Cards**: Slightly smaller (14px) for density

### Spacing Scale

```css
--space-xs: 0.25rem; /* 4px */
--space-sm: 0.5rem; /* 8px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
```

### Animation Specifications

```css
/* Card hover */
.resource-card {
  transition:
    transform 150ms ease-out,
    box-shadow 150ms ease-out;
}
.resource-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Filter transitions */
.filter-panel {
  transition:
    height 200ms ease-out,
    opacity 150ms ease-out;
}

/* Content fade */
.resource-grid {
  transition: opacity 150ms ease-out;
}

/* Modal */
.modal-overlay {
  transition: opacity 200ms ease-out;
}
.modal-content {
  transition:
    transform 200ms ease-out,
    opacity 200ms ease-out;
}
```

### Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}
```

### Grid Layouts

```css
/* Resource grid */
.resource-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

@media (min-width: 640px) {
  .resource-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .resource-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}

@media (min-width: 1280px) {
  .resource-grid {
    grid-template-columns: repeat(4, 1fr); /* Large: 4 columns */
  }
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Resource Card Rendering Completeness

_For any_ resource in the data, when rendered as a ResourceCard component, the output should contain the resource name, description, category, difficulty level, price type, and at least one platform indicator.

**Validates: Requirements 1.3**

### Property 2: Category and Subcategory Filtering Correctness

_For any_ category or subcategory selection, all resources returned by the filter function should have a `category` field matching the selected category, and if a subcategory is selected, the `subcategory` field should also match.

**Validates: Requirements 2.2, 2.4**

### Property 3: Category Resource Count Accuracy

_For any_ category in the navigation, the displayed resource count should equal the actual count of resources in the data that belong to that category.

**Validates: Requirements 2.5**

### Property 4: Search Result Relevance

_For any_ non-empty search query, all resources returned by the search function should contain the query string (case-insensitive) in at least one of: name, description, or tags array.

**Validates: Requirements 3.2**

### Property 5: Multi-Filter Correctness

_For any_ combination of active filters (difficulty, priceType, platforms), all resources returned should satisfy ALL active filter criteria simultaneously. A resource satisfies a filter if its corresponding field matches (for single-value fields) or includes (for array fields like platforms) at least one of the selected filter values.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 6: Resource Detail Completeness

_For any_ resource displayed in the detail view, the rendered output should include: full description (or descriptionLong if available), all tags, difficulty level, price type, all platforms, the external URL, and notes if present.

**Validates: Requirements 5.2**

### Property 7: Resource Data Schema Validation

_For any_ resource in the data files, it should contain all required fields (id, name, description, category, subcategory, tags, difficulty, priceType, platforms, url) with correct types, and the difficulty and priceType values should be from the allowed enum values.

**Validates: Requirements 6.2, 6.3**

### Property 8: Route Generation for Categories

_For any_ category defined in the categories data, there should exist a corresponding route at `/resources/{categoryId}`, and for any subcategory, there should exist a route at `/resources/{categoryId}/{subcategoryId}`.

**Validates: Requirements 10.1**

### Property 9: SEO Metadata Completeness

_For any_ page in the resources section (main, category, or subcategory), the page metadata should include: a unique title containing relevant keywords, a description between 50-160 characters, a canonical URL, Open Graph tags (title, description, url, type), Twitter Card tags, and hreflang tags for all supported locales.

**Validates: Requirements 10.2, 10.7, 10.8, 10.14**

### Property 10: Structured Data Validity

_For any_ page in the resources section, the JSON-LD structured data should be valid JSON, include the correct @context ("https://schema.org"), and use appropriate @type values (ItemList for listings, BreadcrumbList for navigation).

**Validates: Requirements 10.3, 10.9**

### Property 11: Sitemap Completeness

_For any_ category and subcategory defined in the data, the sitemap should contain a corresponding URL entry with the correct path format.

**Validates: Requirements 10.4**

### Property 12: Heading Hierarchy Correctness

_For any_ page in the resources section, there should be exactly one h1 element, and heading levels should not skip (e.g., h1 followed by h3 without h2).

**Validates: Requirements 10.5**

### Property 13: Image Alt Text Presence

_For any_ image element rendered in the resources section, it should have a non-empty alt attribute.

**Validates: Requirements 10.6**

### Property 14: Internal Linking Presence

_For any_ category page, there should be at least one internal link to a related category or the main resources page.

**Validates: Requirements 10.11**

### Property 15: Category Content Presence

_For any_ category page, there should be descriptive content (descriptionLong) with at least 100 characters to provide topical authority.

**Validates: Requirements 10.12**

## Error Handling

### Data Loading Errors

```typescript
// Graceful fallback for missing data
function getResources(category?: string): Resource[] {
  try {
    const data = loadResourceData(category);
    return validateResources(data);
  } catch (error) {
    console.error('Failed to load resources:', error);
    return []; // Return empty array, UI shows empty state
  }
}
```

### Invalid Filter Values

```typescript
// Sanitize filter values from URL params
function parseFilters(searchParams: URLSearchParams): ActiveFilters {
  const difficulty = searchParams
    .getAll('difficulty')
    .filter(isValidDifficulty);
  const priceType = searchParams.getAll('price').filter(isValidPriceType);
  const platforms = searchParams.getAll('platform').filter(isValidPlatform);

  return { difficulty, priceType, platforms, search: '' };
}
```

### Missing Resources

```typescript
// Handle missing resource in detail view
function ResourceDetailModal({ resourceId }: { resourceId: string }) {
  const resource = getResourceById(resourceId);

  if (!resource) {
    return <NotFoundState message="Resource not found" />;
  }

  return <ResourceDetail resource={resource} />;
}
```

### Invalid Routes

```typescript
// Return 404 for invalid category/subcategory
export async function generateStaticParams() {
  // Only generate valid routes
  return getAllValidRoutes();
}

// In page component
export default function CategoryPage({ params }) {
  const category = getCategoryById(params.category);

  if (!category) {
    notFound(); // Next.js 404
  }

  return <CategoryView category={category} />;
}
```

## Testing Strategy

### Unit Tests

Unit tests focus on specific examples and edge cases:

1. **Data validation tests**
   - Test that sample resources pass schema validation
   - Test that invalid resources fail validation with correct errors
   - Test edge cases: empty tags array, missing optional fields

2. **Filter function tests**
   - Test single filter application
   - Test filter with no matching results
   - Test clearing filters

3. **Search function tests**
   - Test exact match in name
   - Test partial match in description
   - Test match in tags
   - Test case insensitivity
   - Test empty query returns all

4. **SEO helper tests**
   - Test metadata generation for each page type
   - Test breadcrumb generation
   - Test structured data format

### Property-Based Tests

Property-based tests verify universal properties across generated inputs using **fast-check** library.

**Configuration:**

- Minimum 100 iterations per property test
- Each test tagged with: **Feature: japanese-resources-library, Property {number}: {property_text}**

**Property Tests to Implement:**

1. **Property 2: Category Filtering** - Generate random category selections and verify all returned resources match
2. **Property 4: Search Relevance** - Generate random search queries from resource data and verify matches
3. **Property 5: Multi-Filter Correctness** - Generate random filter combinations and verify all results satisfy all criteria
4. **Property 7: Schema Validation** - Generate random resource objects and verify validation correctness
5. **Property 9: SEO Metadata** - Generate page params and verify metadata completeness
6. **Property 10: Structured Data** - Generate page data and verify JSON-LD validity

### Integration Tests

1. **Page rendering tests**
   - Test main resources page renders with data
   - Test category pages render with filtered data
   - Test subcategory pages render correctly

2. **Navigation tests**
   - Test category navigation updates URL
   - Test breadcrumb links work correctly

3. **Accessibility tests**
   - Test keyboard navigation through resource grid
   - Test ARIA labels are present
   - Test focus management in modal

### Test File Structure

```
features/Resources/__tests__/
├── data.test.ts           # Data validation tests
├── filters.test.ts        # Filter function tests
├── search.test.ts         # Search function tests
├── seo.test.ts            # SEO helper tests
├── filters.property.test.ts    # Property tests for filtering
├── search.property.test.ts     # Property tests for search
├── validation.property.test.ts # Property tests for data validation
└── seo.property.test.ts        # Property tests for SEO
```
