import { memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'form' | 'hero' | 'text' | 'video';
  count?: number;
  animate?: boolean;
}

export const OptimizedLoadingSkeleton = memo(({
  className,
  variant = 'card',
  count = 1,
  animate = true
}: OptimizedLoadingSkeletonProps) => {
  
  const getSkeletonVariant = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className={cn("space-y-6", className)}>
            <div className="h-12 md:h-16 bg-muted/20 rounded-lg w-3/4" />
            <div className="space-y-3">
              <div className="h-4 bg-muted/20 rounded w-full" />
              <div className="h-4 bg-muted/20 rounded w-5/6" />
            </div>
            <div className="h-12 bg-muted/20 rounded-lg w-48" />
          </div>
        );
      
      case 'form':
        return (
          <div className={cn("space-y-6", className)}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted/20 rounded w-32" />
                <div className="h-12 bg-muted/20 rounded-lg" />
              </div>
            ))}
            <div className="h-14 bg-muted/20 rounded-xl" />
          </div>
        );
      
      case 'video':
        return (
          <div className={cn("relative aspect-video bg-muted/20 rounded-lg", className)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-l-2 border-l-muted/60 rounded-full animate-spin" />
              </div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={cn("space-y-2", className)}>
            <div className="h-4 bg-muted/20 rounded w-full" />
            <div className="h-4 bg-muted/20 rounded w-4/5" />
            <div className="h-4 bg-muted/20 rounded w-3/4" />
          </div>
        );
      
      default: // card
        return (
          <div className={cn("p-6 space-y-4 bg-card/20 rounded-lg border border-muted/30", className)}>
            <div className="h-6 bg-muted/20 rounded w-2/3" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/20 rounded" />
              <div className="h-4 bg-muted/20 rounded w-5/6" />
            </div>
            <div className="h-10 bg-muted/20 rounded-lg w-32" />
          </div>
        );
    }
  };

  if (count > 1) {
    return (
      <div className={cn(animate && "animate-pulse", "space-y-4")}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
            {getSkeletonVariant()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(animate && "animate-pulse")}>
      {getSkeletonVariant()}
    </div>
  );
});

OptimizedLoadingSkeleton.displayName = 'OptimizedLoadingSkeleton';