import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 p-0"
        aria-label="Carregando alternar tema"
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Carregando tema</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 p-0 hover:bg-brand-deep/20 transition-colors"
      aria-label={`Alternar para tema ${theme === "dark" ? "claro" : "escuro"}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-brand-latte" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-brand-deep" aria-hidden="true" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}