import React, { useState, useEffect, useRef, memo } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ProgressiveImage = memo(({
  src,
  alt,
  className = "",
  placeholderSrc,
  blurDataURL,
  priority = false,
  sizes,
  onLoad,
  onError
}: ProgressiveImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || imageLoaded) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, imageLoaded]);

  // Generate WebP source if not already WebP
  const generateWebPSrc = (originalSrc: string) => {
    if (originalSrc.includes('.webp')) return originalSrc;
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  // Generate placeholder for better UX
  const placeholder = placeholderSrc || blurDataURL || `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#D9C0AA;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#9D4916;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
    </svg>
  `)}`;

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted/20",
        className
      )}
    >
      {/* Placeholder/Loading state */}
      <img
        src={placeholder}
        alt=""
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-0" : "opacity-100"
        )}
        aria-hidden="true"
      />

      {/* Loading shimmer */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 loading-shimmer" />
      )}

      {/* Main image with progressive enhancement */}
      {inView && !imageError && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={generateWebPSrc(src)}
            type="image/webp"
            sizes={sizes}
          />
          
          {/* Fallback to original format */}
          <img
            src={src}
            alt={alt}
            sizes={sizes}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              imageLoaded 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        </picture>
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-muted-foreground" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Erro ao carregar imagem</p>
          </div>
        </div>
      )}
    </div>
  );
});

ProgressiveImage.displayName = 'ProgressiveImage';

export { ProgressiveImage };