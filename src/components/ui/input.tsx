import * as React from "react"; // Keep React import
import { useId } from "react"; // Import useId
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "./label";

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring",
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
  error?: boolean; // For styling the input border
  errorMessage?: string; // For displaying the error text
  label?: string;
  labelAnimation?: boolean; // Add labelAnimation prop
  ref?: React.Ref<HTMLInputElement>; // Add ref prop
}

function Input({
  className,
  type,
  error,
  errorMessage,
  label,
  labelAnimation, // Destructure labelAnimation
  variant,
  ref, // Destructure ref
  ...props
}: InputProps) {
  const id = useId(); // Generate unique ID

  if (labelAnimation && label) {
    // Render animated label structure
    return (
      <div className="group relative">
        <label
          htmlFor={id}
          className={cn(
            "origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium",
            error && "text-destructive" // Apply error color to label text if error
          )}
        >
          <span className="bg-background inline-flex px-2">{label}</span>
        </label>
        <input
          id={id}
          type={type}
          placeholder=" " // Required for :placeholder-shown selector
          data-slot="input"
          ref={ref}
          className={cn(
            inputVariants({ variant, className }),
            error && "border-destructive focus-visible:border-destructive"
          )}
          {...props}
        />
        {/* Display errorMessage below the input if provided */}
        {errorMessage && (
          <p className="text-sm text-destructive mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Render standard input structure
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={props.id || id} className="block text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <input
        id={props.id || id}
        type={type}
        data-slot="input"
        ref={ref}
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
