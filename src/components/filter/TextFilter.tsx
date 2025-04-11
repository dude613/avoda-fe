"use client"

import { Input } from "@/components/ui/input"

interface TextFilterProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function TextFilter({ value, onChange, label, placeholder = "Filter...", className }: TextFilterProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}
