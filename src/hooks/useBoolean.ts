"use client"

import { useState, useCallback } from "react"

export function useBoolean(initialState = false): [boolean, (value: boolean) => void, () => void] {
  const [state, setState] = useState(initialState)
  
  const toggle = useCallback(() => setState(prev => !prev), [])
  
  return [state, setState, toggle]
}
