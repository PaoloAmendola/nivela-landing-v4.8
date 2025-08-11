import { createContext, useContext, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface AnimationContextType {
  prefersReducedMotion: boolean;
  getAnimationDuration: (baseMs: number) => number;
  shouldAnimate: (type: 'scroll' | 'hover' | 'focus' | 'transition') => boolean;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
  const prefersReducedMotion = useReducedMotion();

  const getAnimationDuration = (baseMs: number): number => {
    return prefersReducedMotion ? Math.min(baseMs * 0.1, 50) : baseMs;
  };

  const shouldAnimate = (type: 'scroll' | 'hover' | 'focus' | 'transition'): boolean => {
    if (prefersReducedMotion) {
      // Allow only essential animations for accessibility
      return type === 'focus';
    }
    return true;
  };

  const value: AnimationContextType = {
    prefersReducedMotion,
    getAnimationDuration,
    shouldAnimate
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};