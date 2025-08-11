import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  skeleton?: boolean;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: "auto" | "high" | "low";
}

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.svg",
  skeleton = true,
  sizes,
  priority = false,
  loading,
  fetchPriority,
  ...props 
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If priority image, load immediately
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={cn("relative", className)}
      style={{
        aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined,
        minHeight: !props.width && !props.height ? "200px" : undefined, // Prevent layout shift
      }}
    >
      {isLoading && skeleton && (
        <Skeleton className={cn("absolute inset-0 w-full h-full", className)} />
      )}
      
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading || (priority ? "eager" : "lazy")}
          decoding="async"
          sizes={sizes}
          width={props.width}
          height={props.height}
          {...(fetchPriority && { fetchpriority: fetchPriority })}
          style={{ 
            aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined 
          }}
          {...props}
        />
      )}
    </div>
  );
};

export { LazyImage };