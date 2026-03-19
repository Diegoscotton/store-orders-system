'use client'

import { Button } from '@/components/ui'
import { X, Save, RotateCcw } from 'lucide-react'

interface FormChangesBarProps {
  show: boolean
  onSave: () => void
  onCancel: () => void
  onReset?: () => void
  saveText?: string
  saving?: boolean
  disabled?: boolean
}

export default function FormChangesBar({ 
  show, 
  onSave, 
  onCancel, 
  onReset,
  saveText = 'Salvar alterações',
  saving = false,
  disabled = false
}: FormChangesBarProps) {
  if (!show) return null

  return (
    <div className={`
      fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 shadow-lg z-30
      transform transition-all duration-300 ease-in-out
      ${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
    `}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Você tem alterações não salvas</span>
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Descartar
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <button
            onClick={onSave}
            disabled={disabled || saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <Save className="h-4 w-4" />
            {saveText}
          </button>
        </div>
      </div>
    </div>
  )
}
