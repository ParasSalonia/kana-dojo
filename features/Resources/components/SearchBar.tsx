'use client';

import React, { useRef, useId } from 'react';
import { cn } from '@/shared/lib/utils';
import { Search, X } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Number of results found (optional) */
  resultCount?: number;
  /** Additional CSS classes */
  className?: string;
  /** ID for the search input (for aria-controls) */
  id?: string;
}

// ============================================================================
// SearchBar Component
// ============================================================================

/**
 * SearchBar provides a search input with icon, result count, and clear button.
 *
 * Features:
 * - Search input with icon
 * - Display result count
 * - Clear button
 * - Accessible with ARIA labels and live regions
 * - Keyboard support (Escape to clear)
 *
 * @requirements 3.1, 8.1, 8.2, 8.4
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search resources...',
  resultCount,
  className,
  id,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id || `search-input-${generatedId}`;
  const resultsId = `${inputId}-results`;

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear search on Escape
    if (e.key === 'Escape' && value.length > 0) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className={cn('relative', className)} role='search'>
      {/* Search Icon */}
      <Search
        size={18}
        className='absolute top-1/2 left-3 -translate-y-1/2 text-[var(--secondary-color)]'
        aria-hidden='true'
      />

      {/* Input */}
      <input
        ref={inputRef}
        id={inputId}
        type='search'
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-color)]',
          'py-2.5 pr-20 pl-10 text-sm text-[var(--main-color)]',
          'placeholder:text-[var(--secondary-color)]',
          'transition-all duration-150',
          'focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)]/20 focus:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2',
        )}
        aria-label='Search resources'
        aria-describedby={value.length > 0 ? resultsId : undefined}
        aria-controls='resource-grid'
      />

      {/* Right side: Result count and Clear button */}
      <div className='absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2'>
        {/* Result Count */}
        {resultCount !== undefined && value.length > 0 && (
          <span
            id={resultsId}
            className='text-xs text-[var(--secondary-color)] tabular-nums'
            aria-live='polite'
            aria-atomic='true'
          >
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
        )}

        {/* Clear Button */}
        {value.length > 0 && (
          <button
            type='button'
            onClick={handleClear}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md',
              'text-[var(--secondary-color)] transition-colors',
              'hover:bg-[var(--border-color)] hover:text-[var(--main-color)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
            aria-label='Clear search'
          >
            <X size={14} aria-hidden='true' />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
