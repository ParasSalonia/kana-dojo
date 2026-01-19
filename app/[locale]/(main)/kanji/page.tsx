import DojoMenu from '@/shared/components/Menu/DojoMenu';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';
import { CourseSchema } from '@/shared/components/SEO/CourseSchema';
import { routing } from '@/core/i18n/routing';

// Generate static pages for all locales at build time
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanji');
}

export default function KanjiPage() {
  return (
    <>
      <CourseSchema
        name='Japanese Kanji Learning Course (JLPT N5-N1)'
        description='Learn Japanese Kanji characters organized by JLPT levels from N5 to N1. Master over 2,000 essential kanji with readings, meanings, and example words through interactive training modes and spaced repetition.'
        url='https://kanadojo.com/en/kanji'
        educationalLevel='Beginner to Advanced'
        skillLevel='All Levels'
        learningResourceType='Interactive Exercise and Games'
      />
      <DojoMenu />
    </>
  );
}
