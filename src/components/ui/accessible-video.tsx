import React, { useState, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibleVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  title: string;
  description?: string;
  className?: string;
  showControls?: boolean;
  reduced_motion?: boolean;
}

export const AccessibleVideo = React.memo(({
  src,
  poster,
  title,
  description,
  className,
  showControls = false,
  reduced_motion = false,
  autoPlay = true,
  muted = true,
  loop = true,
  ...props
}: AccessibleVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      // Video autoplay blocked - fallback to manual play
    }
  }, []);

  const handlePause = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.pause();
    setIsPlaying(false);
  }, []);

  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        isPlaying ? handlePause() : handlePlay();
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        handleMuteToggle();
        break;
    }
  }, [isPlaying, handlePlay, handlePause, handleMuteToggle]);

  if (hasError) {
    return (
      <div 
        className={cn(
          "relative flex items-center justify-center bg-muted/20 rounded-lg border border-muted/30 min-h-[200px]",
          className
        )}
        role="img"
        aria-label={`Vídeo indisponível: ${title}`}
      >
        <div className="text-center p-6 space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-primary/60" />
          </div>
          <div className="text-muted-foreground text-sm font-medium">
            Vídeo temporariamente indisponível
          </div>
          {description && (
            <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
              {description}
            </p>
          )}
          {poster && (
            <img 
              src={poster} 
              alt={title} 
              className="w-full h-32 object-cover rounded opacity-40 mt-4"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative group", className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label={`Player de vídeo: ${title}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={!reduced_motion && autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        controls={false}
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        aria-label={title}
        title={title}
        {...props}
      >
        <track kind="descriptions" src="" label={`Descrição: ${description || title}`} />
        <track kind="captions" src="" label="Legendas" />
        Seu navegador não suporta vídeos HTML5.
      </video>

      {/* All custom controls removed - autoplay only */}

      {/* Screen reader description */}
      <div className="sr-only" aria-live="polite">
        {title}. {description && `${description}.`} 
        {isPlaying ? 'Reproduzindo.' : 'Pausado.'}
        {isMuted ? 'Som desligado.' : 'Som ligado.'}
      </div>
    </div>
  );
});

AccessibleVideo.displayName = 'AccessibleVideo';