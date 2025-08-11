import { cn } from "@/lib/utils";

interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

export const SkipToContent = ({ 
  targetId = "main-content", 
  className 
}: SkipToContentProps) => {
  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleSkip}
      className={cn(
        // Initially hidden, visible on focus
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-50",
        "bg-primary text-primary-foreground",
        "px-4 py-3 rounded-lg",
        "font-medium text-sm",
        "shadow-lg border border-primary/20",
        "transition-all duration-200",
        "focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "hover:bg-primary/90",
        className
      )}
    >
      Pular para o conteúdo principal
    </a>
  );
};