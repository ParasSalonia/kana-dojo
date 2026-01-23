'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import type { CategoryWithCount } from '../types';
import {
  Smartphone,
  Globe,
  BookOpen,
  Youtube,
  Headphones,
  Gamepad2,
  GraduationCap,
  BookText,
  Ear,
  MessageCircle,
  PenTool,
  FileText,
  Library,
  Languages,
  Waves,
  Users,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface CategoryNavProps {
  /** Categories with resource counts */
  categories: CategoryWithCount[];
  /** Currently active category ID */
  activeCategory?: string;
  /** Currently active subcategory ID */
  activeSubcategory?: string;
  /** Base path for category links */
  basePath?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Icon Mapping
// ============================================================================

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Smartphone,
  Globe,
  BookOpen,
  Youtube,
  Headphones,
  Gamepad2,
  GraduationCap,
  BookText,
  Ear,
  MessageCircle,
  PenTool,
  FileText,
  Library,
  Languages,
  Waves,
  Users,
};

function getCategoryIcon(iconName: string) {
  return iconMap[iconName] || Globe;
}

// ============================================================================
// CategoryNav Component
// ============================================================================

/**
 * CategoryNav displays a navigation list of categories with icons and counts.
 *
 * Features:
 * - Display category list with icons and counts
 * - Support active state highlighting
 * - Support subcategory expansion
 * - Responsive: sidebar on desktop, collapsible on mobile
 * - Keyboard navigation support
 * - ARIA labels and roles
 *
 * @requirements 2.1, 2.5, 8.1, 8.2
 */
export function CategoryNav({
  categories,
  activeCategory,
  activeSubcategory,
  basePath = '/resources',
  className,
}: CategoryNavProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(activeCategory ? [activeCategory] : []),
  );
  const navRef = useRef<HTMLElement>(null);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // Handle keyboard navigation within the nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, categoryId: string, hasSubcategories: boolean) => {
      switch (e.key) {
        case 'ArrowRight':
          if (hasSubcategories && !expandedCategories.has(categoryId)) {
            e.preventDefault();
            toggleCategory(categoryId);
          }
          break;
        case 'ArrowLeft':
          if (hasSubcategories && expandedCategories.has(categoryId)) {
            e.preventDefault();
            toggleCategory(categoryId);
          }
          break;
      }
    },
    [expandedCategories, toggleCategory],
  );

  return (
    <nav
      ref={navRef}
      className={cn('flex flex-col', className)}
      aria-label='Resource categories'
    >
      {/* All Resources Link */}
      <Link
        href={basePath}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
          'transition-colors duration-150',
          'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
          !activeCategory
            ? 'bg-[var(--main-color)]/10 text-[var(--main-color)]'
            : 'text-[var(--secondary-color)] hover:bg-[var(--card-color)] hover:text-[var(--main-color)]',
        )}
        aria-current={!activeCategory ? 'page' : undefined}
      >
        <Library size={18} className='shrink-0' aria-hidden='true' />
        <span>All Resources</span>
      </Link>

      {/* Category List */}
      <ul className='mt-2 space-y-1' role='list'>
        {categories.map(category => {
          const Icon = getCategoryIcon(category.icon);
          const isActive = activeCategory === category.id;
          const isExpanded = expandedCategories.has(category.id);
          const hasSubcategories = category.subcategoriesWithCount.length > 0;
          const subcategoryListId = `subcategories-${category.id}`;

          return (
            <li key={category.id}>
              {/* Category Item */}
              <div className='flex items-center'>
                <Link
                  href={`${basePath}/${category.id}`}
                  className={cn(
                    'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                    'transition-colors duration-150',
                    'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
                    isActive
                      ? 'bg-[var(--main-color)]/10 text-[var(--main-color)]'
                      : 'text-[var(--secondary-color)] hover:bg-[var(--card-color)] hover:text-[var(--main-color)]',
                  )}
                  aria-current={
                    isActive && !activeSubcategory ? 'page' : undefined
                  }
                  onKeyDown={e =>
                    handleKeyDown(e, category.id, hasSubcategories)
                  }
                >
                  <Icon size={18} className='shrink-0' aria-hidden='true' />
                  <span className='flex-1 truncate'>{category.name}</span>
                  <span
                    className={cn(
                      'text-xs tabular-nums',
                      isActive
                        ? 'text-[var(--main-color)]'
                        : 'text-[var(--secondary-color)]',
                    )}
                    aria-label={`${category.resourceCount} resources`}
                  >
                    {category.resourceCount}
                  </span>
                </Link>

                {/* Expand/Collapse Button */}
                {hasSubcategories && (
                  <button
                    type='button'
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      'text-[var(--secondary-color)] transition-colors',
                      'hover:bg-[var(--card-color)] hover:text-[var(--main-color)]',
                      'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
                    )}
                    aria-expanded={isExpanded}
                    aria-controls={subcategoryListId}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} subcategories`}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} aria-hidden='true' />
                    ) : (
                      <ChevronRight size={16} aria-hidden='true' />
                    )}
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {hasSubcategories && isExpanded && (
                <ul
                  id={subcategoryListId}
                  className='mt-1 ml-6 space-y-1 border-l border-[var(--border-color)] pl-3'
                  role='list'
                  aria-label={`${category.name} subcategories`}
                >
                  {category.subcategoriesWithCount.map(subcategory => {
                    const isSubActive =
                      isActive && activeSubcategory === subcategory.id;

                    return (
                      <li key={subcategory.id}>
                        <Link
                          href={`${basePath}/${category.id}/${subcategory.id}`}
                          className={cn(
                            'flex items-center justify-between rounded-lg px-3 py-1.5 text-sm',
                            'transition-colors duration-150',
                            'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
                            isSubActive
                              ? 'bg-[var(--main-color)]/10 font-medium text-[var(--main-color)]'
                              : 'text-[var(--secondary-color)] hover:bg-[var(--card-color)] hover:text-[var(--main-color)]',
                          )}
                          aria-current={isSubActive ? 'page' : undefined}
                        >
                          <span className='truncate'>{subcategory.name}</span>
                          <span
                            className={cn(
                              'text-xs tabular-nums',
                              isSubActive
                                ? 'text-[var(--main-color)]'
                                : 'text-[var(--secondary-color)]',
                            )}
                            aria-label={`${subcategory.resourceCount} resources`}
                          >
                            {subcategory.resourceCount}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default CategoryNav;
