import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cta-primary text-primary-foreground hover:bg-cta-primary/80 shadow-lg",
        secondary:
          "border-transparent bg-cta-secondary text-secondary-foreground hover:bg-cta-secondary/80 shadow-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-current",
        premium: "border-transparent bg-badge-premium text-white hover:bg-badge-premium/90 shadow-lg",
        tech: "border-transparent bg-badge-tech text-white hover:bg-badge-tech/90 shadow-md",
        success: "border-transparent bg-badge-success text-white hover:bg-badge-success/90 shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
