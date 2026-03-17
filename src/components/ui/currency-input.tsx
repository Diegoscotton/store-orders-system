'use client'

import { useState, useEffect, forwardRef } from 'react'
import { cn, maskCurrency, unmaskCurrency, numberToCurrencyInput } from '@/lib/utils'

interface CurrencyInputProps {
  label?: string
  error?: string
  hint?: string
  value: number
  onChange: (value: number) => void
  className?: string
  required?: boolean
  placeholder?: string
  id?: string
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, hint, value, onChange, className, required, placeholder, id }, ref) => {
    const [display, setDisplay] = useState(() => numberToCurrencyInput(value))
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    useEffect(() => {
      if (value === 0 && display === '') return
      const currentParsed = unmaskCurrency(display)
      if (currentParsed !== value) {
        setDisplay(numberToCurrencyInput(value))
      }
    }, [value])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/\D/g, '')
      
      if (raw === '') {
        setDisplay('')
        onChange(0)
        return
      }

      const formatted = maskCurrency(raw)
      setDisplay(formatted)
      onChange(unmaskCurrency(formatted))
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            R$
          </span>
          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            value={display}
            onChange={handleChange}
            placeholder={placeholder || '0,00'}
            required={required}
            className={cn(
              'w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 focus:border-transparent',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'
export { CurrencyInput }
