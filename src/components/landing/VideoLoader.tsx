import { useState, useRef, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";

interface VideoLoaderProps {
  src: string;
  thumbnail?: string;
  title: string;
  className?: string;
}

const VideoLoader = ({ src, thumbnail, title, className = "" }: VideoLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    setIsLoading(true);
    setIsPlaying(true);
    setHasError(false);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsPlaying(false);
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  if (hasError) {
    return (
      <div className={`${className} bg-muted/20 border border-primary/10 rounded-3xl flex items-center justify-center min-h-[240px]`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <Play className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground font-montserrat mb-4">
            Erro ao carregar vídeo
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors touch-target focus-visible-enhanced min-h-[44px] min-w-[44px]"
            aria-label="Tentar carregar o vídeo novamente"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div 
        className={`${className} relative group cursor-pointer bg-gradient-to-br from-brand-deep/20 to-brand-caramel/10 border border-primary/10 rounded-3xl overflow-hidden touch-target focus-visible-enhanced min-h-[44px]`}
        onClick={handlePlay}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlay();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Reproduzir vídeo: ${title}`}
      >
        {thumbnail && (
          <img 
            src={thumbnail}
            alt={`Thumbnail para ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            width={640}
            height={360}
            style={{ aspectRatio: "16/9" }}
          />
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-brand-black/40 flex items-center justify-center group-hover:bg-brand-black/30 transition-elegant">
          <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-elegant shadow-premium">
            <Play className="w-10 h-10 text-brand-black ml-1" />
          </div>
        </div>
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-black/80 to-transparent p-6">
          <h4 className="text-lg font-montserrat font-medium text-brand-light">
            {title}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-brand-black/80 flex items-center justify-center z-10">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
            <p className="text-brand-light font-montserrat">
              Carregando vídeo...
            </p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        preload="metadata"
        className="w-full h-full object-cover touch-target"
        onLoadedData={handleLoadedData}
        onError={handleError}
        onLoadStart={() => setIsLoading(true)}
        aria-label={`Vídeo demonstrativo: ${title}`}
        title={title}
        tabIndex={0}
        width={640}
        height={360}
        style={{ aspectRatio: "16/9" }}
      >
        <track kind="descriptions" src="" label={`Descrição do vídeo: ${title}`} />
        <track kind="captions" src="" label="Legendas disponíveis" />
        Seu navegador não suporta reprodução de vídeos HTML5.
      </video>
    </div>
  );
};

export default VideoLoader;