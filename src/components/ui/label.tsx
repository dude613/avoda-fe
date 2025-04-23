//src/components/ui/label.tsx
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
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

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

type LabelRef = React.ComponentRef<typeof LabelPrimitive.Root>;

const Label = React.forwardRef<LabelRef, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <LabelPrimitive.Root
        ref={ref}
        data-slot="label"
        className={cn(labelVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label, labelVariants };