import { memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

const SkeletonLoader = memo(({ 
  className = "", 
  count = 1, 
  height = "h-4", 
  variant = "text" 
}: SkeletonLoaderProps) => {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'w-full h-48 rounded-3xl';
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'button':
        return 'w-32 h-10 rounded-xl';
      case 'text':
      default:
        return `w-full ${height} rounded-lg`;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <Skeleton className={`${getVariantClasses()} loading-shimmer`} />
        </div>
      ))}
    </div>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export { SkeletonLoader };