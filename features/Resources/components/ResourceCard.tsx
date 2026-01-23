'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { Resource, DifficultyLevel, PriceType, Platform } from '../types';
import {
  Smartphone,
  Globe,
  Monitor,
  Apple,
  BookOpen,
  Puzzle,
  ExternalLink,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface ResourceCardProps {
  /** The resource to display */
  resource: Resource;
  /** Callback when the card is clicked */
  onSelect?: (resource: Resource) => void;
  /** Whether to display in compact mode */
  isCompact?: boolean;
  /** Callback for keyboard navigation */
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Badge component for displaying labels
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'difficulty' | 'price' | 'category';
  className?: string;
}

function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--border-color)] text-[var(--main-color)]',
    difficulty: 'bg-[var(--main-color)]/10 text-[var(--main-color)]',
    price: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    category: 'bg-[var(--secondary-color)]/10 text-[var(--secondary-color)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Get display text for difficulty level
 */
function getDifficultyLabel(difficulty: DifficultyLevel): string {
  const labels: Record<DifficultyLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    'all-levels': 'All Levels',
  };
  return labels[difficulty];
}

/**
 * Get display text for price type
 */
function getPriceLabel(priceType: PriceType): string {
  const labels: Record<PriceType, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
    subscription: 'Subscription',
  };
  return labels[priceType];
}

/**
 * Platform icon component
 */
interface PlatformIconProps {
  platform: Platform;
  className?: string;
}

function PlatformIcon({ platform, className }: PlatformIconProps) {
  const iconProps = { size: 14, className: cn('shrink-0', className) };

  const icons: Record<Platform, React.ReactNode> = {
    web: <Globe {...iconProps} aria-label='Web' />,
    ios: <Apple {...iconProps} aria-label='iOS' />,
    android: <Smartphone {...iconProps} aria-label='Android' />,
    windows: <Monitor {...iconProps} aria-label='Windows' />,
    macos: <Apple {...iconProps} aria-label='macOS' />,
    linux: <Monitor {...iconProps} aria-label='Linux' />,
    physical: <BookOpen {...iconProps} aria-label='Physical' />,
    'browser-extension': (
      <Puzzle {...iconProps} aria-label='Browser Extension' />
    ),
    api: <Globe {...iconProps} aria-label='API' />,
  };

  return icons[platform] || null;
}

// ============================================================================
// ResourceCard Component
// ============================================================================

/**
 * ResourceCard displays a single learning resource with its key information.
 *
 * Features:
 * - Displays name, description, category badge, difficulty badge, price badge
 * - Shows platform icons
 * - Implements hover animation (translateY, shadow)
 * - Supports onClick for detail view
 * - Full keyboard navigation support
 * - Accessible focus indicators
 *
 * @requirements 1.3, 1.5, 7.3, 8.1, 8.2, 8.5
 */
export function ResourceCard({
  resource,
  onSelect,
  isCompact = false,
  onKeyDown,
}: ResourceCardProps) {
  const handleClick = () => {
    onSelect?.(resource);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle selection with Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(resource);
      return;
    }

    // Pass other key events to parent for grid navigation
    onKeyDown?.(e);
  };

  return (
    <article
      role='button'
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${resource.name} - ${resource.description}`}
      className={cn(
        // Base styles
        'group relative flex flex-col rounded-xl bg-[var(--card-color)]',
        'border border-[var(--border-color)]',
        'cursor-pointer outline-none',
        // Transition and hover effects
        'transition-all duration-150 ease-out',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10',
        'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--background-color)]',
        // Padding based on compact mode
        isCompact ? 'p-3' : 'p-4',
      )}
    >
      {/* Header: Name and External Link Icon */}
      <div className='flex items-start justify-between gap-2'>
        <h3
          className={cn(
            'line-clamp-1 font-semibold text-[var(--main-color)]',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          {resource.name}
          {resource.nameJa && (
            <span className='ml-1.5 font-normal text-[var(--secondary-color)]'>
              {resource.nameJa}
            </span>
          )}
        </h3>
        <ExternalLink
          size={14}
          className='shrink-0 text-[var(--secondary-color)] opacity-0 transition-opacity group-hover:opacity-100'
          aria-hidden='true'
        />
      </div>

      {/* Description */}
      <p
        className={cn(
          'mt-1.5 text-[var(--secondary-color)]',
          isCompact ? 'line-clamp-2 text-xs' : 'line-clamp-3 text-sm',
        )}
      >
        {resource.description}
      </p>

      {/* Badges Row */}
      <div className='mt-3 flex flex-wrap items-center gap-1.5'>
        {/* Category Badge */}
        <Badge variant='category'>
          {formatCategoryName(resource.category)}
        </Badge>

        {/* Difficulty Badge */}
        <Badge variant='difficulty'>
          {getDifficultyLabel(resource.difficulty)}
        </Badge>

        {/* Price Badge */}
        <Badge variant='price'>{getPriceLabel(resource.priceType)}</Badge>
      </div>

      {/* Platform Icons */}
      {resource.platforms.length > 0 && (
        <div
          className='mt-3 flex items-center gap-2 text-[var(--secondary-color)]'
          aria-label={`Available on: ${resource.platforms.join(', ')}`}
        >
          {resource.platforms.slice(0, 5).map(platform => (
            <PlatformIcon key={platform} platform={platform} />
          ))}
          {resource.platforms.length > 5 && (
            <span className='text-xs'>+{resource.platforms.length - 5}</span>
          )}
        </div>
      )}

      {/* Featured indicator */}
      {resource.featured && (
        <div
          className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[var(--main-color)]'
          aria-label='Featured resource'
        />
      )}
    </article>
  );
}

/**
 * Format category ID to display name
 */
function formatCategoryName(categoryId: string): string {
  const names: Record<string, string> = {
    apps: 'Apps',
    websites: 'Websites',
    textbooks: 'Textbooks',
    youtube: 'YouTube',
    podcasts: 'Podcasts',
    games: 'Games',
    jlpt: 'JLPT',
    reading: 'Reading',
    listening: 'Listening',
    speaking: 'Speaking',
    writing: 'Writing',
    grammar: 'Grammar',
    vocabulary: 'Vocabulary',
    kanji: 'Kanji',
    immersion: 'Immersion',
    community: 'Community',
  };
  return names[categoryId] || categoryId;
}

export default ResourceCard;
