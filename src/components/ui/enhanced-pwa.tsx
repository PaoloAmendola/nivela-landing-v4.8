import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/utils/logger';

interface PWAInstallPromptProps {
  showPrompt?: boolean;
  autoPrompt?: boolean;
  deferredDays?: number;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Enhanced PWA Install Prompt with smart prompting strategy
 */
const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  showPrompt = true,
  autoPrompt = true,
  deferredDays = 7
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installMethod, setInstallMethod] = useState<'browser' | 'manual' | null>(null);

  // Check if app is already installed
  const checkIfInstalled = useCallback(() => {
    // Check for standalone mode (PWA installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return true;
    }
    
    // Check for iOS Safari standalone
    if ((navigator as any).standalone === true) {
      setIsInstalled(true);
      return true;
    }
    
    return false;
  }, []);

  // Check if user has deferred installation recently
  const checkDeferredStatus = useCallback(() => {
    const lastDeferred = localStorage.getItem('pwa-install-deferred');
    if (lastDeferred) {
      const deferredDate = new Date(lastDeferred);
      const daysSinceDeferred = (Date.now() - deferredDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceDeferred < deferredDays;
    }
    return false;
  }, [deferredDays]);

  // Smart prompting strategy
  const shouldShowPrompt = useCallback(() => {
    if (!showPrompt || isInstalled || checkDeferredStatus()) {
      return false;
    }

    // Show prompt based on user engagement
    const pageViews = parseInt(localStorage.getItem('pwa-page-views') || '0');
    const timeSpent = parseInt(localStorage.getItem('pwa-time-spent') || '0');
    
    // Show after 3 page views or 2 minutes of engagement
    return pageViews >= 3 || timeSpent >= 120000;
  }, [showPrompt, isInstalled, checkDeferredStatus]);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setInstallMethod('browser');
      
      if (autoPrompt && shouldShowPrompt()) {
        setTimeout(() => setShowInstallPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [autoPrompt, shouldShowPrompt]);

  // Track page views and time spent
  useEffect(() => {
    // Track page view
    const pageViews = parseInt(localStorage.getItem('pwa-page-views') || '0');
    localStorage.setItem('pwa-page-views', (pageViews + 1).toString());

    // Track time spent
    const startTime = Date.now();
    const updateTimeSpent = () => {
      const currentTime = parseInt(localStorage.getItem('pwa-time-spent') || '0');
      const sessionTime = Date.now() - startTime;
      localStorage.setItem('pwa-time-spent', (currentTime + sessionTime).toString());
    };

    window.addEventListener('beforeunload', updateTimeSpent);
    const interval = setInterval(updateTimeSpent, 30000); // Update every 30 seconds

    return () => {
      window.removeEventListener('beforeunload', updateTimeSpent);
      clearInterval(interval);
      updateTimeSpent();
    };
  }, []);

  // Check installation status on mount
  useEffect(() => {
    checkIfInstalled();
    
    // For browsers that don't support beforeinstallprompt
    if (!deferredPrompt && !isInstalled) {
      setInstallMethod('manual');
    }
  }, [checkIfInstalled, deferredPrompt, isInstalled]);

  // Handle install click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      logger.info('PWA install prompt result', { outcome });
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      } else {
        handleDefer();
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      logger.error('PWA install failed', { error });
    }
  };

  // Handle defer
  const handleDefer = () => {
    localStorage.setItem('pwa-install-deferred', new Date().toISOString());
    setShowInstallPrompt(false);
  };

  // Handle dismiss
  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallPrompt(false);
  };

  // Manual installation instructions
  const getManualInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);

    if (isIOS && isSafari) {
      return {
        title: 'Instalar no iOS Safari',
        steps: [
          'Toque no ícone de compartilhar',
          'Role para baixo e toque em "Adicionar à Tela de Início"',
          'Toque em "Adicionar" para confirmar'
        ]
      };
    }

    if (isAndroid && isChrome) {
      return {
        title: 'Instalar no Android Chrome',
        steps: [
          'Toque no menu (três pontos) no canto superior direito',
          'Selecione "Adicionar à tela inicial"',
          'Toque em "Adicionar" para confirmar'
        ]
      };
    }

    return {
      title: 'Instalar PWA',
      steps: [
        'Abra o menu do seu navegador',
        'Procure por "Instalar app" ou "Adicionar à tela inicial"',
        'Siga as instruções do seu navegador'
      ]
    };
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  const instructions = getManualInstructions();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Instalar NIVELA®</CardTitle>
            <Badge variant="secondary">PWA</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Instale nosso app para uma experiência mais rápida e acesso offline.
          </p>

          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                ⚡
              </div>
              <p>Carregamento instantâneo</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                📱
              </div>
              <p>Acesso offline</p>
            </div>
          </div>

          {installMethod === 'browser' && deferredPrompt ? (
            <div className="space-y-3">
              <Button onClick={handleInstallClick} className="w-full">
                Instalar Agora
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDefer} className="flex-1">
                  Mais Tarde
                </Button>
                <Button variant="ghost" onClick={handleDismiss} className="flex-1">
                  Não Mostrar
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="install" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="install">Como Instalar</TabsTrigger>
                <TabsTrigger value="benefits">Benefícios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="install" className="space-y-3">
                <h4 className="font-semibold text-sm">{instructions.title}</h4>
                <ol className="text-sm space-y-1">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <Button variant="outline" onClick={handleDismiss} className="w-full">
                  Entendi
                </Button>
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-3">
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Carregamento 3x mais rápido
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Funciona sem internet
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Notificações push
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Ícone na tela inicial
                  </li>
                </ul>
                <Button variant="outline" onClick={handleDefer} className="w-full">
                  Perguntar Depois
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Enhanced PWA Features Hook
 */
const usePWAFeatures = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    // Installation status
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstalled();
    window.addEventListener('appinstalled', checkInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  const refreshApp = useCallback(() => {
    if (updateAvailable) {
      window.location.reload();
    }
  }, [updateAvailable]);

  return {
    isOnline,
    isInstalled,
    updateAvailable,
    refreshApp
  };
};

export { PWAInstallPrompt, usePWAFeatures };