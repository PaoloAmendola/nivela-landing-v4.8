import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavigationMenuSmoothProps {
  items: NavigationItem[];
  className?: string;
  variant?: "floating" | "inline";
}

const NavigationMenuSmooth = ({ 
  items, 
  className,
  variant = "floating" 
}: NavigationMenuSmoothProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={cn(
      "flex items-center space-x-2",
      variant === "floating" && "fixed top-1/2 right-6 -translate-y-1/2 z-50 flex-col space-x-0 space-y-2 bg-card/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border",
      className
    )}>
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size={variant === "floating" ? "icon" : "sm"}
          onClick={() => scrollToSection(item.id)}
          className={cn(
            "transition-all duration-300 hover:scale-105",
            variant === "floating" ? "w-10 h-10" : "px-4 py-2"
          )}
          title={item.label}
        >
          {item.icon && variant === "floating" ? (
            item.icon
          ) : (
            <span className="text-sm font-medium">{item.label}</span>
          )}
        </Button>
      ))}
    </nav>
  );
};

export { NavigationMenuSmooth };