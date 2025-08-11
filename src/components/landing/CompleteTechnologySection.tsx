import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoLazy } from "@/components/ui/video-lazy";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { cn } from "@/lib/utils";

interface CompleteTechnologySectionProps {
  id?: string;
}

const processSteps = [
  {
    number: "01",
    title: "Penetração",
    description: "Penetra até o córtex para iniciar a transformação de dentro para fora.",
    badge: "Ação Profunda",
    gradient: "from-blue-500/5 to-cyan-500/8"
  },
  {
    number: "02", 
    title: "Modificação",
    description: "Modifica ligações secundárias, sem danificar estrutura proteica",
    badge: "Modificação Molecular",
    gradient: "from-purple-500/5 to-violet-500/8"
  },
  {
    number: "03",
    title: "Reparação", 
    description: "Repara micro-danos com ativos nutritivos e lipídicos.",
    badge: "Nutrição Direcionada",
    gradient: "from-green-500/5 to-emerald-500/8"
  },
  {
    number: "04",
    title: "Realinhamento",
    description: "Realinha a estrutura da queratina, reduzindo frizz e volume",
    badge: "Alinhamento Preciso", 
    gradient: "from-amber-500/5 to-orange-500/8"
  }
];

const CompleteTechnologySection = memo(({ id }: CompleteTechnologySectionProps) => {
  const handleVideoError = () => {
    // Video error handled silently
  };

  return (
    <section 
      id={id}
      className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-background via-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection animation="fade" className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Tecnologia{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              ASTRO QUAT V3®
            </span>
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent w-16 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Desenvolvida por pesquisa molecular avançada, a tecnologia ASTRO QUAT V3® atua em escala nanométrica, 
            reorganizando as ligações internas da fibra capilar com precisão e segurança, totalmente livre de formol.
          </p>
        </AnimatedSection>

        {/* Main Content - Mobile: Video first, then cards */}
        <div className="lg:hidden">
          <AnimatedSection animation="scale" className="mb-12">
            <div className="relative aspect-[4/3] max-w-md mx-auto rounded-xl overflow-hidden shadow-elegant">
              <VideoLazy
                src="https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/videos/OFICIAL-Astroquat-animacaao-julho.mp4"
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                threshold={0.3}
                onError={handleVideoError}
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Main Content - Desktop: Side by side */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Process Cards Grid */}
          <StaggerContainer staggerDelay={0.15} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-px h-12 bg-gradient-to-b from-primary/40 to-transparent transform -translate-x-1/2 -translate-y-6" />
                <div className="absolute top-1/2 left-1/2 w-12 h-px bg-gradient-to-r from-primary/40 to-transparent transform -translate-x-6 -translate-y-1/2" />
              </div>

              {processSteps.map((step, index) => (
                <Card 
                  key={step.number}
                  className={cn(
                    "relative p-6 transition-all duration-300 hover:scale-105 hover:shadow-elegant group",
                    `bg-gradient-to-br ${step.gradient} border-muted/20 backdrop-blur-sm`
                  )}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {step.badge}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </StaggerContainer>

          {/* Video Player - Desktop only */}
          <div className="hidden lg:block">
            <AnimatedSection animation="scale" delay={0.3}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-elegant">
                <VideoLazy
                  src="https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/videos/OFICIAL-Astroquat-animacaao-julho.mp4"
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  threshold={0.3}
                  onError={handleVideoError}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
});

CompleteTechnologySection.displayName = "CompleteTechnologySection";

export { CompleteTechnologySection };
export default CompleteTechnologySection;