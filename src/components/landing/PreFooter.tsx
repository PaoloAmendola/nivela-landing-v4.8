interface PreFooterProps {
  id?: string;
}

const PreFooter = ({ id }: PreFooterProps) => {
  return (
    <section id={id} className="py-16 lg:py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary font-montserrat">
            Conheça nossa loja oficial
          </h3>
          <p className="text-lg lg:text-xl text-muted-foreground font-montserrat">
            Acesse nossa plataforma exclusiva para profissionais
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <a
            href="https://bembeauty.com.br/?utm_source=landing-nivela&utm_medium=referral&utm_campaign=acesso_loja"
            data-gtm-event="cta_acessar_loja"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold text-lg text-brand-black bg-gradient-accent hover:scale-105 active:scale-95 transition-elegant duration-300 shadow-premium hover:shadow-glow border-2 border-brand-caramel/30 hover:border-brand-caramel/50 hover:shadow-[0_0_20px_rgba(157,73,22,0.3)] backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-caramel)) 0%, hsl(var(--brand-latte)) 100%)',
              boxShadow: '0 8px 32px rgba(157, 73, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            ACESSAR LOJA OFICIAL
          </a>
        </div>
      </div>
    </section>
  );
};

export default PreFooter;