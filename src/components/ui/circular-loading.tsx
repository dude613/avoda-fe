import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("border-t-foreground border-r-foreground rounded-full animate-spin", {
  variants: {
    variant: {
      default: "border-t-foreground border-r-foreground",
      primary: "border-t-primary border-r-primary",
      destructive: "border-t-destructive border-r-destructive"
    },
    size: {
      sm: "w-3 h-3 border-1",
      md: "w-4 h-4 border-2",
      lg: "w-6 h-6 border-3"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
})

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spinnerVariants> { }

const CircularLoading = ({ variant, size, className }: SpinnerProps) => (
  <div className="flex items-center justify-center h-full">
    <div className={cn(spinnerVariants({ variant, size, className }))} />
  </div>
)

export { CircularLoading, spinnerVariants }