import * as React from "react"
import { cn } from "@/lib/utils"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  direction?: "top" | "right" | "bottom" | "left"
}

const Drawer = ({ isOpen, onClose, children, className, direction = "bottom" }: DrawerProps) => {
  let containerClasses = ""
  let transformOpen = ""
  let transformClosed = ""

  // Configure the classes based on the direction prop
  if (direction === "right") {
    containerClasses = "fixed top-0 bottom-0 right-0 z-40 transform overflow-hidden border-l-2 border-border bg-background shadow-2xl transition-all duration-300 ease-in-out w-80"
    transformOpen = "translate-x-0"
    transformClosed = "translate-x-full"
  } else if (direction === "left") {
    containerClasses = "fixed top-0 bottom-0 left-0 z-40 transform overflow-hidden border-r-2 border-border bg-background shadow-2xl transition-all duration-300 ease-in-out w-80"
    transformOpen = "translate-x-0"
    transformClosed = "-translate-x-full"
  } else if (direction === "top") {
    containerClasses = "fixed top-0 left-0 right-0 z-40 transform overflow-hidden rounded-b-3xl border-b-2 border-border bg-background shadow-2xl transition-all duration-300 ease-in-out"
    transformOpen = "translate-y-0"
    transformClosed = "-translate-y-full"
  } else {
    // bottom is default
    containerClasses = "fixed bottom-0 left-0 right-0 z-40 transform overflow-hidden rounded-t-3xl border-t-2 border-border bg-background shadow-2xl transition-all duration-300 ease-in-out"
    transformOpen = "translate-y-0"
    transformClosed = "translate-y-full"
  }
  return (
    <>
      <div
        className={cn(
          containerClasses,
          isOpen ? transformOpen : transformClosed,
          className
        )}
      >
        {children}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  )
}

export { Drawer }
