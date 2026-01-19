'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='space-y-4'>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className='overflow-hidden rounded-lg border-2 border-[var(--border-color)] bg-[var(--card-color)] transition-all hover:border-[var(--main-color)]'
        >
          <button
            onClick={() => toggleFAQ(index)}
            className='flex w-full items-center justify-between px-6 py-4 text-left transition-colors'
            aria-expanded={openIndex === index}
          >
            <h3 className='text-lg font-semibold text-[var(--main-color)]'>
              {faq.question}
            </h3>
            <ChevronDown
              className={`h-5 w-5 flex-shrink-0 text-[var(--secondary-color)] transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className='px-6 pt-2 pb-4 text-[var(--secondary-color)]'>
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
