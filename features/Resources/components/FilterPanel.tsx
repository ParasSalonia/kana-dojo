'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, X, Filter } from 'lucide-react';
import type {
  ActiveFilters,
  FilterOptions,
  DifficultyLevel,
  PriceType,
  Platform,
} from '../types';

// ============================================================================
// Types
// ============================================================================

export interface FilterPanelProps {
  /** Current active filters */
  filters: ActiveFilters;
  /** Callback when filters change */
  onFilterChange: (filters: ActiveFilters) => void;
  /** Available filter options with counts */
  availableFilters: FilterOptions;
  /** Additional CSS classes */
  className?: string;
  /** ID for the filter panel (for aria-controls) */
  id?: string;
}

// ============================================================================
// Label Mappings
// ============================================================================

const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  'all-levels': 'All Levels',
};

const priceLabels: Record<PriceType, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  subscription: 'Subscription',
};

const platformLabels: Record<Platform, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  physical: 'Physical',
  'browser-extension': 'Browser Extension',
  api: 'API',
};

// ============================================================================
// Checkbox Group Component
// ============================================================================

interface CheckboxGroupProps<T extends string> {
  title: string;
  options: { value: T; count: number }[];
  selected: T[];
  onChange: (selected: T[]) => void;
  labels: Record<T, string>;
  /** Unique ID for the group */
  groupId: string;
}

function CheckboxGroup<T extends string>({
  title,
  options,
  selected,
  onChange,
  labels,
  groupId,
}: CheckboxGroupProps<T>) {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Handle keyboard navigation within checkbox group
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      if (!contentRef.current) return;

      const checkboxes = contentRef.current.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]',
      );
      const count = checkboxes.length;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % count;
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + count) % count;
          break;
        default:
          return;
      }

      checkboxes[nextIndex]?.focus();
    },
    [],
  );

  const contentId = `${groupId}-content`;

  return (
    <div
      className='border-b border-[var(--border-color)] pb-4'
      role='group'
      aria-labelledby={`${groupId}-heading`}
    >
      <button
        type='button'
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between py-2',
          'text-sm font-medium text-[var(--main-color)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
          'rounded-md',
        )}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        id={`${groupId}-heading`}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={cn(
            'text-[var(--secondary-color)] transition-transform',
            isExpanded && 'rotate-180',
          )}
          aria-hidden='true'
        />
      </button>

      {isExpanded && (
        <div
          ref={contentRef}
          id={contentId}
          className='mt-2 space-y-2'
          role='group'
          aria-label={`${title} options`}
        >
          {options.map((option, index) => (
            <label
              key={option.value}
              className='flex cursor-pointer items-center gap-2'
            >
              <input
                type='checkbox'
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                onKeyDown={e => handleKeyDown(e, index)}
                className={cn(
                  'h-4 w-4 rounded border-[var(--border-color)]',
                  'text-[var(--main-color)]',
                  'focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2',
                  'focus-visible:outline-none',
                )}
                aria-describedby={`${groupId}-${option.value}-count`}
              />
              <span className='flex-1 text-sm text-[var(--secondary-color)]'>
                {labels[option.value]}
              </span>
              <span
                id={`${groupId}-${option.value}-count`}
                className='text-xs text-[var(--secondary-color)] tabular-nums'
                aria-label={`${option.count} resources`}
              >
                {option.count}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Active Filter Tags Component
// ============================================================================

interface ActiveFilterTagsProps {
  filters: ActiveFilters;
  onRemove: (filterType: keyof ActiveFilters, value: string) => void;
  onClearAll: () => void;
}

function ActiveFilterTags({
  filters,
  onRemove,
  onClearAll,
}: ActiveFilterTagsProps) {
  const hasActiveFilters =
    filters.difficulty.length > 0 ||
    filters.priceType.length > 0 ||
    filters.platforms.length > 0;

  if (!hasActiveFilters) return null;

  const totalFilters =
    filters.difficulty.length +
    filters.priceType.length +
    filters.platforms.length;

  return (
    <div
      className='flex flex-wrap items-center gap-2'
      role='group'
      aria-label={`Active filters: ${totalFilters} selected`}
    >
      {/* Live region for filter changes */}
      <div className='sr-only' aria-live='polite' aria-atomic='true'>
        {totalFilters} {totalFilters === 1 ? 'filter' : 'filters'} active
      </div>

      {/* Difficulty Tags */}
      {filters.difficulty.map(value => (
        <button
          key={`difficulty-${value}`}
          type='button'
          onClick={() => onRemove('difficulty', value)}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
            'bg-[var(--main-color)]/10 text-xs text-[var(--main-color)]',
            'transition-colors hover:bg-[var(--main-color)]/20',
            'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
          aria-label={`Remove ${difficultyLabels[value]} filter`}
        >
          {difficultyLabels[value]}
          <X size={12} aria-hidden='true' />
        </button>
      ))}

      {/* Price Tags */}
      {filters.priceType.map(value => (
        <button
          key={`price-${value}`}
          type='button'
          onClick={() => onRemove('priceType', value)}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
            'bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400',
            'transition-colors hover:bg-emerald-500/20',
            'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
          aria-label={`Remove ${priceLabels[value]} filter`}
        >
          {priceLabels[value]}
          <X size={12} aria-hidden='true' />
        </button>
      ))}

      {/* Platform Tags */}
      {filters.platforms.map(value => (
        <button
          key={`platform-${value}`}
          type='button'
          onClick={() => onRemove('platforms', value)}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
            'bg-[var(--secondary-color)]/10 text-xs text-[var(--secondary-color)]',
            'transition-colors hover:bg-[var(--secondary-color)]/20',
            'focus-visible:ring-2 focus-visible:ring-[var(--secondary-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
          aria-label={`Remove ${platformLabels[value]} filter`}
        >
          {platformLabels[value]}
          <X size={12} aria-hidden='true' />
        </button>
      ))}

      {/* Clear All Button */}
      <button
        type='button'
        onClick={onClearAll}
        className={cn(
          'text-xs text-[var(--secondary-color)]',
          'transition-colors hover:text-[var(--main-color)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
          'rounded-md px-1',
        )}
        aria-label='Clear all filters'
      >
        Clear all
      </button>
    </div>
  );
}

// ============================================================================
// FilterPanel Component
// ============================================================================

/**
 * FilterPanel provides advanced filtering controls for resources.
 *
 * Features:
 * - DifficultyFilter with checkbox group
 * - PriceFilter with checkbox group
 * - PlatformFilter with checkbox group
 * - ActiveFilterTags component
 * - Collapsible panel on mobile
 * - Keyboard navigation support
 * - ARIA labels and live regions
 *
 * @requirements 4.1, 4.2, 4.3, 4.6, 8.1, 8.2, 8.4
 */
export function FilterPanel({
  filters,
  onFilterChange,
  availableFilters,
  className,
  id = 'filter-panel',
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcut to toggle filter panel (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const handleDifficultyChange = (difficulty: DifficultyLevel[]) => {
    onFilterChange({ ...filters, difficulty });
  };

  const handlePriceChange = (priceType: PriceType[]) => {
    onFilterChange({ ...filters, priceType });
  };

  const handlePlatformChange = (platforms: Platform[]) => {
    onFilterChange({ ...filters, platforms });
  };

  const handleRemoveFilter = (
    filterType: keyof ActiveFilters,
    value: string,
  ) => {
    if (filterType === 'search') return;

    const currentValues = filters[filterType] as string[];
    onFilterChange({
      ...filters,
      [filterType]: currentValues.filter(v => v !== value),
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      difficulty: [],
      priceType: [],
      platforms: [],
      search: filters.search,
    });
  };

  const hasActiveFilters =
    filters.difficulty.length > 0 ||
    filters.priceType.length > 0 ||
    filters.platforms.length > 0;

  const filterCount =
    filters.difficulty.length +
    filters.priceType.length +
    filters.platforms.length;

  const contentId = `${id}-content`;

  return (
    <div
      ref={panelRef}
      id={id}
      className={cn('space-y-4', className)}
      role='region'
      aria-label='Filter resources'
    >
      {/* Mobile Toggle */}
      <button
        type='button'
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-4 py-3',
          'border border-[var(--border-color)] bg-[var(--card-color)]',
          'text-sm font-medium text-[var(--main-color)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
          'lg:hidden',
        )}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className='flex items-center gap-2'>
          <Filter size={16} aria-hidden='true' />
          Filters
          {hasActiveFilters && (
            <span
              className='rounded-full bg-[var(--main-color)] px-2 py-0.5 text-xs text-[var(--background-color)]'
              aria-label={`${filterCount} filters active`}
            >
              {filterCount}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-[var(--secondary-color)] transition-transform',
            isExpanded && 'rotate-180',
          )}
          aria-hidden='true'
        />
      </button>

      {/* Active Filter Tags */}
      <ActiveFilterTags
        filters={filters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Filter Groups - Always visible on desktop, collapsible on mobile */}
      <div
        id={contentId}
        className={cn(
          'space-y-4 rounded-lg bg-[var(--card-color)] p-4',
          'border border-[var(--border-color)]',
          'lg:block',
          !isExpanded && 'hidden lg:block',
        )}
        role='group'
        aria-label='Filter options'
      >
        {/* Difficulty Filter */}
        <CheckboxGroup
          title='Difficulty'
          options={availableFilters.difficulties}
          selected={filters.difficulty}
          onChange={handleDifficultyChange}
          labels={difficultyLabels}
          groupId={`${id}-difficulty`}
        />

        {/* Price Filter */}
        <CheckboxGroup
          title='Price'
          options={availableFilters.priceTypes}
          selected={filters.priceType}
          onChange={handlePriceChange}
          labels={priceLabels}
          groupId={`${id}-price`}
        />

        {/* Platform Filter */}
        <CheckboxGroup
          title='Platform'
          options={availableFilters.platforms}
          selected={filters.platforms}
          onChange={handlePlatformChange}
          labels={platformLabels}
          groupId={`${id}-platform`}
        />
      </div>
    </div>
  );
}

export default FilterPanel;
