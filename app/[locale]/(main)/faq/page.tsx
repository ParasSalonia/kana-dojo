import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';
import { routing, type Locale } from '@/core/i18n/routing';
import FAQSection from './FAQSection';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return await generatePageMetadata('faq', locale as Locale);
}

export default async function FAQPage() {
  const t = await getTranslations('faq');

  const faqs = [
    {
      question: t('q1.question'),
      answer: t('q1.answer'),
    },
    {
      question: t('q2.question'),
      answer: t('q2.answer'),
    },
    {
      question: t('q3.question'),
      answer: t('q3.answer'),
    },
    {
      question: t('q4.question'),
      answer: t('q4.answer'),
    },
    {
      question: t('q5.question'),
      answer: t('q5.answer'),
    },
    {
      question: t('q6.question'),
      answer: t('q6.answer'),
    },
    {
      question: t('q7.question'),
      answer: t('q7.answer'),
    },
    {
      question: t('q8.question'),
      answer: t('q8.answer'),
    },
  ];

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <h1 className='mb-8 text-center text-4xl font-bold text-[var(--main-color)]'>
        {t('title')}
      </h1>
      <p className='mb-12 text-center text-lg text-[var(--secondary-color)]'>
        {t('subtitle')}
      </p>
      <FAQSection faqs={faqs} />
    </div>
  );
}
