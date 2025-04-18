import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const selectVariants = cva(
    "border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
    {
      variants: {
        variant: {
          default: "border-gray-300 focus:border-primary",
          error: "border-destructive",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  )

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  error?: boolean
  ref?: React.Ref<HTMLSelectElement>; // Add ref prop
}

function Select({
  className,
  error,
  variant,
  ref, // Destructure ref
  ...props
}: SelectProps) {
  return (
    <select
      ref={ref} // Apply ref directly
      className={cn(
        selectVariants({ variant: error ? "error" : variant }),
        className
      )}
      {...props}
    />
  );
}
Select.displayName = "Select";

export { Select, selectVariants }; // Export Select component as well
