'use client';

import React, { useRef, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import type { Resource } from '../types';
import { ResourceCard } from './ResourceCard';

// ============================================================================
// Types
// ============================================================================

export interface ResourceGridProps {
  /** Array of resources to display */
  resources: Resource[];
  /** Callback when a resource is selected */
  onResourceSelect?: (resource: Resource) => void;
  /** Whether the grid is in loading state */
  isLoading?: boolean;
  /** Number of skeleton cards to show when loading */
  skeletonCount?: number;
  /** Additional CSS classes */
  className?: string;
  /** ID for the grid element (for aria-controls) */
  id?: string;
}

// ============================================================================
// Skeleton Component
// ============================================================================

/**
 * Skeleton card for loading state
 */
function ResourceCardSkeleton() {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl bg-[var(--card-color)]',
        'border border-[var(--border-color)]',
        'animate-pulse p-4',
      )}
      aria-hidden='true'
    >
      {/* Title skeleton */}
      <div className='h-5 w-3/4 rounded bg-[var(--border-color)]' />

      {/* Description skeleton */}
      <div className='mt-2 space-y-2'>
        <div className='h-3 w-full rounded bg-[var(--border-color)]' />
        <div className='h-3 w-5/6 rounded bg-[var(--border-color)]' />
        <div className='h-3 w-4/6 rounded bg-[var(--border-color)]' />
      </div>

      {/* Badges skeleton */}
      <div className='mt-3 flex gap-1.5'>
        <div className='h-5 w-16 rounded-md bg-[var(--border-color)]' />
        <div className='h-5 w-20 rounded-md bg-[var(--border-color)]' />
        <div className='h-5 w-14 rounded-md bg-[var(--border-color)]' />
      </div>

      {/* Platform icons skeleton */}
      <div className='mt-3 flex gap-2'>
        <div className='h-4 w-4 rounded bg-[var(--border-color)]' />
        <div className='h-4 w-4 rounded bg-[var(--border-color)]' />
        <div className='h-4 w-4 rounded bg-[var(--border-color)]' />
      </div>
    </div>
  );
}

// ============================================================================
// ResourceGrid Component
// ============================================================================

/**
 * ResourceGrid displays a responsive grid of resource cards.
 *
 * Features:
 * - Responsive grid layout (1/2/3/4 columns)
 * - Loading state with skeleton cards
 * - Content transition animation
 * - Keyboard navigation support (arrow keys)
 * - ARIA live region for dynamic content updates
 *
 * @requirements 1.1, 1.4, 7.3, 8.1, 8.2, 8.4
 */
export function ResourceGrid({
  resources,
  onResourceSelect,
  isLoading = false,
  skeletonCount = 8,
  className,
  id = 'resource-grid',
}: ResourceGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation within the grid
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      if (!gridRef.current) return;

      const items = gridRef.current.querySelectorAll<HTMLElement>(
        '[role="listitem"] [role="button"]',
      );
      const itemCount = items.length;
      if (itemCount === 0) return;

      // Calculate columns based on grid layout
      const gridStyle = window.getComputedStyle(gridRef.current);
      const columns = gridStyle.gridTemplateColumns.split(' ').length;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = Math.min(currentIndex + 1, itemCount - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = Math.min(currentIndex + columns, itemCount - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = Math.max(currentIndex - columns, 0);
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = itemCount - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        items[nextIndex]?.focus();
      }
    },
    [],
  );

  // Show skeletons when loading
  if (isLoading) {
    return (
      <div
        id={id}
        className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          className,
        )}
        role='list'
        aria-label='Loading resources'
        aria-busy='true'
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ResourceCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show empty state if no resources
  if (resources.length === 0) {
    return (
      <div
        id={id}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className,
        )}
        role='status'
        aria-live='polite'
        aria-label='No resources found'
      >
        <p className='text-lg font-medium text-[var(--main-color)]'>
          No resources found
        </p>
        <p className='mt-1 text-sm text-[var(--secondary-color)]'>
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Live region for announcing resource count changes */}
      <div className='sr-only' aria-live='polite' aria-atomic='true'>
        {resources.length} {resources.length === 1 ? 'resource' : 'resources'}{' '}
        found
      </div>

      <div
        ref={gridRef}
        id={id}
        className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          'transition-opacity duration-150 ease-out',
          className,
        )}
        role='list'
        aria-label={`${resources.length} resources`}
      >
        {resources.map((resource, index) => (
          <div key={resource.id} role='listitem'>
            <ResourceCard
              resource={resource}
              onSelect={onResourceSelect}
              onKeyDown={e => handleKeyDown(e, index)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ResourceGrid;
