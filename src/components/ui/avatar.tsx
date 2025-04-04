import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full border-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-white/30",
        outline: "border-border"
      },
      size: {
        default: "h-9 w-9",
        sm: "h-7 w-7",
        lg: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, // Change to HTMLDivElement as the outer element is a div
    VariantProps<typeof avatarVariants> {
  src?: string; // Make src optional as it's handled conditionally
  alt?: string; // Make alt optional
  fallback?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>; // Separate props for the img element
  ref?: React.Ref<HTMLDivElement>; // Ref for the outer div
}

function Avatar({
  className,
  variant,
  size,
  src,
  alt,
  fallback,
  imgProps, // Destructure imgProps
  ref, // Destructure ref
  ...props // Remaining props apply to the outer div
}: AvatarProps) {
  const [error, setError] = React.useState(false);

  // Use effect to reset error state if src changes
  React.useEffect(() => {
    if (src) {
      setError(false);
    }
  }, [src]);

  return (
    <div
      ref={ref} // Apply ref to the outer div
      className={cn(avatarVariants({ variant, size, className }))}
      {...props} // Spread remaining props here
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
          {...imgProps} // Spread imgProps to the img element
        />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent font-medium text-accent-foreground">
            {fallback?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
}
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
