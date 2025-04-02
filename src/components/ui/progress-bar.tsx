// components/ui/progress-bar.tsx
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  label: string
  statusText: string
  className?: string
}

export const ProgressBar = ({
  currentStep,
  totalSteps,
  label,
  statusText,
  className
}: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className={cn("space-y-2", className)}>
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