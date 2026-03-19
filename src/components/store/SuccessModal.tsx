'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, X, MessageCircle, ArrowLeft } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSendWhatsApp?: () => void
  storeName: string
  hasWhatsApp: boolean
  isDemo?: boolean
}

export default function SuccessModal({ isOpen, onClose, onSendWhatsApp, storeName, hasWhatsApp, isDemo }: Props) {
  useEffect(() => {
    if (isOpen) {

      // Prevent page unload
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
      }
      
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!isOpen) return null



  const handleWhatsAppClick = () => {
    if (onSendWhatsApp) {
      onSendWhatsApp()
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop - não fecha ao clicar */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success icon with animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Animated rings */}
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-emerald-200 rounded-full animate-pulse" />
            
            {/* Icon */}
            <div className="relative bg-emerald-500 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isDemo ? 'Demonstração concluída! 🎉' : 'Pedido salvo com sucesso! 🎉'}
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            {isDemo 
              ? `Esta é uma demonstração do sistema. Em um ambiente real, seu pedido seria registrado no sistema de ${storeName}.`
              : `Seu pedido já está registrado no sistema de ${storeName}.`
            }
          </p>
          
          {hasWhatsApp && !isDemo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-800 leading-relaxed">
                💬 Você pode enviar os detalhes via WhatsApp agora para agilizar o atendimento.
              </p>
            </div>
          )}

          {isDemo && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                🛍️ Este é um ambiente de demonstração. Nenhum dado foi persistido.
              </p>
            </div>
          )}

          <div className="pt-4 space-y-3">
            {hasWhatsApp && !isDemo && (
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Enviar por WhatsApp
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              {isDemo ? 'Continuar demonstração' : 'Voltar para loja'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null
}
