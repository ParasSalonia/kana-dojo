import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

/**
 * Generate metadata for a page using the metadata namespace
 * @param key - The key in the metadata translations (e.g., 'home', 'kana', 'kanji')
 * @param locale - The locale to use for translations
 * @returns Metadata object with translated content
 */
export async function generatePageMetadata(
  key: string,
  locale?: string,
): Promise<Metadata> {
  const t = locale
    ? await getTranslations({ locale, namespace: 'metadata' as const })
    : await getTranslations('metadata');

  const title = t(`${key}.title`);
  const titleShort = t(`${key}.titleShort`);
  const description = t(`${key}.description`);
  const keywords = t(`${key}.keywords`);

  // Determine OG image type based on key
  const getImageType = (key: string): string => {
    if (key.includes('kana')) return 'kana';
    if (key.includes('kanji')) return 'kanji';
    if (key.includes('vocabulary')) return 'vocabulary';
    if (key.includes('academy')) return 'academy';
    return 'default';
  };

  const imageType = getImageType(key);
  const ogImageUrl = `https://kanadojo.com/api/og?title=${encodeURIComponent(titleShort)}&description=${encodeURIComponent(description.slice(0, 100))}&type=${imageType}`;

  return {
    title,
    description,
    keywords: keywords.split(', '),
    openGraph: {
      title: titleShort,
      description,
      url: `https://kanadojo.com`,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: titleShort,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleShort,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://kanadojo.com`,
    },
  };
}

/**
 * Generate default metadata with base SEO configuration
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://kanadojo.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
};
