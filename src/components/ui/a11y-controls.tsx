import React, { memo, useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

interface A11yControlsProps {
  className?: string;
}

const A11yControls = memo(({ className = "" }: A11yControlsProps) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    // Check user preferences
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setHighContrast(true);
    }
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
    logger.info('Acessibilidade: Contraste alto alternado', { enabled: !highContrast });
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle('reduce-motion', !reducedMotion);
    logger.info('Acessibilidade: Movimento reduzido alternado', { enabled: !reducedMotion });
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(75, Math.min(150, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    logger.info('Acessibilidade: Tamanho da fonte ajustado', { fontSize: newSize });
  };

  const resetSettings = () => {
    setHighContrast(false);
    setReducedMotion(false);
    setFontSize(100);
    document.documentElement.classList.remove('high-contrast', 'reduce-motion');
    document.documentElement.style.fontSize = '100%';
    logger.info('Acessibilidade: Configurações resetadas');
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <details className="group">
        <summary className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all focus-visible-enhanced list-none">
          <span className="sr-only">Controles de Acessibilidade</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </summary>
        
        <div className="absolute bottom-14 right-0 bg-card border border-border rounded-lg p-4 shadow-xl min-w-[280px] group-open:animate-scale-in">
          <h3 className="font-semibold text-card-foreground mb-3">Acessibilidade</h3>
          
          <div className="space-y-3">
            <button
              onClick={toggleHighContrast}
              className={`w-full p-2 rounded text-sm transition-colors focus-visible-enhanced ${
                highContrast ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              aria-pressed={highContrast}
            >
              Alto Contraste
            </button>
            
            <button
              onClick={toggleReducedMotion}
              className={`w-full p-2 rounded text-sm transition-colors focus-visible-enhanced ${
                reducedMotion ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              aria-pressed={reducedMotion}
            >
              Reduzir Movimento
            </button>
            
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Tamanho da Fonte: {fontSize}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => adjustFontSize(-10)}
                  className="flex-1 p-2 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80 focus-visible-enhanced"
                  disabled={fontSize <= 75}
                  aria-label="Diminuir tamanho da fonte"
                >
                  A-
                </button>
                <button
                  onClick={() => adjustFontSize(10)}
                  className="flex-1 p-2 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80 focus-visible-enhanced"
                  disabled={fontSize >= 150}
                  aria-label="Aumentar tamanho da fonte"
                >
                  A+
                </button>
              </div>
            </div>
            
            <button
              onClick={resetSettings}
              className="w-full p-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/80 focus-visible-enhanced"
            >
              Resetar
            </button>
          </div>
        </div>
      </details>
    </div>
  );
});

A11yControls.displayName = 'A11yControls';

export { A11yControls };