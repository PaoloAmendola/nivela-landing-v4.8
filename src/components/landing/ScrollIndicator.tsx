import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100));
    };

    const throttledUpdate = () => {
      requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    updateScrollProgress(); // Initial call
    
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  const scrollToNext = () => {
    const currentPosition = window.scrollY;
    const sections = Array.from(document.querySelectorAll('section'));
    
    // Find next section
    const nextSection = sections.find(section => 
      section.offsetTop > currentPosition + 100
    );
    
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-brand-deep/20 z-50">
        <div 
          className="h-full bg-gradient-accent transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

    </>
  );
};

export default ScrollIndicator;