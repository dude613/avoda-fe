import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

interface NavigationLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  variant?: "link" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  underline?: boolean
}

const NavigationLink = ({
  className,
  variant = "link",
  size = "sm",
  underline = false,
  ...props
}: NavigationLinkProps) => (
  <Link
    className={cn(
      buttonVariants({
        variant,
        size,
        className: cn(
          "hover:text-primary/90",
          underline && "hover:underline underline-offset-4",
          className
        )
      })
    )}
    {...props}
  />
)

export { NavigationLink }