import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  Store, 
  TrendingUp, 
  Shield, 
  Users, 
  Target,
  CheckCircle2
} from "lucide-react";

interface DistributorSectionProps {
  id?: string;
}

const DistributorSection = ({ id }: DistributorSectionProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
    ja_distribui: "",
    empresa: "",
    apresentacao: ""
  });

  // Lista de cidades principais do Brasil com estados
  const cidadesBrasil = [
    { nome: "São Paulo", estado: "SP" },
    { nome: "Rio de Janeiro", estado: "RJ" },
    { nome: "Belo Horizonte", estado: "MG" },
    { nome: "Brasília", estado: "DF" },
    { nome: "Salvador", estado: "BA" },
    { nome: "Fortaleza", estado: "CE" },
    { nome: "Recife", estado: "PE" },
    { nome: "Porto Alegre", estado: "RS" },
    { nome: "Curitiba", estado: "PR" },
    { nome: "Goiânia", estado: "GO" },
    { nome: "Belém", estado: "PA" },
    { nome: "Manaus", estado: "AM" },
    { nome: "Campo Grande", estado: "MS" },
    { nome: "Vitória", estado: "ES" },
    { nome: "Natal", estado: "RN" },
    { nome: "João Pessoa", estado: "PB" },
    { nome: "Aracaju", estado: "SE" },
    { nome: "Maceió", estado: "AL" },
    { nome: "Teresina", estado: "PI" },
    { nome: "São Luís", estado: "MA" },
    { nome: "Palmas", estado: "TO" },
    { nome: "Macapá", estado: "AP" },
    { nome: "Rio Branco", estado: "AC" },
    { nome: "Boa Vista", estado: "RR" },
    { nome: "Cuiabá", estado: "MT" },
    { nome: "Florianópolis", estado: "SC" }
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validação básica dos campos obrigatórios
      if (!formData.nome?.trim() || !formData.telefone?.trim() || !formData.email?.trim() || !formData.cidade?.trim() || !formData.ja_distribui) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const dadosEnvio = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formData.telefone.trim(),
        empresa: formData.empresa?.trim() || null,
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim(),
        experiencia_distribuicao: formData.ja_distribui,
        mensagem: formData.apresentacao?.trim() || null
      };

      // Production build - logging removed

      // Use nossa API local em vez do Supabase direto
      const response = await fetch('/api/distribuidores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEnvio)
      });

      // Production build - logging removed

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        // Production build - logging removed
        throw new Error(errorData.error || 'Erro ao enviar solicitação');
      }

      const responseData = await response.json();
      // Production build - logging removed
      
      setIsSubmitted(true);
      toast.success('Solicitação enviada com sucesso!');
    } catch (error: any) {
      // Production-ready error handling
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        toast.error('Este email já foi cadastrado. Nossa equipe entrará em contato em breve.');
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      ja_distribui: value
    });
  };

  const handleCidadeChange = (cidadeCompleta: string) => {
    const cidadeSelecionada = cidadesBrasil.find(c => `${c.nome} - ${c.estado}` === cidadeCompleta);
    if (cidadeSelecionada) {
      setFormData({
        ...formData,
        cidade: cidadeSelecionada.nome,
        estado: cidadeSelecionada.estado
      });
    }
  };

  if (isSubmitted) {
    return (
      <section id={id} className="py-12 md:py-16 lg:py-20 xl:py-24 px-4 md:px-6 lg:px-12 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 space-y-6 md:space-y-8 shadow-card">
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-brand-black" aria-hidden="true" />
            </div>
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary font-montserrat px-2">
                Candidatura Enviada com Sucesso!
              </h2>
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed px-2">
                Recebemos sua candidatura para se tornar um distribuidor <strong className="text-brand-caramel">Bem Beauty Professional</strong>.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6 text-left space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-bold text-primary font-montserrat">Próximos passos:</h3>
                <ul className="space-y-2 md:space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2 md:gap-3">
                    <div className="w-2 h-2 bg-brand-caramel rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                    <span className="text-sm md:text-base"><strong>Análise da candidatura</strong> - Nossa equipe analisará seu perfil em até 48 horas</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <div className="w-2 h-2 bg-brand-caramel rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                    <span className="text-sm md:text-base"><strong>Primeira reunião</strong> - Apresentação detalhada do modelo de distribuição</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <div className="w-2 h-2 bg-brand-caramel rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                    <span className="text-sm md:text-base"><strong>Proposta comercial</strong> - Condições e valores personalizados para sua região</span>
                  </li>
                </ul>
              </div>
              <p className="text-base md:text-lg text-brand-caramel font-semibold">
                Bem-vindo à revolução da beleza profissional! 🎉
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const benefits = [
    {
      icon: Store,
      title: "Marca Premium",
      description: "Represente uma marca reconhecida no mercado profissional"
    },
    {
      icon: TrendingUp,
      title: "Alto Potencial",
      description: "Mercado em crescimento com margens atrativas"
    },
    {
      icon: Shield,
      title: "Suporte Completo",
      description: "Treinamento, marketing e suporte técnico incluído"
    },
    {
      icon: Users,
      title: "Rede Exclusiva",
      description: "Faça parte de uma rede seleta de distribuidores"
    }
  ];

  return (
    <section id={id} className="py-12 md:py-16 lg:py-20 xl:py-24 px-4 md:px-6 lg:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
          <Badge variant="secondary" className="mx-auto bg-primary/10 border-primary/20 text-primary/80 text-xs md:text-sm">
            OPORTUNIDADE EXCLUSIVA
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-montserrat text-white tracking-tight leading-[1.1] px-2">
            Seja um Distribuidor
            <span className="block text-brand-caramel">Bem Beauty Professional</span>
          </h2>
          <div className="h-0.5 lg:h-1 bg-gradient-accent mx-auto w-12 md:w-16 lg:w-24"></div>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-montserrat max-w-3xl mx-auto px-4">
            Junte-se à revolução da beleza profissional. Distribua produtos premium com tecnologia patenteada e suporte completo para o seu sucesso.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Benefits Section */}
          <AnimatedSection animation="slide-right" className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary font-montserrat px-2">
                Por que ser nosso distribuidor?
              </h3>
              
              <div className="grid gap-4 md:gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 border border-border/50"
                  >
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary font-montserrat mb-1 text-sm md:text-base">
                        {benefit.title}
                      </h4>
                      <p className="text-muted-foreground text-sm md:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </AnimatedSection>

          {/* Form Section */}
          <AnimatedSection animation="slide-left" className="order-1 lg:order-2">
            <Card className="p-4 md:p-6 lg:p-8 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="space-y-4 md:space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-primary font-montserrat">
                    Quero conhecer o modelo
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Preencha seus dados e receba informações detalhadas
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Campos obrigatórios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label htmlFor="dist-name" className="sr-only">Nome completo</label>
                      <Input
                        id="dist-name"
                        name="nome"
                        placeholder="Nome completo *"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        aria-label="Nome completo"
                        className="bg-background/50 h-10 md:h-11 text-sm md:text-base"
                        disabled={isLoading}
                        data-testid="input-nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="dist-phone" className="sr-only">WhatsApp</label>
                      <Input
                        id="dist-phone"
                        name="telefone"
                        type="tel"
                        placeholder="WhatsApp *"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        aria-label="Número do WhatsApp"
                        className="bg-background/50 h-10 md:h-11 text-sm md:text-base"
                        disabled={isLoading}
                        data-testid="input-telefone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label htmlFor="dist-email" className="sr-only">E-mail</label>
                      <Input
                        id="dist-email"
                        name="email"
                        type="email"
                        placeholder="E-mail *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-label="E-mail"
                        className="bg-background/50 h-10 md:h-11 text-sm md:text-base"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="dist-city" className="sr-only">Cidade</label>
                      <Select 
                        onValueChange={handleCidadeChange}
                        required
                        disabled={isLoading}
                        value={formData.cidade ? `${formData.cidade} - ${formData.estado}` : ""}
                      >
                        <SelectTrigger className="bg-background/50 h-10 md:h-11 text-sm md:text-base">
                          <SelectValue placeholder="Cidade *" />
                        </SelectTrigger>
                        <SelectContent>
                          {cidadesBrasil.map((cidade) => (
                            <SelectItem 
                              key={`${cidade.nome}-${cidade.estado}`} 
                              value={`${cidade.nome} - ${cidade.estado}`}
                            >
                              {cidade.nome} - {cidade.estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pergunta sobre distribuição */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-primary">
                      Já distribui alguma marca? *
                    </Label>
                    <RadioGroup
                      value={formData.ja_distribui}
                      onValueChange={handleRadioChange}
                      className="flex flex-col xs:flex-row gap-3 xs:gap-6"
                      disabled={isLoading}
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="sim" />
                        <Label htmlFor="sim" className="cursor-pointer text-sm md:text-base">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="nao" />
                        <Label htmlFor="nao" className="cursor-pointer text-sm md:text-base">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Campos opcionais */}
                  <div>
                    <label htmlFor="dist-company" className="sr-only">Empresa</label>
                    <Input
                      id="dist-company"
                      name="empresa"
                      placeholder="Empresa (opcional)"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      aria-label="Nome da empresa"
                      className="bg-background/50 h-10 md:h-11 text-sm md:text-base"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="dist-presentation" className="sr-only">Apresentação</label>
                    <Textarea
                      id="dist-presentation"
                      name="apresentacao"
                      placeholder="Faça uma breve apresentação (opcional)"
                      value={formData.apresentacao}
                      onChange={handleInputChange}
                      aria-label="Apresentação pessoal"
                      className="bg-background/50 min-h-[80px] md:min-h-[100px] text-sm md:text-base resize-none"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="premium"
                    size="lg"
                    className="w-full font-bold h-12 md:h-14 text-sm md:text-base"
                    disabled={isLoading}
                    data-testid="button-submit-distribuidor"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2 md:space-x-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin"></div>
                        <span className="text-sm md:text-base">Enviando candidatura...</span>
                      </div>
                    ) : (
                      "QUERO SER DISTRIBUIDOR"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Ao enviar, você concorda em receber informações sobre nossa oportunidade de distribuição.
                  </p>
                </form>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default DistributorSection;