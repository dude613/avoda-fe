import { cn } from "@/lib/utils"
import { Controller } from "react-hook-form"

interface CardSelectOption {
    value: string
    label: string
    icon: (isSelected: boolean) => React.ReactNode
    description: string
    bgColor?: string
  }

interface CardSelectProps {
  name: string
  control: any
  options: CardSelectOption[]
  rules?: Record<string, any>
  className?: string
}

export const CardSelect = ({
    name,
    control,
    options,
    rules,
    className
  }: CardSelectProps) => (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-2", className)}>
          {options.map((option) => {
            const isSelected = field.value === option.value
            return (
              <label
                key={option.value}
                className={cn(
                  "box-border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all border-[1px]",
                  isSelected 
                    ? "border-textPrimary bg-blue-50"
                    : `border-transparent ${option.bgColor || "bg-background"}`,
                  "hover:bg-blue-50"
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => field.onChange(option.value)}
                  className="hidden"
                />
                <div className="mb-2">
                  {option.icon(isSelected)}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {option.description}
                </span>
              </label>
            )
          })}
        </div>
      )}
    />
  )