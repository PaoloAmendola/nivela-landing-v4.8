import React, { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";

import { toast } from "sonner";

interface AccessFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessFormModal = memo(({ isOpen, onClose }: AccessFormModalProps) => {
  // Debug removido para produção
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
      // Capturar dados de rastreamento
      const utmParams = new URLSearchParams(window.location.search);
      const leadData = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formData.telefone,
        tipo_estabelecimento: formData.tipo_estabelecimento,
        utm_source: utmParams.get('utm_source') || 'landing_page',
        utm_medium: utmParams.get('utm_medium') || 'form',
        utm_campaign: utmParams.get('utm_campaign') || 'acesso_exclusivo',
        user_agent: navigator.userAgent
      };

      // Use nossa API local
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: leadData.nome,
          email: leadData.email,
          telefone: leadData.telefone,
          tipoEstabelecimento: leadData.tipo_estabelecimento
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || 'Erro ao salvar dados');
      }
      
      setIsSubmitted(true);
      toast.success('Solicitação enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.');
    } catch (error: any) {
      // Production-ready error handling
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        toast.error('Este email já foi cadastrado. Nossa equipe entrará em contato em breve.');
      } else {
        toast.error('Erro inesperado. Tente novamente ou entre em contato via WhatsApp.');
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

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      tipo_estabelecimento: ""
    });
    setErrors({
      nome: "",
      email: "",
      telefone: "",
      tipo_estabelecimento: ""
    });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border border-primary/20">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-primary font-montserrat text-center">
            Acesso Exclusivo NIVELA®
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center leading-relaxed">
            Validação profissional em 4 passos simples. Nossos especialistas analisarão seu perfil para garantir acesso exclusivo.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-brand-black" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-primary font-montserrat">
                Solicitação Enviada!
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Recebemos sua solicitação de acesso exclusivo ao NIVELA®. Nossa equipe especializada entrará em contato em até 24 horas.
              </p>
            </div>
            <Button 
              onClick={handleClose}
              variant="premium"
              className="w-full rounded-xl touch-target focus-visible-enhanced"
            >
              Fechar
            </Button>
          </div>
        ) : (
          <LoadingState 
            isLoading={isLoading} 
            variant="skeleton" 
            className="h-96"
            fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-muted/20 rounded-xl" />
                <div className="h-12 bg-muted/20 rounded-xl" />
                <div className="h-12 bg-muted/20 rounded-xl" />
                <div className="h-12 bg-muted/20 rounded-xl" />
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome completo */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Ex: Ana Ribeiro Santos"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className={`min-h-[56px] h-12 bg-input/50 border-primary/20 text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl transition-elegant touch-manipulation ${
                      errors.nome ? 'border-red-500 focus:border-red-500' : 
                      formData.nome.trim().length >= 2 ? 'border-green-500' : ''
                    }`}
                    aria-label="Nome completo do profissional"
                    required
                    autoComplete="name"
                  />
                  {formData.nome.trim().length >= 2 && !errors.nome && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.nome && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{errors.nome}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Ex: ana@studiobrhair.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`min-h-[56px] h-12 bg-input/50 border-primary/20 text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl transition-elegant touch-manipulation ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 
                      formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? 'border-green-500' : ''
                    }`}
                    required
                    autoComplete="email"
                    aria-label="Email profissional"
                  />
                  {formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && !errors.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Ex: (21) 91234-5678"
                    value={formData.telefone}
                    onChange={handleWhatsAppChange}
                    className={`min-h-[56px] h-12 bg-input/50 border-primary/20 text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl transition-elegant touch-manipulation ${
                      errors.telefone ? 'border-red-500 focus:border-red-500' : 
                      formData.telefone.replace(/\D/g, '').length >= 10 ? 'border-green-500' : ''
                    }`}
                    maxLength={15}
                    required
                    autoComplete="tel"
                    aria-label="Número do WhatsApp profissional"
                  />
                  {formData.telefone.replace(/\D/g, '').length >= 10 && !errors.telefone && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.telefone && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{errors.telefone}</span>
                  </div>
                )}
              </div>

              {/* Tipo de Estabelecimento */}
              <div className="space-y-2">
                <div className="relative">
                  <Select
                    value={formData.tipo_estabelecimento}
                    onValueChange={(value) => handleInputChange('tipo_estabelecimento', value)}
                    required
                  >
                    <SelectTrigger 
                      className={`min-h-[56px] h-12 bg-input/50 border-primary/20 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl transition-elegant touch-manipulation ${
                        errors.tipo_estabelecimento ? 'border-red-500 focus:border-red-500' : 
                        formData.tipo_estabelecimento ? 'border-green-500' : ''
                      }`}
                      aria-label="Tipo de estabelecimento onde atua"
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
                      <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.tipo_estabelecimento && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{errors.tipo_estabelecimento}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="premium"
                  size="lg"
                  disabled={isLoading || !formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim() || !formData.tipo_estabelecimento.trim()}
                  className="w-full rounded-xl disabled:opacity-50 disabled:cursor-not-allowed touch-target focus-visible-enhanced"
                  aria-label="Enviar solicitação de acesso ao NIVELA"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin"></div>
                      <span>Validando informações...</span>
                    </div>
                  ) : (
                    "ENVIAR SOLICITAÇÃO"
                  )}
                </Button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="pt-4 text-center">
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                🔒 Seus dados estão protegidos e serão usados apenas para análise de elegibilidade profissional.
              </p>
            </div>
          </LoadingState>
        )}
      </DialogContent>
    </Dialog>
  );
});

AccessFormModal.displayName = 'AccessFormModal';

export default AccessFormModal;