import React, { memo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ParallaxContainer } from "@/components/ui/parallax-container";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { PerformanceAwareImage } from "@/components/ui/performance-aware-image";
import { CTAButton, CTAStrategies } from "@/components/ui/cta-button";
import AccessFormModal from "@/components/landing/AccessFormModal.tsx";
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization";

import { ChevronDown } from "lucide-react";

interface HeaderProps {
  id?: string;
}

const Header = memo(({ id }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startRenderTiming, endRenderTiming, optimizeImage } = usePerformanceOptimization({
    enableImageOptimization: true,
    performanceBudget: {
      maxImageSize: 500 * 1024, // 500KB
      maxBundleSize: 1024 * 1024, // 1MB
      maxRenderTime: 100 // 100ms
    }
  });

  useEffect(() => {
    startRenderTiming();
    return () => endRenderTiming();
  }, [startRenderTiming, endRenderTiming]);

  return (
    <header id={id} className="hero-section relative overflow-hidden">
      {/* Spotlight Effect Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial opacity-80"></div>
        {/* Additional focused light spot */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-latte/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Navigation */}
      <nav className="w-full px-4 md:px-8 lg:px-12 py-8 flex justify-center items-center relative z-10">
        <PerformanceAwareImage 
          src="https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/logo-bembeauty-transparente.png"
          alt="Bem Beauty Professional - Logo da marca"
          className="h-8 md:h-10 w-auto object-contain"
          width={160}
          height={40}
          sizes="(max-width: 768px) 160px, 200px"
          priority={true}
          loading="eager"
          placeholder="skeleton"
        />
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pb-12 lg:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center justify-center min-h-screen py-6 lg:py-8">
            
            {/* Content Section - 60% width on desktop */}
            <div className="lg:col-span-3 order-2 lg:order-1 w-full flex justify-center">
              <div className="hero-content flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:space-y-6 w-full max-w-full lg:max-w-4xl px-2 sm:px-4 lg:px-0">
                
                {/* Unified Brand + Title Block */}
                <div className="space-y-3 lg:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-bold text-brand-light leading-[1.1] tracking-tight">
                    <span className="block text-brand-latte font-semibold">NIVELA®</span>
                    <span className="block">A evolução da</span>
                    <span className="block">escova progressiva</span>
                  </h1>
                </div>
                
                {/* Subtitle Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-montserrat text-brand-cloud leading-relaxed max-w-full lg:max-w-4xl mt-4 lg:mt-8 px-2 sm:px-0">
                  <span className="block sm:inline">Desenvolvido com tecnologia patenteada,</span>
                  <span className="block sm:inline"> sem formol, com ativos da Amazônia</span>
                  <span className="block sm:inline"> e rendimento 30% superior.</span>
                </p>

                {/* Badges - Hierarchical design */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full max-w-full lg:max-w-3xl mt-6 lg:mt-12 mb-8 lg:mb-14 px-4 sm:px-0">
                   <div className="bg-brand-deep/50 border border-brand-deep hover:bg-brand-deep/70 focus-visible:bg-brand-deep/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte/50 hover:scale-[1.02] focus-visible:scale-[1.02] transition-elegant px-4 py-3 lg:px-5 lg:py-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[72px] touch-manipulation" tabIndex={0} role="button" aria-label="Produto livre de formol">
                     <span className="text-sm md:text-base lg:text-lg font-bold text-brand-latte">LIVRE</span>
                     <span className="text-xs md:text-sm font-normal text-brand-cloud/90">de formol</span>
                   </div>
                   <div className="border border-brand-latte hover:bg-brand-latte/10 focus-visible:bg-brand-latte/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte/50 hover:scale-[1.02] focus-visible:scale-[1.02] transition-elegant px-4 py-3 lg:px-5 lg:py-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[72px] touch-manipulation" tabIndex={0} role="button" aria-label="Textura em gel">
                     <span className="text-sm md:text-base lg:text-lg font-bold text-brand-latte">TEXTURA</span>
                     <span className="text-xs md:text-sm font-normal text-brand-latte/90">em gel</span>
                   </div>
                   <div className="sm:col-span-2 lg:col-span-1 bg-brand-caramel/20 border border-brand-caramel hover:bg-brand-caramel/30 focus-visible:bg-brand-caramel/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte/50 hover:scale-[1.02] focus-visible:scale-[1.02] transition-elegant px-4 py-3 lg:px-5 lg:py-4 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[72px] touch-manipulation" tabIndex={0} role="button" aria-label="Tecnologia ASTRO QUAT V3">
                     <span className="text-sm md:text-base lg:text-lg font-bold text-brand-latte">TECNOLOGIA</span>
                     <span className="text-xs md:text-sm font-normal text-brand-latte/90">ASTRO QUAT V3®</span>
                   </div>
                 </div>

                 {/* Primary CTA Button - Captura de Lead Premium */}
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="min-h-[56px] min-w-[280px] touch-manipulation px-6 sm:px-8 lg:px-10 rounded-xl hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-latte/50 focus:ring-offset-2 transition-elegant text-sm sm:text-base lg:text-lg font-semibold w-full sm:w-auto max-w-sm bg-gradient-to-r from-brand-caramel to-brand-latte text-brand-black hover:shadow-premium active:scale-[0.98] cursor-pointer"
                   aria-label="Solicitar acesso exclusivo ao NIVELA - Formulário de cadastro profissional"
                   tabIndex={0}
                 >
                   SOLICITAR ACESSO EXCLUSIVO
                 </button>
                
              </div>
            </div>

            {/* Product Image Section - 40% width on desktop */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end order-1 lg:order-2 w-full px-4 sm:px-6 lg:px-0">
              <div className="relative w-full flex justify-center lg:justify-end max-w-lg lg:max-w-none">
                {/* Product Image */}
                <PerformanceAwareImage 
                  src="https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/frasco-trans-comp.png"
                  alt="NIVELA® - Retexturizador hidro nutritivo de 1kg com fundo transparente"
                  className="w-72 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem] h-auto object-contain drop-shadow-2xl scale-110"
                  width={800}
                  height={800}
                  sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 384px, (max-width: 1280px) 448px, 512px"
                  priority={true}
                  loading="eager"
                  placeholder="skeleton"
                />
                
                {/* Enhanced spotlight glow effect */}
                <div className="absolute inset-0 bg-white/15 rounded-full blur-3xl -z-10 scale-110"></div>
                <div className="absolute inset-0 bg-brand-latte/25 rounded-full blur-2xl -z-10 scale-150"></div>
                <div className="absolute inset-0 bg-white/8 rounded-full blur-xl -z-10 scale-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-deep/10 rounded-full blur-3xl"></div>

      {/* Access Form Modal */}
      <AccessFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;