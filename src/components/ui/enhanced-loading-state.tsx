import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedLoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  variant?: 'skeleton' | 'spinner' | 'pulse' | 'shimmer';
  size?: 'sm' | 'md' | 'lg';
}

const EnhancedLoadingState = memo(({
  isLoading,
  children,
  fallback,
  className,
  variant = 'skeleton',
  size = 'md'
}: EnhancedLoadingStateProps) => {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-24';
      case 'lg': return 'h-96';
      default: return 'h-48';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'spinner':
        return 'flex items-center justify-center';
      case 'pulse':
        return 'animate-pulse bg-muted/20 rounded-lg';
      case 'shimmer':
        return 'bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 animate-pulse rounded-lg';
      default:
        return 'space-y-3 animate-pulse';
    }
  };

  if (!isLoading) {
    return <>{children}</>;
  }

  if (fallback) {
    return <div className={cn(className)}>{fallback}</div>;
  }

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center', getSizeClasses(), className)}>
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (variant === 'pulse' || variant === 'shimmer') {
    return <div className={cn(getVariantClasses(), getSizeClasses(), className)} />;
  }

  // Default skeleton variant
  return (
    <div className={cn(getVariantClasses(), getSizeClasses(), className)}>
      <div className="h-4 bg-muted/20 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-muted/20 rounded" />
        <div className="h-3 bg-muted/20 rounded w-5/6" />
      </div>
      <div className="h-8 bg-muted/20 rounded w-1/2" />
    </div>
  );
});

EnhancedLoadingState.displayName = 'EnhancedLoadingState';

export { EnhancedLoadingState };