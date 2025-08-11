import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  speed?: "slow" | "medium" | "fast";
}

const speedMap = {
  slow: 0.3,
  medium: 0.5,
  fast: 0.8
};

const ParallaxContainer = ({ 
  children, 
  className,
  offset = 100,
  speed = "medium"
}: ParallaxContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [-offset * speedMap[speed], offset * speedMap[speed]]
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div 
        style={{ y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

export { ParallaxContainer };