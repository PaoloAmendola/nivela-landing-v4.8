import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  childAnimation?: "fade" | "slide-up" | "scale";
}

const childVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  "slide-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }
};

const StaggerContainer = ({ 
  children, 
  className,
  staggerDelay = 0.1,
  childAnimation = "slide-up"
}: StaggerContainerProps) => {
  const { ref, isInView } = useScrollAnimation();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(className)}
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={childVariants[childAnimation]}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {child}
            </motion.div>
          ))
        : <motion.div
            variants={childVariants[childAnimation]}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
      }
    </motion.div>
  );
};

export { StaggerContainer };