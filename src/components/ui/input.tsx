//src/components/ui/input.tsx
import * as React from "react";
import { useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "./label";

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
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  labelAnimation?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, error, errorMessage, label, labelAnimation, variant, ...props },
    ref
  ) => {
    const id = useId();

    if (labelAnimation && label) {
      return (
        <div className="group relative">
          <label
            htmlFor={id}
            className={cn(
              "origin-start text-muted-foreground/70 group-focus-within:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium",
              error && "text-destructive"
            )}
          >
            <span className="bg-background inline-flex px-2">{label}</span>
          </label>
          <input
            id={id}
            type={type}
            placeholder=" "
            data-slot="input"
            ref={ref}
            className={cn(
              inputVariants({ variant, className }),
              error && "border-destructive focus-visible:border-destructive"
            )}
            {...props}
          />
          {errorMessage && (
            <p className="text-sm text-destructive mt-1">{errorMessage}</p>
          )}
        </div>
      );
    }

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
        {errorMessage && (
          <p className="text-sm text-destructive mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
