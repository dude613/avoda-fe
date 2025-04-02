import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full border-2 shadow-sm",
  {
    variants: {
      size: {
        default: "h-9 w-9",
        sm: "h-7 w-7",
        lg: "h-11 w-11"
      },
      variant: {
        default: "border-white/30",
        outline: "border-border"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  fallback?: string
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size, variant, src, alt, fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false)
    
    return (
      <div className={avatarVariants({ size, className })}>
        {src && !error ? (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setError(true)}
            {...props}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent font-medium text-accent-foreground">
            {fallback?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }