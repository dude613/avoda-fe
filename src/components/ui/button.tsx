//src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariantConfig = {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      invite: "bg-invite text-invite-foreground shadow-sm hover:bg-invite/90 focus-visible:ring-invite/20 dark:focus-visible:ring-invite/40",
      social: "border border-input bg-background hover:bg-accent justify-start",
      create: "bg-primary text-white font-bold shadow-sm hover:bg-gray-900 hover:scale-105 transition-transform",
      tab: "bg-gray-100 text-gray-500 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:font-medium data-[state=active]:shadow-md",
      ghostOutline: "border border-input bg-transparent hover:bg-accent",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
} as const

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-full cursor-pointer transition",
  buttonVariantConfig
)

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText = "",
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "cursor-wait"
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </div>
        ) : (
          <>
            {icon && <span className="[&>svg]:size-4">{icon}</span>}
            {children}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants, buttonVariantConfig }