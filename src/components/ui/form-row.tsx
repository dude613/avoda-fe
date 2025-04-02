import { cn } from "@/lib/utils"

export const FormRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex gap-4 w-full", className)} {...props} />
)
