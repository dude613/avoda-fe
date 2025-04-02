import * as React from "react"
import { cn } from "@/lib/utils"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const Drawer = ({ isOpen, onClose, children, className }: DrawerProps) => {
  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 transform overflow-hidden rounded-t-3xl border-t-2 border-border bg-background shadow-2xl transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full",
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