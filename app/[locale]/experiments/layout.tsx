import SidebarLayout from '@/shared/components/layout/SidebarLayout';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('experiments');
}

export default function ExperimentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout showBanner={false}>{children}</SidebarLayout>;
}
