import React, { memo, useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAnalytics } from '@/hooks/use-analytics';

interface MicroInteractionProps {
  children: ReactNode;
  type?: 'hover-lift' | 'scale' | 'glow' | 'magnetic' | 'ripple';
  className?: string;
  disabled?: boolean;
  trackEvent?: boolean;
  eventName?: string;
}

const MicroInteraction = memo(({ 
  children, 
  type = 'hover-lift', 
  className = "", 
  disabled = false,
  trackEvent = false,
  eventName
}: MicroInteractionProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { trackInteraction } = useAnalytics();

  useEffect(() => {
    if (disabled || type !== 'magnetic') return;

    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = Math.min(rect.width, rect.height) / 2;
      
      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = x * strength * 0.3;
        const moveY = y * strength * 0.3;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      } else {
        element.style.transform = 'translate(0px, 0px) scale(1)';
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px) scale(1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, type]);

  const handleInteraction = (action: string) => {
    if (trackEvent && eventName) {
      trackInteraction(eventName, action);
    }
  };

  const getInteractionClasses = () => {
    if (disabled) return '';
    
    switch (type) {
      case 'hover-lift':
        return 'transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg gpu-accelerated';
      case 'scale':
        return 'transition-transform duration-200 hover:scale-105 active:scale-95 gpu-accelerated';
      case 'glow':
        return 'transition-all duration-300 hover:shadow-glow hover:shadow-accent/20 gpu-accelerated';
      case 'magnetic':
        return 'transition-all duration-300 ease-out gpu-accelerated';
      case 'ripple':
        return 'relative overflow-hidden transition-all duration-300 hover:scale-[1.02] gpu-accelerated';
      default:
        return '';
    }
  };

  const rippleEffect = (e: React.MouseEvent) => {
    if (type !== 'ripple' || disabled) return;

    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, hsl(var(--accent) / 0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      animation: ripple-animation 0.6s ease-out;
      z-index: 0;
    `;

    // Inject animation if not already present
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-animation {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);

    handleInteraction('ripple_click');
  };

  return (
    <div
      ref={elementRef}
      className={cn(getInteractionClasses(), className)}
      onClick={type === 'ripple' ? rippleEffect : undefined}
      onMouseEnter={() => handleInteraction('hover')}
      onMouseLeave={() => handleInteraction('leave')}
      onFocus={() => handleInteraction('focus')}
      style={{
        transition: type === 'magnetic' ? 'transform 0.3s ease-out' : undefined
      }}
    >
      {children}
    </div>
  );
});

MicroInteraction.displayName = 'MicroInteraction';

export { MicroInteraction };