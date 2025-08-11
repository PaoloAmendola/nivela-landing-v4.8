import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Gauge, Volume2, Palette } from "lucide-react";

interface MotionPreferences {
  reduceMotion: boolean;
  reduceFocus: boolean;
  reduceTransparency: boolean;
  highContrast: boolean;
}

/**
 * Granular motion and accessibility controls
 * Provides more control than just "reduce motion"
 */
export function ReducedMotionControls() {
  const [preferences, setPreferences] = useState<MotionPreferences>({
    reduceMotion: false,
    reduceFocus: false,
    reduceTransparency: false,
    highContrast: false,
  });

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('accessibility-preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        // Accessibility preferences error handled silently
      }
    }
  }, []);

  // Apply preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties based on preferences
    root.style.setProperty('--motion-reduce', preferences.reduceMotion ? '1' : '0');
    root.style.setProperty('--focus-reduce', preferences.reduceFocus ? '1' : '0');
    root.style.setProperty('--transparency-reduce', preferences.reduceTransparency ? '1' : '0');
    root.style.setProperty('--contrast-high', preferences.highContrast ? '1' : '0');

    // Apply classes to document
    root.classList.toggle('reduce-motion', preferences.reduceMotion);
    root.classList.toggle('reduce-focus', preferences.reduceFocus);
    root.classList.toggle('reduce-transparency', preferences.reduceTransparency);
    root.classList.toggle('high-contrast', preferences.highContrast);

    // Save to localStorage
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key: keyof MotionPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preferências de Acessibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="reduce-motion" className="text-sm font-medium">
                Reduzir Animações
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimiza animações e transições
            </p>
          </div>
          <Switch
            id="reduce-motion"
            checked={preferences.reduceMotion}
            onCheckedChange={(checked) => updatePreference('reduceMotion', checked)}
          />
        </div>

        {/* Reduce Focus Animations */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="reduce-focus" className="text-sm font-medium">
                Foco Simplificado
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Remove animações de foco complexas
            </p>
          </div>
          <Switch
            id="reduce-focus"
            checked={preferences.reduceFocus}
            onCheckedChange={(checked) => updatePreference('reduceFocus', checked)}
          />
        </div>

        {/* Reduce Transparency */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="reduce-transparency" className="text-sm font-medium">
                Reduzir Transparência
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Melhora legibilidade com fundos sólidos
            </p>
          </div>
          <Switch
            id="reduce-transparency"
            checked={preferences.reduceTransparency}
            onCheckedChange={(checked) => updatePreference('reduceTransparency', checked)}
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="high-contrast" className="text-sm font-medium">
                Alto Contraste
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Aumenta contraste para melhor visibilidade
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={preferences.highContrast}
            onCheckedChange={(checked) => updatePreference('highContrast', checked)}
          />
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <button
            onClick={() => setPreferences({
              reduceMotion: false,
              reduceFocus: false,
              reduceTransparency: false,
              highContrast: false,
            })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Restaurar Padrões
          </button>
        </div>
      </CardContent>
    </Card>
  );
}