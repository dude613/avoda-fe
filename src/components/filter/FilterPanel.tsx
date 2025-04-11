"use client"

import type React from "react"

import { useState } from "react"
import { FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FilterPanelProps {
  children: React.ReactNode
  title?: string
  onApply: () => void
  onClear: () => void
  hasActiveFilters?: boolean
  className?: string
}

export function FilterPanel({
  children,
  title = "Filter",
  onApply,
  onClear,
  hasActiveFilters = false,
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FilterIcon className="w-4 h-4" />
          {title}
          {hasActiveFilters && <span className="w-2 h-2 ml-1 rounded-full bg-primary"></span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-80 p-4 ${className}`}>
        <div className="space-y-4">
          <h4 className="text-lg font-medium">{title}</h4>

          {children}

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => {
                onApply()
                setIsOpen(false)
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClear()
                setIsOpen(false)
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
