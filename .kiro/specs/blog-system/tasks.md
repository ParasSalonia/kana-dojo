# Implementation Plan

- [x] 1. Set up Blog feature module structure and types
  - [x] 1.1 Create feature directory structure and TypeScript interfaces
    - Create `features/Blog/` directory with subdirectories: `components/`, `content/posts/`, `lib/`, `types/`, `__tests__/`
    - Create `features/Blog/types/blog.ts` with BlogPostMeta, BlogPost, Heading, Category, Difficulty, Locale types
    - Create `features/Blog/index.ts` barrel export file
    - _Requirements: 1.1, 1.5_

  - [x] 1.2 Write property test for BlogPostMeta serialization round-trip
    - **Property 1: Frontmatter Round-Trip Consistency**
    - **Validates: Requirements 1.1, 1.5**

- [x] 2. Implement core blog content utilities
  - [x] 2.1 Implement reading time calculation function
    - Create `features/Blog/lib/calculateReadingTime.ts`
    - Calculate reading time as ceiling of (word count / 200) with minimum of 1 minute
    - _Requirements: 1.2_

  - [x] 2.2 Write property test for reading time calculation
    - **Property 2: Reading Time Calculation Accuracy**
    - **Validates: Requirements 1.2**

  - [x] 2.3 Implement frontmatter validation function
    - Create `features/Blog/lib/validateFrontmatter.ts`
    - Validate required fields: title, description, publishedAt, author, category, tags
    - Return error result with list of missing fields when validation fails
    - _Requirements: 1.4_

  - [x] 2.4 Write property test for frontmatter validation
    - **Property 3: Frontmatter Validation Identifies Missing Fields**
    - **Validates: Requirements 1.4**

- [x] 3. Implement blog post fetching and parsing
  - [x] 3.1 Implement getBlogPosts function
    - Create `features/Blog/lib/getBlogPosts.ts`
    - Read MDX files from `content/posts/{locale}/` directory
    - Parse frontmatter using gray-matter library
    - Calculate reading time for each post
    - Return array of BlogPostMeta objects sorted by publishedAt descending
    - _Requirements: 1.1, 2.1, 5.1, 5.2_

  - [x] 3.2 Write property test for posts sorted by date
    - **Property 4: Posts Sorted by Date Descending**
    - **Validates: Requirements 2.1**

  - [x] 3.3 Implement getBlogPost function for single post retrieval
    - Create `features/Blog/lib/getBlogPost.ts`
    - Fetch single post by slug and locale
    - Implement English fallback when post not found in requested locale
    - Extract headings for table of contents
    - _Requirements: 3.1, 5.1, 5.2, 5.3_

  - [x] 3.4 Write property test for locale-based content retrieval
    - **Property 13: Locale-Based Content Retrieval**
    - **Validates: Requirements 5.1, 5.2**

  - [x] 3.5 Write property test for English fallback
    - **Property 14: English Fallback When Locale Missing**
    - **Validates: Requirements 5.3**

- [x] 4. Implement heading extraction and table of contents
  - [x] 4.1 Implement heading extraction from MDX content
    - Create `features/Blog/lib/extractHeadings.ts`

    - Parse MDX content to extract h2, h3, h4 headings
    - Generate unique IDs for each heading
    - Return array of Heading objects with id, text, level
    - _Requirements: 3.2_

  - [x] 4.2 Write property test for TOC extraction
    - **Property 7: Table of Contents Extraction from Headings**
    - **Validates: Requirements 3.2**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement SEO metadata and structured data generation
  - [x] 6.1 Implement blog metadata generation function
    - Create `features/Blog/lib/generateBlogMetadata.ts`
    - Generate Next.js Metadata object from BlogPostMeta
    - Include title, description, canonical URL, Open Graph tags
    - _Requirements: 4.1_

  - [x] 6.2 Write property test for metadata generation
    - **Property 9: Metadata Contains Required Fields**
    - **Validates: Requirements 4.1**

  - [x] 6.3 Implement Article structured data generation
    - Create `features/Blog/lib/generateArticleSchema.ts`
    - Generate JSON-LD Article schema from BlogPost
    - Include headline, datePublished, dateModified, author, publisher, description
    - _Requirements: 4.2_

  - [x] 6.4 Write property test for Article schema
    - **Property 10: Article Schema Contains Required Fields**
    - **Validates: Requirements 4.2**

  - [x] 6.5 Implement BreadcrumbList structured data generation
    - Create `features/Blog/lib/generateBreadcrumbSchema.ts`
    - Generate JSON-LD BreadcrumbList with Home > Blog > Post Title
    - _Requirements: 4.3_

  - [x] 6.6 Write property test for Breadcrumb schema
    - **Property 11: Breadcrumb Schema Correctly Structured**
    - **Validates: Requirements 4.3**

  - [x] 6.7 Implement hreflang tag generation for multi-locale posts
    - Create `features/Blog/lib/generateHreflang.ts`
    - Generate hreflang tags for posts that exist in multiple locales
    - _Requirements: 4.5_

  - [x] 6.8 Write property test for hreflang generation
    - **Property 12: Hreflang Tags for Multi-Locale Posts**
    - **Validates: Requirements 4.5**

- [x] 7. Implement blog UI components
  - [x] 7.1 Implement BlogCard component
    - Create `features/Blog/components/BlogCard.tsx`
    - Display title, description, category badge, reading time, publication date
    - Link to individual post page
    - Use semantic HTML and proper accessibility attributes
    - _Requirements: 2.2, 7.2_

  - [x] 7.2 Write property test for BlogCard required fields
    - **Property 5: Blog Card Contains Required Fields**
    - **Validates: Requirements 2.2**

  - [x] 7.3 Implement CategoryFilter component
    - Create `features/Blog/components/CategoryFilter.tsx`
    - Display filter buttons for each category
    - Highlight active category
    - _Requirements: 2.3_

  - [x] 7.4 Implement BlogList component with category filtering
    - Create `features/Blog/components/BlogList.tsx`
    - Display grid of BlogCard components
    - Filter posts by selected category
    - _Requirements: 2.1, 2.3_

  - [x] 7.5 Write property test for category filtering
    - **Property 6: Category Filter Returns Only Matching Posts**
    - **Validates: Requirements 2.3**

  - [x] 7.6 Implement TableOfContents component
    - Create `features/Blog/components/TableOfContents.tsx`
    - Render nested list of heading links
    - Implement smooth scroll to heading on click
    - _Requirements: 3.2_

  - [x] 7.7 Implement RelatedPosts component
    - Create `features/Blog/components/RelatedPosts.tsx`
    - Display links to related posts when relatedPosts array is non-empty
    - _Requirements: 3.3_

  - [x] 7.8 Write property test for RelatedPosts rendering
    - **Property 8: Related Posts Rendered When Present**
    - **Validates: Requirements 3.3**

- [x] 8. Implement custom MDX components
  - [x] 8.1 Implement FuriganaText component
    - Create `features/Blog/components/mdx/FuriganaText.tsx`
    - Render Japanese text with ruby/rt elements for furigana
    - _Requirements: 6.1_

  - [x] 8.2 Write property test for FuriganaText ruby structure
    - **Property 15: FuriganaText Renders Ruby Structure**
    - **Validates: Requirements 6.1**

  - [x] 8.3 Implement KanaChart component
    - Create `features/Blog/components/mdx/KanaChart.tsx`
    - Render interactive hiragana or katakana chart
    - Support extended mode for dakuten/handakuten
    - _Requirements: 6.2_

  - [x] 8.4 Write property test for KanaChart character count
    - **Property 16: KanaChart Renders Correct Character Count**
    - **Validates: Requirements 6.2**

  - [x] 8.5 Implement InfoBox component
    - Create `features/Blog/components/mdx/InfoBox.tsx`
    - Render styled callout box with type-specific styling (tip, warning, note)
    - _Requirements: 6.3_

  - [x] 8.6 Write property test for InfoBox type styling
    - **Property 17: InfoBox Renders With Correct Type Styling**
    - **Validates: Requirements 6.3**

  - [x] 8.7 Implement QuizQuestion component
    - Create `features/Blog/components/mdx/QuizQuestion.tsx`
    - Render interactive multiple-choice question
    - Handle answer selection with success/failure feedback
    - _Requirements: 6.4_

  - [x] 8.8 Write property test for QuizQuestion interaction
    - **Property 18: QuizQuestion Renders Options and Handles Selection**
    - **Validates: Requirements 6.4**

  - [x] 8.9 Create MDX component mappings
    - Create `features/Blog/components/mdx/index.ts`
    - Export component mappings for MDX renderer
    - _Requirements: 1.3_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement BlogPost renderer component
  - [x] 10.1 Implement BlogPost component
    - Create `features/Blog/components/BlogPost.tsx`
    - Render full article with MDX content using custom components
    - Include TableOfContents and RelatedPosts sections
    - Use semantic HTML (article, header, main, section)
    - Ensure proper heading hierarchy with h1 for title
    - _Requirements: 3.1, 3.2, 3.3, 7.2, 7.3_

  - [x] 10.2 Write property test for heading hierarchy
    - **Property 19: Heading Hierarchy Maintained**
    - **Validates: Requirements 7.3**

- [x] 11. Create blog page routes
  - [x] 11.1 Create blog listing page
    - Create `app/[locale]/blog/page.tsx`
    - Implement static generation with generateStaticParams
    - Fetch all posts using getBlogPosts
    - Render BlogList with CategoryFilter
    - Generate SEO metadata for listing page
    - _Requirements: 2.1, 2.4_

  - [x] 11.2 Create individual blog post page
    - Create `app/[locale]/blog/[slug]/page.tsx`
    - Implement static generation with generateStaticParams for all slugs
    - Fetch post using getBlogPost with locale fallback
    - Render BlogPost component with MDX content
    - Include Article and BreadcrumbList structured data
    - Generate SEO metadata from frontmatter
    - _Requirements: 3.1, 3.4, 4.1, 4.2, 4.3_

- [x] 12. Add i18n translations for blog feature
  - [x] 12.1 Add blog translations to locale files
    - Add blog namespace translations to `core/i18n/locales/en/blog.json`
    - Add blog namespace translations to `core/i18n/locales/es/blog.json`
    - Add blog namespace translations to `core/i18n/locales/ja/blog.json`
    - Include translations for: page titles, category names, filter labels, reading time format, related posts heading
    - _Requirements: 5.4_

- [x] 13. Create sample blog content
  - [x] 13.1 Create sample blog posts in English
    - Create `features/Blog/content/posts/en/hiragana-guide.mdx` with comprehensive hiragana learning content
    - Create `features/Blog/content/posts/en/katakana-basics.mdx` with katakana introduction
    - Include examples of all custom MDX components
    - _Requirements: 1.1, 1.3, 6.1, 6.2, 6.3, 6.4_

- [x] 14. Update sitemap configuration
  - [x] 14.1 Add blog posts to sitemap
    - Update `next-sitemap.config.js` to include blog post URLs
    - Set appropriate priority (0.8) and changefreq (weekly) for blog posts
    - _Requirements: 4.4_

- [x] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
