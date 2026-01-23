'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import {
  ExternalLink,
  Smartphone,
  Globe,
  Monitor,
  Apple,
  BookOpen,
  Puzzle,
  Star,
} from 'lucide-react';
import type { Resource, DifficultyLevel, PriceType, Platform } from '../types';
import { ResourceCard } from './ResourceCard';

// ============================================================================
// Types
// ============================================================================

export interface ResourceDetailModalProps {
  /** The resource to display (null when closed) */
  resource: Resource | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Related resources to display */
  relatedResources?: Resource[];
  /** Callback when a related resource is selected */
  onRelatedSelect?: (resource: Resource) => void;
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Badge component for displaying labels
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'difficulty' | 'price';
  className?: string;
}

function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--border-color)] text-[var(--main-color)]',
    difficulty: 'bg-[var(--main-color)]/10 text-[var(--main-color)]',
    price: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium',
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
 * Platform icon and label component
 */
interface PlatformBadgeProps {
  platform: Platform;
}

function PlatformBadge({ platform }: PlatformBadgeProps) {
  const iconProps = { size: 14, className: 'shrink-0' };

  const platformConfig: Record<
    Platform,
    { icon: React.ReactNode; label: string }
  > = {
    web: { icon: <Globe {...iconProps} />, label: 'Web' },
    ios: { icon: <Apple {...iconProps} />, label: 'iOS' },
    android: { icon: <Smartphone {...iconProps} />, label: 'Android' },
    windows: { icon: <Monitor {...iconProps} />, label: 'Windows' },
    macos: { icon: <Apple {...iconProps} />, label: 'macOS' },
    linux: { icon: <Monitor {...iconProps} />, label: 'Linux' },
    physical: { icon: <BookOpen {...iconProps} />, label: 'Physical' },
    'browser-extension': {
      icon: <Puzzle {...iconProps} />,
      label: 'Browser Extension',
    },
    api: { icon: <Globe {...iconProps} />, label: 'API' },
  };

  const config = platformConfig[platform];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1',
        'bg-[var(--border-color)] text-xs text-[var(--secondary-color)]',
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

/**
 * Star rating component
 */
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-[var(--border-color)]',
          )}
        />
      ))}
      <span className='ml-1 text-sm text-[var(--secondary-color)]'>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ============================================================================
// ResourceDetailModal Component
// ============================================================================

/**
 * ResourceDetailModal displays full resource details in a modal dialog.
 *
 * Features:
 * - Display full resource details
 * - Display related resources section
 * - CTA button linking to resource URL
 * - Smooth open/close animation
 * - Focus trap (handled by Radix UI Dialog)
 * - Keyboard navigation (Escape to close)
 * - ARIA labels and roles
 *
 * @requirements 5.1, 5.2, 5.3, 5.4, 5.6, 8.1, 8.2
 */
export function ResourceDetailModal({
  resource,
  isOpen,
  onClose,
  relatedResources = [],
  onRelatedSelect,
}: ResourceDetailModalProps) {
  if (!resource) return null;

  const description = resource.descriptionLong || resource.description;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className='max-h-[90vh] max-w-2xl overflow-y-auto'
        aria-describedby='resource-detail-description'
      >
        <DialogHeader>
          <DialogTitle className='flex items-start gap-3'>
            <span>{resource.name}</span>
            {resource.nameJa && (
              <span className='text-base font-normal text-[var(--secondary-color)]'>
                {resource.nameJa}
              </span>
            )}
          </DialogTitle>
          <DialogDescription
            id='resource-detail-description'
            className='sr-only'
          >
            Detailed information about {resource.name}, including description,
            platforms, tags, and related resources.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Rating */}
          {resource.rating && (
            <div aria-label={`Rating: ${resource.rating} out of 5 stars`}>
              <StarRating rating={resource.rating} />
            </div>
          )}

          {/* Badges Row */}
          <div
            className='flex flex-wrap gap-2'
            role='group'
            aria-label='Resource attributes'
          >
            <Badge variant='difficulty'>
              {getDifficultyLabel(resource.difficulty)}
            </Badge>
            <Badge variant='price'>{getPriceLabel(resource.priceType)}</Badge>
            {resource.priceDetails && (
              <span className='text-sm text-[var(--secondary-color)]'>
                {resource.priceDetails}
              </span>
            )}
          </div>

          {/* Description */}
          <section aria-labelledby='description-heading'>
            <h3
              id='description-heading'
              className='mb-2 text-sm font-medium text-[var(--main-color)]'
            >
              Description
            </h3>
            <p className='text-sm leading-relaxed text-[var(--secondary-color)]'>
              {description}
            </p>
          </section>

          {/* Platforms */}
          <section aria-labelledby='platforms-heading'>
            <h3
              id='platforms-heading'
              className='mb-2 text-sm font-medium text-[var(--main-color)]'
            >
              Available On
            </h3>
            <div
              className='flex flex-wrap gap-2'
              role='list'
              aria-label='Available platforms'
            >
              {resource.platforms.map((platform, index) => (
                <div key={`${platform}-${index}`} role='listitem'>
                  <PlatformBadge platform={platform} />
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <section aria-labelledby='tags-heading'>
              <h3
                id='tags-heading'
                className='mb-2 text-sm font-medium text-[var(--main-color)]'
              >
                Tags
              </h3>
              <div
                className='flex flex-wrap gap-2'
                role='list'
                aria-label='Resource tags'
              >
                {resource.tags.map(tag => (
                  <span
                    key={tag}
                    role='listitem'
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs',
                      'bg-[var(--border-color)] text-[var(--secondary-color)]',
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {resource.notes && (
            <section aria-labelledby='notes-heading'>
              <h3
                id='notes-heading'
                className='mb-2 text-sm font-medium text-[var(--main-color)]'
              >
                Notes
              </h3>
              <p className='text-sm text-[var(--secondary-color)]'>
                {resource.notes}
              </p>
            </section>
          )}

          {/* CTA Button */}
          <Button asChild className='w-full'>
            <a
              href={resource.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2'
              aria-label={`Visit ${resource.name} (opens in new tab)`}
            >
              Visit {resource.name}
              <ExternalLink size={16} aria-hidden='true' />
            </a>
          </Button>

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <section aria-labelledby='related-heading'>
              <h3
                id='related-heading'
                className='mb-3 text-sm font-medium text-[var(--main-color)]'
              >
                Related Resources
              </h3>
              <div
                className='grid gap-3 sm:grid-cols-2'
                role='list'
                aria-label='Related resources'
              >
                {relatedResources.slice(0, 4).map(related => (
                  <div key={related.id} role='listitem'>
                    <ResourceCard
                      resource={related}
                      onSelect={onRelatedSelect}
                      isCompact
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResourceDetailModal;
