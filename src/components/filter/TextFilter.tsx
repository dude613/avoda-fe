"use client"

import { Input } from "@/components/ui/input"
import type { ReactNode } from "react"

interface TextFilterProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  icon?: ReactNode
}

export function TextFilter({ value, onChange, label, placeholder = "Filter...", className, icon }: TextFilterProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-2.5 top-2.5 text-muted-foreground">{icon}</div>}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={icon ? "pl-8" : ""}
        />
      </div>
    </div>
  )
}
