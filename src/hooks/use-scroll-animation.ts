import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options.threshold || 0.1,
    once: options.triggerOnce !== false
  });

  return { ref, isInView };
};

export const useParallax = (offset: number = 50) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const transform = `translateY(${scrollY * offset * 0.01}px)`;
  
  return { ref, transform };
};