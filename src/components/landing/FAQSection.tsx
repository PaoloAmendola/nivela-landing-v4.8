import { memo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";

interface FAQSectionProps {
  id?: string;
}

const FAQSection = memo(({ id }: FAQSectionProps) => {
  const faqs = [
    {
      question: "NIVELA® é realmente livre de formol?",
      answer: "Absolutamente. NIVELA® utiliza a tecnologia patenteada ASTRO QUAT V3®, completamente livre de formol, formaldeído ou qualquer substância similar.",
    },
    {
      question: "Qual o diferencial da textura em gel?", 
      answer: "A textura gel inteligente proporciona 30% mais rendimento comparado aos cremes convencionais, além de facilitar a aplicação uniforme e reduzir o desperdício, otimizando seu investimento.",
    },
    {
      question: "NIVELA® funciona em todos os tipos de cabelo?",
      answer: "Sim. A tecnologia ASTRO QUAT V3® foi desenvolvida para ser eficaz em todos os tipos de cabelo, desde os mais resistentes até os mais sensibilizados, sempre respeitando a estrutura natural dos fios.",
    },
    {
      question: "É necessário treinamento específico?",
      answer: "Embora NIVELA® seja de fácil aplicação, oferecemos acesso completo ao ecossistema BemTech™, incluindo treinamentos especializados, suporte técnico e materiais didáticos exclusivos.",
    },
    {
      question: "Como funciona o suporte técnico?",
      answer: "Você terá acesso 24/7 ao BEMBOT™, nossa IA especializada, além de suporte direto via WhatsApp e acesso ao portal exclusivo com materiais técnicos e comerciais.",
    },
    {
      question: "NIVELA® pode ser usado com outros tratamentos?",
      answer: "Sim, NIVELA® é compatível com colorações, luzes e outros tratamentos químicos, sempre respeitando os intervalos adequados e protocolos de segurança.",
    },
    {
      question: "Como me torno um profissional autorizado?",
      answer: "O acesso a NIVELA® é exclusivo para profissionais qualificados. Complete nosso formulário de cadastro para avaliação e aprovação da sua candidatura.",
    },
    {
      question: "Existe suporte para marketing e vendas?",
      answer: "Sim! O ecossistema BemTech™ inclui materiais prontos para redes sociais, scripts de vendas, campanhas e tudo que você precisa para potencializar seus resultados comerciais.",
    },
  ];

  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 space-y-4 lg:space-y-6">
          <div className="space-y-3 lg:space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-montserrat text-white tracking-tight leading-[1.1]">
              Perguntas Frequentes
            </h2>
            <div className="h-0.5 lg:h-1 bg-gradient-accent mx-auto w-16 lg:w-24"></div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 lg:space-y-4">
          <Accordion type="single" collapsible className="space-y-3 lg:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="group border border-primary/20 rounded-2xl px-6 py-1 hover:border-accent/40 hover:bg-primary/5 hover:scale-[1.01] transition-elegant duration-300 shadow-card hover:shadow-card-hover focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AccordionTrigger className="text-left font-semibold text-lg lg:text-xl text-primary group-hover:text-accent transition-elegant py-5 min-h-12 focus-visible-enhanced">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base lg:text-lg leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Final */}
        <div className="mt-20 text-center space-y-8">
          <p className="text-lg lg:text-xl xl:text-2xl text-muted-foreground font-montserrat">
            Ainda tem dúvidas? Nossa equipe especializada está pronta para ajudar.
          </p>
          <a 
            href="https://wa.me/552139500901"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-lg lg:text-xl px-12 py-6 rounded-2xl hover:scale-105 hover:shadow-glow focus-visible-enhanced transition-elegant bg-gradient-primary text-white font-semibold"
            aria-label="Falar com especialista no WhatsApp"
          >
            FALAR COM ESPECIALISTA
          </a>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;