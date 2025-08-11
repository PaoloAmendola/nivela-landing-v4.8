import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  urgency?: boolean;
  openModal?: () => void;
}

/**
 * Unified CTA Button Component
 * Implements strategic button hierarchy for optimal conversion
 */
const CTAButton = memo(({
  variant,
  children,
  onClick,
  href,
  className,
  size = 'md',
  fullWidth = false,
  urgency = false,
  openModal
}: CTAButtonProps) => {
  
  const handleClick = (e: React.MouseEvent) => {
    // Track CTA click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: variant || 'default',
        button_text: typeof children === 'string' ? children : 'CTA Button'
      });
    }

    // GTM tracking
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'cta_click',
        cta_variant: variant,
        cta_urgency: urgency,
        cta_text: typeof children === 'string' ? children : 'CTA Button'
      });
    }

    // PRIORITY 1: Modal opener handler (for hero CTA)
    if (openModal) {
      e.preventDefault();
      openModal();
      return;
    }

    // PRIORITY 2: Custom onClick handler
    if (onClick) {
      e.preventDefault();
      onClick(e);
      return;
    }

    // Check if this is an official store link
    if (href && href.includes('bembeauty.com.br')) {
      // Track official store conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cta_acessar_loja', {
          event_category: 'conversion',
          event_label: 'acesso_loja_oficial',
          value: 1
        });
      }

      // GTM tracking for official store
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'cta_acessar_loja',
          conversion_type: 'loja_oficial_access',
          product: 'NIVELA',
          utm_source: 'landing',
          utm_medium: 'botao',
          utm_campaign: 'acesso_loja'
        });
      }
      
      // Don't prevent default for external links
      return;
    }

    // Default behavior - scroll to access form
    e.preventDefault();
    const formSection = document.getElementById('acesso');
    
    if (formSection) {
      formSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: try to find any form or contact section
      const alternateSelectors = ['form', '[id*="form"]', '[id*="contato"]', '[id*="acesso"]'];
      for (const selector of alternateSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }
      }
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return urgency 
          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl border-red-600 pulse"
          : "bg-gradient-to-r from-brand-caramel to-brand-caramel/90 hover:from-brand-caramel/90 hover:to-brand-caramel text-brand-light shadow-lg hover:shadow-xl border-brand-caramel";
      
      case 'secondary':
        return "bg-transparent border-2 border-brand-latte text-brand-latte hover:bg-brand-latte/10 hover:scale-105 backdrop-blur-sm";
      
      case 'tertiary':
        return "bg-transparent text-brand-cloud hover:text-brand-latte underline decoration-2 underline-offset-4 hover:decoration-brand-latte";
      
      default:
        return "";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return "px-4 py-2 text-sm";
      case 'lg':
        return "px-8 py-4 text-lg lg:px-10 lg:py-5 lg:text-xl";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const baseStyles = cn(
    "font-montserrat font-semibold rounded-xl transition-all duration-300 touch-target",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-latte focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-95 hover:shadow-lg",
    getVariantStyles(),
    getSizeStyles(),
    fullWidth && "w-full justify-center",
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseStyles}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={baseStyles}
    >
      {children}
    </button>
  );
});

CTAButton.displayName = 'CTAButton';

/**
 * Strategic CTA placements with proper hierarchy
 */
const CTAStrategies = {
  // Hero section - Primary CTA
  hero: {
    variant: 'primary' as const,
    text: 'SOLICITAR ACESSO EXCLUSIVO',
    size: 'lg' as const,
    urgency: false
  },
  
  // Mid-content - Secondary CTA
  sections: {
    variant: 'secondary' as const,
    text: 'Saiba Mais',
    size: 'md' as const,
    urgency: false
  },
  
  // Before form - Reinforcement
  preForm: {
    variant: 'primary' as const,
    text: 'Garante Seu Acesso',
    size: 'lg' as const,
    urgency: false
  },
  
  // Footer/Final - Urgency
  final: {
    variant: 'primary' as const,
    text: 'Últimas Vagas - Acessar Agora',
    size: 'lg' as const,
    urgency: true
  },
  
  // Tertiary links
  learn: {
    variant: 'tertiary' as const,
    text: 'Descubra como funciona',
    size: 'sm' as const,
    urgency: false
  },
  
  // Nuvemshop CTA
  nuvemshop: {
    variant: 'primary' as const,
    text: 'ACESSAR LOJA OFICIAL',
    size: 'lg' as const,
    urgency: true
  },
  
  // Official Store CTA with tracking
  official: {
    variant: 'primary' as const,
    text: 'ACESSAR LOJA OFICIAL',
    size: 'lg' as const,
    urgency: false,
    href: 'https://bembeauty.com.br?utm_source=landing&utm_medium=botao&utm_campaign=acesso_loja'
  }
} as const;

export { CTAButton, CTAStrategies };