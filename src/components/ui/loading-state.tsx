import { memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  variant?: 'spinner' | 'pulse' | 'shimmer' | 'skeleton';
}

const LoadingState = memo(({ 
  isLoading, 
  children, 
  fallback, 
  className = "", 
  variant = 'spinner' 
}: LoadingStateProps) => {
  
  if (!isLoading) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const getLoadingComponent = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn("flex items-center justify-center", className)}>
            <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn("animate-pulse-soft bg-muted/20 rounded-lg", className)} />
        );
      
      case 'shimmer':
        return (
          <div className={cn("loading-shimmer rounded-lg", className)} />
        );
      
      case 'skeleton':
        return (
          <div className={cn("space-y-3", className)}>
            <div className="h-4 bg-muted/20 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted/20 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-muted/20 rounded w-5/6 animate-pulse" />
          </div>
        );
      
      default:
        return (
          <div className={cn("flex items-center justify-center", className)}>
            <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        );
    }
  };

  return getLoadingComponent();
});

LoadingState.displayName = 'LoadingState';

export { LoadingState };