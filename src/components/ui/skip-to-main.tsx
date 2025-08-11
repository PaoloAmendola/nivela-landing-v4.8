import { cn } from "@/lib/utils";

interface SkipToMainProps {
  targetId?: string;
  className?: string;
}

export const SkipToMain = ({ 
  targetId = "main-content", 
  className 
}: SkipToMainProps) => {
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
        // Initially hidden, visible on focus - enhanced for better visibility
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-[9999]",
        "bg-white text-gray-900 border border-gray-300",
        "px-6 py-4 rounded-lg",
        "font-bold text-base",
        "shadow-2xl",
        "transition-all duration-200",
        "focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2",
        "hover:bg-gray-50",
        "min-h-[56px] min-w-[200px]",
        "flex items-center justify-center",
        "touch-manipulation",
        className
      )}
      tabIndex={0}
    >
      Pular para o conteúdo principal
    </a>
  );
};