import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

interface SynergyCalloutProps {
  id?: string;
  className?: string;
}

const SynergyCallout = memo(({ id, className }: SynergyCalloutProps) => {
  return (
    <section 
      id={id}
      className={cn("relative py-12 md:py-16 lg:py-20", className)}
    >
      <div className="container mx-auto px-4">
        <AnimatedSection animation="scale" className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-muted/10 border border-primary/10 shadow-elegant overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-primary to-primary/50 rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-secondary to-secondary/50 rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                A{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Sinergia Perfeita
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Quando a precisão molecular da tecnologia{" "}
                <span className="font-semibold text-foreground">ASTRO QUAT V3®</span>{" "}
                encontra a pureza dos ativos amazônicos, nasce uma revolução capilar que transforma fios em{" "}
                <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  obras de arte naturais
                </span>
                .
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

SynergyCallout.displayName = "SynergyCallout";

export { SynergyCallout };
export default SynergyCallout;