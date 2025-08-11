import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PerformanceAwareImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
  placeholder?: 'blur' | 'empty' | 'skeleton';
  blurDataURL?: string;
}

const PerformanceAwareImage = memo(({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  quality = 85,
  sizes,
  loading = 'lazy',
  onLoad,
  onError,
  fallback,
  placeholder = 'skeleton',
  blurDataURL
}: PerformanceAwareImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Generate WebP alternative if possible
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc.includes('supabase.co')) {
      // For Supabase images, we already have WebP
      return originalSrc;
    }
    return originalSrc;
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setImageSrc(getOptimizedSrc(src));
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(getOptimizedSrc(src));
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority, loading, getOptimizedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    if (fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
    onError?.();
  }, [fallback, onError]);

  const getPlaceholder = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return (
        <div 
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-300',
            isLoading ? 'opacity-100' : 'opacity-0'
          )}
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      );
    }

    if (placeholder === 'skeleton') {
      return (
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 animate-pulse transition-opacity duration-300',
            isLoading ? 'opacity-100' : 'opacity-0'
          )}
        />
      );
    }

    return null;
  };

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {isLoading && getPlaceholder()}
      
      {/* Main Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading || hasError ? 'opacity-0' : 'opacity-100',
            'w-full h-full object-cover'
          )}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
            minHeight: !width && !height ? "200px" : undefined,
            contentVisibility: 'auto',
            containIntrinsicSize: width && height ? `${width}px ${height}px` : 'auto'
          }}
        />
      )}

      {/* Error State */}
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 text-muted-foreground text-sm">
          Falha ao carregar imagem
        </div>
      )}
    </div>
  );
});

PerformanceAwareImage.displayName = 'PerformanceAwareImage';

export { PerformanceAwareImage };