import { memo } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StaggerContainer } from "@/components/ui/stagger-container";
import { cn } from "@/lib/utils";

interface AmazonIngredientsSectionProps {
  id?: string;
}

const amazonIngredients = [
  {
    name: "MURUMURU",
    scientificName: "Astrocaryum murumuru",
    description: "Manteiga preciosa que restaura e sela as cutículas dos fios, proporcionando proteção duradoura.",
    origin: "Floresta Amazônica",
    bgGradient: "from-green-500/10 to-emerald-600/15",
    originColor: "text-emerald-600"
  },
  {
    name: "CUPUAÇU", 
    scientificName: "Theobroma grandiflorum",
    description: "Hidratação profunda e prolongada, criando uma barreira protetora contra ressecamento.",
    origin: "Floresta Amazônica",
    bgGradient: "from-amber-500/10 to-yellow-600/15",
    originColor: "text-emerald-600"
  },
  {
    name: "ROMÃ",
    scientificName: "Punica granatum", 
    description: "Antioxidante potente que combate os radicais livres, preservando a cor e vitalidade.",
    origin: "Floresta Asiática",
    bgGradient: "from-red-500/10 to-pink-600/15",
    originColor: "text-red-600"
  }
];

const AmazonIngredientsSection = memo(({ id }: AmazonIngredientsSectionProps) => {
  return (
    <section 
      id={id}
      className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-muted/30 via-background to-background"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection animation="fade" className="text-center mb-8 lg:mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold font-montserrat text-primary">
            Ativos da Amazônia
          </h2>
        </AnimatedSection>

        {/* Ingredients Cards */}
        <StaggerContainer staggerDelay={0.1} childAnimation="slide-up" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {amazonIngredients.map((ingredient, index) => (
            <Card 
              key={ingredient.name}
              className={cn(
                "relative p-4 transition-elegant duration-300 hover:border-accent/40 hover:scale-[1.02] hover:-translate-y-1 shadow-card hover:shadow-card-hover",
                `bg-gradient-to-br ${ingredient.bgGradient} border-primary/20`
              )}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-foreground mb-2 uppercase">
                  {ingredient.name}
                </h3>
                <p className="text-sm text-muted-foreground italic mb-3">
                  {ingredient.scientificName}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {ingredient.description}
                </p>
                <div className={cn("inline-flex items-center text-xs font-medium", ingredient.originColor)}>
                  • {ingredient.origin}
                </div>
              </div>
            </Card>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
});

AmazonIngredientsSection.displayName = "AmazonIngredientsSection";

export { AmazonIngredientsSection };
export default AmazonIngredientsSection;