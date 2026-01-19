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
  return await generatePageMetadata('kana');
}

export default function KanaPage() {
  return (
    <>
      <CourseSchema
        name='Japanese Hiragana and Katakana Course'
        description='Master Japanese Hiragana and Katakana syllabaries with interactive games and exercises. Learn all 92 basic kana characters plus dakuon, yoon, and foreign sound variations through multiple training modes.'
        url='https://kanadojo.com/en/kana'
        educationalLevel='Beginner'
        skillLevel='Beginner'
        learningResourceType='Interactive Exercise and Games'
      />
      <DojoMenu />
    </>
  );
}
