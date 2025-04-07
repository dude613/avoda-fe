import { cn } from "@/lib/utils";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface CardSelectOption {
  value: string;
  label: string;
  icon: (isSelected: boolean) => React.ReactNode;
  description: string;
  bgColor?: string;
}

interface CardSelectProps<T extends FieldValues = FieldValues> {
  name:  Path<T>;
  control: Control<T>;
  options: CardSelectOption[];
  rules?: Omit<RegisterOptions<T, Path<T>>, "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate">;
  className?: string;
}

export const CardSelect = <T extends FieldValues>({
  name,
  control,
  options,
  rules,
  className,
}: CardSelectProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field }) => (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-2", className)}>
        {options.map((option) => {
          const isSelected = field.value === option.value;
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
              <div className="mb-2">{option.icon(isSelected)}</div>
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground text-center">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    )}
  />
);
