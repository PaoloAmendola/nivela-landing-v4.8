import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, GraduationCap, Briefcase, Bot } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";

interface BemTechSectionProps {
  id?: string;
}

const BemTechSection = memo(({ id }: BemTechSectionProps) => {
  const technologies = [
    {
      name: "BemHUB™",
      subtitle: "Central estratégica do distribuidor",
      features: [
        "Guia interativo do produto",
        "Treinamentos com quiz e certificado",
        "Scripts, objeções e argumentos prontos para usar",
        "Materiais de marketing para ativar salões",
        "Provas sociais e apresentações visuais"
      ],
      impact: "Opere com autonomia e autoridade.",
    },
    {
      name: "BemEDUCA™",
      subtitle: "Treinamento imersivo e inteligente", 
      features: [
        "Módulos curtos e objetivos",
        "Técnicas consultivas e quebra de objeções",
        "Treinamento inteligente por perfil de cliente",
        "IA integrada (BEMBOT™) como assistente de suporte"
      ],
      impact: "Equipes mais seguras e clientes mais fiéis.",
    },
    {
      name: "BemPRO™",
      subtitle: "Consultor digital do cabeleireiro moderno",
      features: [
        "Guia técnico completo de aplicação",
        "Ficha de anamnese digital + histórico de clientes",
        "Biblioteca com artigos, tricologia e tendências",
        "Materiais prontos para redes sociais",
        "IA para recomendar, resolver dúvidas e apoiar no dia a dia"
      ],
      impact: "A confiança técnica que o cabeleireiro precisa.",
    },
  ];

  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatedSection animation="fade" delay={0.2}>
          <div className="text-center mb-10 md:mb-14 lg:mb-18 space-y-4 lg:space-y-6">
            <div className="space-y-3 lg:space-y-4">
              <div className="inline-flex items-center justify-center bg-accent/20 border-2 border-accent/40 rounded-full px-8 py-4 mb-6 lg:mb-8 shadow-elegant">
                <span className="text-base md:text-lg lg:text-xl font-bold text-accent tracking-wide">
                  BÔNUS Exclusivo para Clientes NIVELA®
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat text-white tracking-tight leading-[1.1]">
                BemTech™ Ecosystem
              </h2>
              <div className="h-0.5 lg:h-1 bg-gradient-accent mx-auto w-16 lg:w-24"></div>
            </div>
            <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-primary/90">
              O primeiro ecossistema digital do setor de beleza
            </h3>
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-4xl lg:max-w-5xl mx-auto leading-relaxed">
              Uma infraestrutura completa de apoio ao cabeleireiro e ao distribuidor. 
              Um conjunto de apps inteligentes com IA integrada, que coloca conhecimento, 
              treinamento e suporte na palma da mão.
            </p>
          </div>
        </AnimatedSection>

        {/* Technologies Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-16 lg:mb-20" staggerDelay={0.2}>
          {technologies.map((tech, index) => {
            return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-accent/50 hover:scale-[1.02] transition-elegant duration-500 group shadow-card hover:shadow-card-hover">
                  <CardContent className="p-5 md:p-6 lg:p-7 space-y-4 lg:space-y-5 text-center">
                    {/* Title and Subtitle */}
                    <div className="space-y-2 lg:space-y-3">
                      <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                        {tech.name}
                      </h4>
                      <p className="text-base md:text-lg lg:text-xl text-accent">
                        {tech.subtitle}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-2 lg:space-y-3 text-base md:text-lg lg:text-xl text-muted-foreground text-left" role="list">
                      {tech.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2 lg:space-x-3">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-accent rounded-full mt-1.5 lg:mt-2 flex-shrink-0" aria-hidden="true"></div>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Impact Badge */}
                    <div className="pt-4 lg:pt-5 flex justify-center">
                      <div className="inline-flex items-center justify-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                        <span className="text-base md:text-lg font-medium text-primary/80 italic">
                          {tech.impact}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </StaggerContainer>

        {/* BemBOT Horizontal Block */}
        <div className="mb-12 lg:mb-16">
          <Card className="bg-card/20 backdrop-blur-sm border border-primary/10 shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-elegant duration-500 group">
            <CardContent className="p-6 md:p-8 lg:p-10">
              <div className="text-center space-y-4 lg:space-y-6">
                {/* Bot Icon */}
                <div className="w-18 md:w-20 lg:w-24 h-18 md:h-20 lg:h-24 bg-gradient-tech-accent rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-elegant duration-300">
                  <Bot className="w-9 md:w-10 lg:w-12 h-9 md:h-10 lg:h-12 text-primary" aria-hidden="true" />
                </div>
                
                {/* Content */}
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">BemBOT™</h4>
                  <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl lg:max-w-4xl mx-auto">
                    <strong className="text-accent">BemBOT™</strong> é a inteligência que conecta todo o ecossistema. 
                    Presente em todos os módulos, entrega suporte personalizado, respostas instantâneas e aprendizado contínuo.
                  </p>
                  <p className="text-base md:text-lg lg:text-xl text-accent font-medium italic">
                    O suporte que nunca dorme.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Section */}
        <div className="text-center space-y-4 lg:space-y-6 pt-8 lg:pt-12">
          <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary">
            Tudo conectado. Tudo BemTech™
          </h3>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl lg:max-w-3xl mx-auto">
            <strong>Distribuidores mais preparados. Equipes mais confiantes. Cabeleireiros mais seguros.</strong>
          </p>
        </div>
      </div>
    </section>
  );
});

BemTechSection.displayName = 'BemTechSection';

export default BemTechSection;