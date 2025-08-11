import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoLazy } from "@/components/ui/video-lazy";
import { logger } from "@/utils/logger";

interface TechnologySectionProps {
  id?: string;
}

const TechnologySection = memo(({ id }: TechnologySectionProps) => {
  const processSteps = [
    { 
      step: "01", 
      title: "Penetração", 
      description: "Penetra até o córtex para iniciar a transformação de dentro para fora.",
      badge: "Ação Profunda"
    },
    { 
      step: "02", 
      title: "Modificação", 
      description: "Modifica ligações secundárias, sem danificar estrutura proteica",
      badge: "Modificação Molecular"
    },
    { 
      step: "03", 
      title: "Reparação", 
      description: "Repara micro-danos com ativos nutritivos e lipídicos.",
      badge: "Nutrição Direcionada"
    },
    { 
      step: "04", 
      title: "Realinhamento", 
      description: "Realinha a estrutura da queratina, reduzindo frizz e volume",
      badge: "Alinhamento Preciso"
    },
  ];

  const handleVideoError = () => {
    logger.warn('Erro ao carregar vídeo da tecnologia', { section: 'TechnologySection' });
  };

  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat text-primary tracking-tight leading-[1.1] px-4 sm:px-0">
              Tecnologia ASTRO QUAT V3<sup className="text-lg md:text-xl lg:text-2xl">®</sup>
            </h2>
            <div className="h-1 bg-gradient-accent mx-auto w-24"></div>
          </div>
          
          {/* Descriptive Paragraph */}
          <div className="max-w-5xl mx-auto">
            <p className="text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed">
              Desenvolvida por pesquisa molecular avançada, a tecnologia ASTRO QUAT V3® atua em escala nanométrica, reorganizando as ligações internas da fibra capilar com precisão e segurança, totalmente livre de formol.
            </p>
          </div>
        </div>

        {/* Video Player - Mobile Only (appears after header) */}
        <div className="block lg:hidden mb-12 flex justify-center">
          <div className="relative w-full max-w-lg">
            <VideoLazy
              src="https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/videos/tecnologia-oficial-compactado.mp4"
              className="w-full aspect-[4/3] object-cover rounded-lg"
              autoPlay={false}
              muted={true}
              loop={true}
              controls={true}
              title="Tecnologia ASTRO QUAT V3® - Demonstração Molecular"
              onError={handleVideoError}
            />
          </div>
        </div>

        {/* Side by Side Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Process Steps Grid - Left Side */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative">
              {/* Flow indicators for desktop 2x2 grid */}
              <div className="hidden md:block absolute top-1/4 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-accent/60 to-accent/30 transform -translate-x-1/2 z-0"></div>
              <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-accent/60 to-accent/30 transform -translate-y-1/2 z-0"></div>
              
              {processSteps.map((process, index) => (
                <Card key={process.step} className="bg-card/40 backdrop-blur-sm border-primary/30 hover:border-accent/60 transition-elegant duration-300 group hover:shadow-card shadow-card relative z-10">
                  <CardContent className="p-4 lg:p-6 relative">
                    {/* Number positioned half outside, half inside the card */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-elegant duration-300 shadow-lg z-20">
                      <span className="font-bold text-sm text-brand-black font-montserrat">
                        {process.step}
                      </span>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <h3 className="font-bold text-primary text-lg lg:text-xl font-montserrat">
                        {process.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                        {process.description}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-3">
                        {process.badge}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Player - Desktop Only (right side) */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <VideoLazy
                src="https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/videos/tecnologia-oficial-compactado.mp4"
                className="w-full aspect-[4/3] object-cover rounded-lg"
                autoPlay={true}
                muted={true}
                loop={true}
                controls={false}
                title="Tecnologia ASTRO QUAT V3® - Demonstração Molecular"
                onError={handleVideoError}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TechnologySection.displayName = 'TechnologySection';

export default TechnologySection;