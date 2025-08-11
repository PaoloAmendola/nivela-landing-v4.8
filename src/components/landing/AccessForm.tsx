import React, { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { toast } from "sonner";

interface AccessFormProps {
  id?: string;
}

const AccessForm = memo(({ id }: AccessFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipo_estabelecimento: ""
  });
  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipo_estabelecimento: ""
  });

  const validateForm = () => {
    const newErrors = { nome: "", email: "", telefone: "", tipo_estabelecimento: "" };
    let isValid = true;

    // Nome - deve ter pelo menos 2 caracteres e não pode ser apenas números
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
    if (!formData.nome.trim() || formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
      isValid = false;
    } else if (!nameRegex.test(formData.nome.trim())) {
      newErrors.nome = "Nome deve conter apenas letras e espaços";
      isValid = false;
    }

    // Email - validação básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email deve ter um formato válido";
      isValid = false;
    }

    // Telefone - deve ter exatamente 11 dígitos (formato brasileiro)
    const telefoneDigits = formData.telefone.replace(/\D/g, '');
    if (!formData.telefone.trim()) {
      newErrors.telefone = "WhatsApp é obrigatório";
      isValid = false;
    } else if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
      newErrors.telefone = "WhatsApp deve ter 10 ou 11 dígitos";
      isValid = false;
    } else if (telefoneDigits.length === 11 && telefoneDigits[2] !== '9') {
      newErrors.telefone = "Celular deve começar com 9 após o DDD";
      isValid = false;
    }

    // Tipo de estabelecimento - validação simples
    if (!formData.tipo_estabelecimento.trim()) {
      newErrors.tipo_estabelecimento = "Tipo de estabelecimento é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Capture tracking data
      const utmParams = new URLSearchParams(window.location.search);
      
      // Use nossa API local
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim().toLowerCase(),
          telefone: formData.telefone.trim(),
          tipoEstabelecimento: formData.tipo_estabelecimento
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || 'Erro ao salvar dados');
      }
      
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (field === 'nome' && value.trim().length >= 2) {
      setErrors(prev => ({ ...prev, nome: "" }));
    } else if (field === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setErrors(prev => ({ ...prev, email: "" }));
    } else if (field === 'telefone' && value.replace(/\D/g, '').length >= 10) {
      setErrors(prev => ({ ...prev, telefone: "" }));
    } else if (field === 'tipo_estabelecimento' && value.trim()) {
      setErrors(prev => ({ ...prev, tipo_estabelecimento: "" }));
    }
  };

  const formatWhatsApp = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Apply WhatsApp mask (XX) XXXXX-XXXX
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    handleInputChange('telefone', formatted);
  };

  if (isSubmitted) {
    return (
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle" id={id || "acesso"}>
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 space-y-8 shadow-card">
            <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-brand-black" aria-hidden="true" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary font-montserrat">
                Solicitação Enviada!
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Recebemos sua solicitação de acesso exclusivo ao NIVELA®. Nossa equipe especializada entrará em contato em até 24 horas.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-gradient-subtle" id={id || "acesso"}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16 space-y-4 lg:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white font-montserrat tracking-tight leading-[1.1] px-4 sm:px-0">
            Solicite seu acesso exclusivo
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed px-4 sm:px-0">
            Preencha apenas 4 campos essenciais para validação profissional.
          </p>
        </div>

        {/* Form */}
        <LoadingState 
          isLoading={isLoading} 
          variant="skeleton" 
          className="h-96"
          fallback={
            <div className="space-y-6 animate-pulse">
              <div className="h-14 bg-muted/20 rounded-xl" />
              <div className="h-14 bg-muted/20 rounded-xl" />
              <div className="h-14 bg-muted/20 rounded-xl" />
              <div className="h-14 bg-muted/20 rounded-xl" />
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
          {/* Nome completo */}
          <div className="space-y-2">
            <label htmlFor="professional-name" className="block text-sm font-medium text-primary sr-only">
              Nome completo do profissional
            </label>
            <div className="relative">
              <Input
                id="professional-name"
                type="text"
                placeholder="Ex: Ana Ribeiro Santos"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`min-h-[56px] h-12 md:h-14 bg-input/50 border-primary/20 text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl lg:rounded-2xl text-base lg:text-lg transition-elegant hover:scale-[1.01] focus:scale-[1.01] touch-manipulation ${
                  errors.nome ? 'border-red-500 focus:border-red-500' : 
                  formData.nome.trim().length >= 2 ? 'border-green-500' : ''
                }`}
                aria-label="Nome completo do profissional"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? "name-error" : undefined}
                required
                autoComplete="name"
                inputMode="text"
              />
              {formData.nome.trim().length >= 2 && !errors.nome && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.nome && (
              <div id="name-error" className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.nome}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="professional-email" className="block text-sm font-medium text-primary sr-only">
              Email profissional
            </label>
            <div className="relative">
              <Input
                id="professional-email"
                type="email"
                placeholder="Ex: ana@studiobrhair.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`min-h-[56px] h-12 md:h-14 bg-input/50 border-primary/20 text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl lg:rounded-2xl text-base lg:text-lg transition-elegant hover:scale-[1.01] focus:scale-[1.01] touch-manipulation ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 
                  formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? 'border-green-500' : ''
                }`}
                required
                autoComplete="email"
                inputMode="email"
                aria-label="Email profissional"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && !errors.email && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.email && (
              <div id="email-error" className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="professional-whatsapp" className="block text-sm font-medium text-primary sr-only">
              WhatsApp profissional
            </label>
            <div className="relative">
              <Input
                id="professional-whatsapp"
                type="tel"
                placeholder="Ex: (21) 91234-5678"
                value={formData.telefone}
                onChange={handleWhatsAppChange}
                className={`min-h-[56px] h-12 md:h-14 bg-input/50 border-primary/20 text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl lg:rounded-2xl text-base lg:text-lg transition-elegant hover:scale-[1.01] focus:scale-[1.01] touch-manipulation ${
                  errors.telefone ? 'border-red-500 focus:border-red-500' : 
                  formData.telefone.replace(/\D/g, '').length >= 10 ? 'border-green-500' : ''
                }`}
                maxLength={15}
                required
                autoComplete="tel"
                inputMode="tel"
                aria-label="Número do WhatsApp profissional"
                aria-invalid={!!errors.telefone}
                aria-describedby={errors.telefone ? "whatsapp-error" : undefined}
              />
              {formData.telefone.replace(/\D/g, '').length >= 10 && !errors.telefone && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.telefone && (
              <div id="whatsapp-error" className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.telefone}</span>
              </div>
            )}
          </div>

          {/* Tipo de Estabelecimento */}
          <div className="space-y-2">
            <label htmlFor="establishment-type" className="block text-sm font-medium text-primary sr-only">
              Tipo de estabelecimento onde atua
            </label>
            <div className="relative">
              <Select
                value={formData.tipo_estabelecimento}
                onValueChange={(value) => handleInputChange('tipo_estabelecimento', value)}
                required
              >
                <SelectTrigger 
                  id="establishment-type"
                  className={`min-h-[56px] h-12 md:h-14 bg-input/50 border-primary/20 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl lg:rounded-2xl text-base lg:text-lg transition-elegant hover:scale-[1.01] focus:scale-[1.01] touch-manipulation ${
                    errors.tipo_estabelecimento ? 'border-red-500 focus:border-red-500' : 
                    formData.tipo_estabelecimento ? 'border-green-500' : ''
                  }`}
                  aria-label="Tipo de estabelecimento onde atua"
                  aria-invalid={!!errors.tipo_estabelecimento}
                  aria-describedby={errors.tipo_estabelecimento ? "establishment-error" : undefined}
                >
                  <SelectValue placeholder="Selecione o tipo de estabelecimento" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20 rounded-xl shadow-lg">
                  <SelectItem value="salao-proprio" className="text-primary hover:bg-accent/10 focus:bg-accent/10 rounded-lg">
                    Salão próprio
                  </SelectItem>
                  <SelectItem value="salao-terceiros" className="text-primary hover:bg-accent/10 focus:bg-accent/10 rounded-lg">
                    Salão de terceiros
                  </SelectItem>
                  <SelectItem value="atendimento-domiciliar" className="text-primary hover:bg-accent/10 focus:bg-accent/10 rounded-lg">
                    Atendimento domiciliar
                  </SelectItem>
                  <SelectItem value="studio-compartilhado" className="text-primary hover:bg-accent/10 focus:bg-accent/10 rounded-lg">
                    Studio/Espaço compartilhado
                  </SelectItem>
                  <SelectItem value="freelancer" className="text-primary hover:bg-accent/10 focus:bg-accent/10 rounded-lg">
                    Freelancer
                  </SelectItem>
                </SelectContent>
              </Select>
              {formData.tipo_estabelecimento && !errors.tipo_estabelecimento && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.tipo_estabelecimento && (
              <div id="establishment-error" className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{errors.tipo_estabelecimento}</span>
              </div>
            )}
          </div>

          {/* Submit Button - Enhanced */}
          <div className="pt-6 lg:pt-8">
            <Button
              type="submit"
              variant="premium"
              size="xl"
              disabled={isLoading || !formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim() || !formData.tipo_estabelecimento.trim()}
              className="w-full text-lg lg:text-xl rounded-xl lg:rounded-2xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-glow active:scale-95 transition-elegant focus-visible-enhanced touch-target min-h-[56px] min-w-[44px]"
              aria-label="Enviar solicitação de acesso ao NIVELA"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin"></div>
                  <span>Validando informações...</span>
                </div>
              ) : (
                "ENVIAR SOLICITAÇÃO"
              )}
            </Button>
          </div>
          </form>
        </LoadingState>

        {/* Security Notice */}
        <div className="pt-8 text-center">
          <p className="text-sm lg:text-base text-muted-foreground/80 leading-relaxed">
            🔒 Seus dados estão protegidos e serão usados apenas para análise de elegibilidade profissional. 
            Nossa equipe entrará em contato em até 24 horas para validação.
          </p>
        </div>

        {/* Loja Oficial Call-to-Action */}
        <div className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-2xl p-6 mt-10 space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-lg md:text-xl font-semibold text-white font-montserrat">
              Conheça nossa loja oficial
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Acesse nossa plataforma exclusiva para profissionais
            </p>
          </div>
          <a
            href="https://www.bembeauty.com.br/collections/nivela"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold text-base text-brand-black bg-gradient-accent hover:scale-105 active:scale-95 transition-elegant duration-300 shadow-lg hover:shadow-xl border border-accent/20"
          >
            ACESSAR LOJA OFICIAL
          </a>
        </div>
      </div>
    </section>
  );
});

AccessForm.displayName = 'AccessForm';

export default AccessForm;