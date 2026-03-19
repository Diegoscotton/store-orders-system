'use client'

import { useState, useEffect, useRef } from 'react'

interface FormState {
  [key: string]: any
}

export function useFormChanges(initialState: FormState) {
  const [hasChanges, setHasChanges] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const currentStateRef = useRef<FormState>(initialState)
  const initialStateRef = useRef<FormState>(initialState)

  useEffect(() => {
    currentStateRef.current = initialState
    initialStateRef.current = { ...initialState }
    setHasChanges(false)
    setShowBar(false)
  }, [initialState])

  const checkChanges = (newState: FormState) => {
    currentStateRef.current = newState
    
    const hasFormChanges = JSON.stringify(newState) !== JSON.stringify(initialStateRef.current)
    setHasChanges(hasFormChanges)
    
    // Show bar with animation when changes detected
    if (hasFormChanges && !showBar) {
      setShowBar(true)
    } else if (!hasFormChanges && showBar) {
      // Hide bar with delay when no changes
      setTimeout(() => setShowBar(false), 300)
    }
  }

  const resetChanges = () => {
    initialStateRef.current = { ...currentStateRef.current }
    setHasChanges(false)
    setShowBar(false)
  }

  return {
    hasChanges,
    showBar,
    checkChanges,
    resetChanges
  }
}
