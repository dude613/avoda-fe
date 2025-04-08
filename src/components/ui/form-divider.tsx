import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const formDividerVariants = cva("flex items-center border-border", {
  variants: {
    variant: {
      default: "[&>span]:text-primary [&>hr]:border-border",
      destructive: "[&>span]:text-destructive [&>hr]:border-destructive",
      muted: "[&>span]:text-muted-foreground [&>hr]:border-muted"
    },
    size: {
      sm: "my-3 [&>span]:text-xs [&>span]:mx-2",
      md: "my-4 [&>span]:text-sm [&>span]:mx-3",
      lg: "my-6 [&>span]:text-base [&>span]:mx-4"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
})

interface FormDividerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formDividerVariants> {
  text: string
}

const FormDivider = ({ 
  text, 
  variant, 
  size, 
  className 
}: FormDividerProps) => (
  <div className={cn(formDividerVariants({ variant, size, className }))}>
    <hr className="flex-grow border" />
    <span className="shrink-0">{text}</span>
    <hr className="flex-grow border" />
  </div>
)

export { FormDivider, formDividerVariants }