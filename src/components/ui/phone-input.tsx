'use client'

import { forwardRef } from 'react'
import { cn, maskPhone } from '@/lib/utils'

interface PhoneInputProps {
  label?: string
  error?: string
  hint?: string
  value: string
  onChange: (value: string) => void
  className?: string
  required?: boolean
  id?: string
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, hint, value, onChange, className, required, id }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const masked = maskPhone(e.target.value)
      onChange(masked)
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
          required={required}
          maxLength={15}
          className={cn(
            'w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
export { PhoneInput }
