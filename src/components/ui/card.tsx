import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground w-full",
  {
    variants: {
      variant: {
        default: "border-border shadow-sm",
        elevated: "border-border shadow-lg"
      },
      size: {
        sm: "max-w-[95vw] sm:max-w-sm p-4 sm:p-6",  // Added mobile-first constraints
        md: "max-w-[95vw] sm:max-w-md p-4 sm:p-6",
        lg: "max-w-[95vw] sm:max-w-xl p-6 sm:p-8"
      },
      layout: {
        default: "",
        centered: "mx-auto",
        spaced: "space-y-4",
        centeredAndSpaced: "mx-auto space-y-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      layout: "default"
    }
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  ref?: React.Ref<HTMLDivElement>; // Add ref prop
}

function Card({
  className,
  variant,
  size,
  layout,
  ref, // Destructure ref
  ...props
}: CardProps) {
  return (
    <div
      ref={ref} // Apply ref directly
        className={cn(cardVariants({ variant, size, layout, className }))}
        {...props}
      />
    );
}
Card.displayName = "Card";

export { Card, cardVariants };
