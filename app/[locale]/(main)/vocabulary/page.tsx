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
  return await generatePageMetadata('vocabulary');
}

export default function VocabularyPage() {
  return (
    <>
      <CourseSchema
        name='Japanese Vocabulary Building Course (JLPT N5-N1)'
        description='Build your Japanese vocabulary with thousands of words organized by JLPT levels. Learn nouns, verbs, adjectives, and adverbs with example sentences, readings, and interactive quizzes from beginner to advanced levels.'
        url='https://kanadojo.com/en/vocabulary'
        educationalLevel='Beginner to Advanced'
        skillLevel='All Levels'
        learningResourceType='Interactive Exercise and Games'
      />
      <DojoMenu />
    </>
  );
}
