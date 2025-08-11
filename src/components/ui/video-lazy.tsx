import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface VideoLazyProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  threshold?: number;
  rootMargin?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: Error) => void;
  'aria-label'?: string;
  title?: string;
}

/**
 * Advanced Lazy Loading Video Component
 * Features:
 * - Intersection Observer based loading
 * - Network-aware loading strategies
 * - Custom controls with accessibility
 * - Preload optimization
 * - Error handling and fallbacks
 */
const VideoLazy = React.memo(({
  src,
  poster,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  preload = 'none',
  threshold = 0.1,
  rootMargin = '100px',
  onPlay,
  onPause,
  onError,
  'aria-label': ariaLabel,
  title,
  ...props
}: VideoLazyProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Network-aware loading strategy
  const getLoadingStrategy = useCallback(() => {
    const connection = (navigator as any).connection;
    
    if (!connection) return 'standard';
    
    // Slow connections: minimal preloading
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return 'minimal';
    }
    
    // Fast connections: aggressive preloading
    if (connection.effectiveType === '4g' && !connection.saveData) {
      return 'aggressive';
    }
    
    return 'standard';
  }, []);

  // Initialize intersection observer
  useEffect(() => {
    const strategy = getLoadingStrategy();
    const adjustedThreshold = strategy === 'minimal' ? 0.5 : threshold;
    const adjustedRootMargin = strategy === 'aggressive' ? '200px' : rootMargin;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && entry.intersectionRatio >= adjustedThreshold) {
          setShouldLoad(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: adjustedThreshold,
        rootMargin: adjustedRootMargin
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, getLoadingStrategy]);

  // Load video when intersection is triggered
  useEffect(() => {
    if (!shouldLoad || isLoaded || isLoading) return;

    const loadVideo = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        if (videoRef.current) {
          const video = videoRef.current;
          
          // Set preload strategy based on network
          const strategy = getLoadingStrategy();
          video.preload = strategy === 'aggressive' ? 'auto' : 'metadata';
          
          // Enhanced mobile compatibility
          video.muted = true;
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('x5-video-player-type', 'h5');
          video.setAttribute('x5-video-player-fullscreen', 'false');
          
          // Wait for video to be ready
          await new Promise((resolve, reject) => {
            const handleCanPlay = () => {
              video.removeEventListener('canplay', handleCanPlay);
              video.removeEventListener('error', handleError);
              video.removeEventListener('abort', handleError);
              video.removeEventListener('stalled', handleError);
              resolve(void 0);
            };
            
            const handleError = (e: Event) => {
              video.removeEventListener('canplay', handleCanPlay);
              video.removeEventListener('error', handleError);
              video.removeEventListener('abort', handleError);
              video.removeEventListener('stalled', handleError);
              const errorMsg = e.type === 'error' ? 'Failed to load video' : `Video ${e.type}`;
              reject(new Error(errorMsg));
            };
            
            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('error', handleError);
            video.addEventListener('abort', handleError);
            video.addEventListener('stalled', handleError);
            
            // Set src to trigger loading
            if (video.src !== src) {
              video.src = src;
              video.load();
            }
            
            // Timeout fallback for slow connections
            setTimeout(() => {
              if (!isLoaded) {
                handleError(new Event('timeout'));
              }
            }, 10000);
          });

          setIsLoaded(true);
          
          // Auto-play if enabled and video is still in view
          if (autoPlay && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
              // Add a small delay for mobile browsers
              setTimeout(() => {
                handlePlay();
              }, 100);
            }
          }
        }
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Unknown video error');
        setHasError(true);
        logger.error('Video loading failed:', { src, error: errorObj.message });
        onError?.(errorObj);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [shouldLoad, src, autoPlay, onError, getLoadingStrategy, isLoaded, isLoading]);

  // Handle play action
  const handlePlay = useCallback(async () => {
    if (!videoRef.current || !isLoaded) return;

    try {
      await videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    } catch (error) {
      logger.warn('Video play failed:', error);
      // Auto-play might be blocked, this is normal
    }
  }, [isLoaded, onPlay]);

  // Handle pause action
  const handlePause = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.pause();
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  // Handle video events
  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleVideoError = useCallback(() => {
    const error = new Error('Video playback error');
    setHasError(true);
    logger.error('Video playback error:', { src });
    onError?.(error);
  }, [src, onError]);

  // Pause when out of view for performance
  useEffect(() => {
    if (!isLoaded || !autoPlay) return;

    const handleVisibilityChange = () => {
      if (!containerRef.current || !videoRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInView && isPlaying) {
        handlePause();
      } else if (isInView && !isPlaying && autoPlay) {
        handlePlay();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting && isPlaying) {
          handlePause();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('scroll', handleVisibilityChange, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleVisibilityChange);
    };
  }, [isLoaded, isPlaying, autoPlay, handlePlay, handlePause]);

  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg border border-muted/30",
          className
        )}
        role="img"
        aria-label="Vídeo não pôde ser carregado"
      >
        <div className="text-center p-6 space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Play className="w-8 h-8 text-primary/60" />
          </div>
          <div className="text-muted-foreground text-sm font-medium">
            Conteúdo em vídeo indisponível
          </div>
          <div className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
            Demonstração da tecnologia ASTRO QUAT V3® em ação molecular
          </div>
          {poster && (
            <img 
              src={poster} 
              alt="Demonstração da tecnologia" 
              className="w-full h-32 object-cover rounded opacity-30 mt-4"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{
        aspectRatio: "16/9", // Default aspect ratio to prevent layout shift
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse">
          {poster ? (
            <img 
              src={poster} 
              alt="Carregando vídeo..." 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Carregando vídeo...</span>
            </div>
          )}
        </div>
      )}

      {/* Video element */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          muted={muted}
          loop={loop}
          playsInline
          controls={false}
          preload={preload}
          poster={poster}
          webkit-playsinline="true"
          aria-label={ariaLabel || "Vídeo demonstrativo da tecnologia NIVELA"}
          title={title || "Demonstração da tecnologia NIVELA"}
          role="img"
          tabIndex={0}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onError={handleVideoError}
          {...props}
        >
          <source src={src} type="video/mp4" />
          <track kind="descriptions" src="" label="Descrição do vídeo" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      )}

      {/* Video autoplay without any visible controls - all controls removed */}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

VideoLazy.displayName = 'VideoLazy';

export { VideoLazy };