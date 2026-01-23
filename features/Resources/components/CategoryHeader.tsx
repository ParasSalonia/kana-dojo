'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { Category, CategoryWithCount } from '../types';

export interface CategoryHeaderProps {
  /** Category data (can be with or without count) */
  category: Category | CategoryWithCount;
  /** Resource count (optional if using CategoryWithCount) */
  resourceCount?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the long description */
  showLongDescription?: boolean;
}

/**
 * CategoryHeader displays category information with SEO-optimized content
 * Shows category name, description, resource count, and optional long-form content
 *
 * @requirements 10.12, 8.2
 */
export function CategoryHeader({
  category,
  resourceCount,
  className,
  showLongDescription = true,
}: CategoryHeaderProps) {
  // Get resource count from either prop or CategoryWithCount
  const count =
    resourceCount ?? ('resourceCount' in category ? category.resourceCount : 0);

  return (
    <header className={cn('space-y-4', className)} role='banner'>
      {/* Category Title and Count */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
          {category.name}
          {category.nameJa && (
            <span
              className='text-muted-foreground ml-2 text-xl font-normal md:text-2xl'
              lang='ja'
            >
              ({category.nameJa})
            </span>
          )}
        </h1>
        <div className='flex items-center gap-2'>
          <span
            className='bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium'
            aria-label={`${count} ${count === 1 ? 'resource' : 'resources'} in this category`}
          >
            {count} {count === 1 ? 'resource' : 'resources'}
          </span>
        </div>
      </div>

      {/* Short Description */}
      <p className='text-muted-foreground text-lg'>{category.description}</p>

      {/* Long-form SEO Content */}
      {showLongDescription && category.descriptionLong && (
        <div
          className='prose prose-sm dark:prose-invert max-w-none'
          aria-label='Detailed category description'
        >
          <div
            className='text-muted-foreground'
            dangerouslySetInnerHTML={{ __html: category.descriptionLong }}
          />
        </div>
      )}
    </header>
  );
}
