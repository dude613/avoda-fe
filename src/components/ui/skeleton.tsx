import * as React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-slate-700",
      className
    )}
    {...props}
    ref={ref}
  />
))
Skeleton.displayName = "Skeleton"
