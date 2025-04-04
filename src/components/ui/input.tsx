import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean // For styling the input border
  errorMessage?: string // For displaying the error text
  label?: string
  ref?: React.Ref<HTMLInputElement>; // Add ref prop
}

function Input({
  className,
  type,
  error,
  errorMessage,
  label,
  variant,
  ref, // Destructure ref
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
          <Label className="block text-sm font-medium text-foreground">
            {label}
          </Label>
        )}
      <input
        type={type}
        data-slot="input"
        ref={ref} // Apply ref directly
          className={cn(
            inputVariants({ variant, className }),
            error && "border-destructive focus-visible:border-destructive"
          )}
          {...props}
        />
        {/* Display errorMessage if provided */}
        {errorMessage && (
          <p className="text-sm text-destructive mt-1">{errorMessage}</p>
        )}
    </div>
  );
}
Input.displayName = "Input";

export { Input, inputVariants };
