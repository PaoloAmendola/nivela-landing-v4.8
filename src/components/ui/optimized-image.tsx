import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallback?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const OptimizedImage = React.memo(({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fallback = '/placeholder.svg',
  sizes,
  objectFit = 'cover',
  loading,
  decoding = 'async',
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Calculate aspect ratio for preventing layout shift
  const aspectRatio = width && height ? `${width}/${height}` : "16/9";

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        minHeight: !width && !height ? "200px" : undefined
      }}
    >
      {/* Placeholder/Loading state */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted/20 animate-pulse flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-2 border-muted/40 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? fallback : src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300",
            `object-${objectFit}`,
            isLoaded ? "opacity-100" : "opacity-0",
            "w-full h-full"
          )}
          loading={loading || (priority ? "eager" : "lazy")}
          decoding={decoding}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            aspectRatio,
            imageRendering: 'crisp-edges'
          }}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 bg-muted/10 flex items-center justify-center text-muted-foreground text-sm"
          role="img"
          aria-label="Imagem não pôde ser carregada"
        >
          Imagem indisponível
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';