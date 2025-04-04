import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressBarVariants = cva(
  "space-y-2",
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

interface ProgressBarProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  currentStep: number
  totalSteps: number
  label: string
  statusText: string
}

export const ProgressBar = ({
  currentStep,
  totalSteps,
  label,
  statusText,
  className,
  variant,
}: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className={cn(progressBarVariants({ variant, className }))}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{statusText}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export { progressBarVariants }