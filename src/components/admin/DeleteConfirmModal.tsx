'use client'

import { useState } from 'react'
import { Button, Modal, ModalContent } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  description: string
}

export default function DeleteConfirmModal({ open, onClose, onConfirm, title, description }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent>
        <div className="text-center">
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{description}</p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={loading}
              onClick={handleConfirm}
              className="flex-1"
            >
              Excluir
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
