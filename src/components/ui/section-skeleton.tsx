import React from 'react';
import { cn } from '@/lib/utils';

interface SectionSkeletonProps {
  className?: string;
  variant?: 'default' | 'tall' | 'wide';
}

/**
 * Skeleton loader for section components during lazy loading
 */
const SectionSkeleton = ({ 
  className,
  variant = 'default' 
}: SectionSkeletonProps) => {
  const heights = {
    default: 'min-h-[600px]',
    tall: 'min-h-[800px]',
    wide: 'min-h-[400px]'
  };

  return (
    <section 
      className={cn(
        "py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12 animate-pulse",
        heights[variant],
        className
      )}
      aria-label="Carregando seção..."
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="w-20 h-1 bg-muted/30 rounded-full mx-auto" />
          <div className="w-3/4 max-w-lg h-8 bg-muted/30 rounded-lg mx-auto" />
          <div className="w-full max-w-2xl h-6 bg-muted/20 rounded-lg mx-auto" />
          <div className="w-2/3 max-w-xl h-6 bg-muted/20 rounded-lg mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index}
              className="space-y-4 p-6 rounded-xl bg-muted/10"
            >
              <div className="w-16 h-16 bg-muted/30 rounded-xl mx-auto" />
              <div className="w-3/4 h-6 bg-muted/30 rounded-lg mx-auto" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted/20 rounded" />
                <div className="w-5/6 h-4 bg-muted/20 rounded" />
                <div className="w-4/6 h-4 bg-muted/20 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA skeleton */}
        <div className="text-center pt-8">
          <div className="w-48 h-12 bg-muted/30 rounded-lg mx-auto" />
        </div>
      </div>
    </section>
  );
};

SectionSkeleton.displayName = 'SectionSkeleton';

export { SectionSkeleton };