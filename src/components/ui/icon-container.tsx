import { cn } from "@/lib/utils"

export const IconContainer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-accent rounded-full w-12 h-12 flex items-center justify-center",
      className
    )}
    {...props}
  />
)