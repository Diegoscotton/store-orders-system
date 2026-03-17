'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Textarea, Modal, ModalContent } from '@/components/ui'
import type { Category } from '@/types'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => Promise<void>
  category?: Category | null
}

export default function CategoryModal({ open, onClose, onSubmit, category }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description || '')
    } else {
      setName('')
      setDescription('')
    }
    setError('')
  }, [category, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar categoria')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent title={isEditing ? 'Editar categoria' : 'Nova categoria'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da categoria"
            placeholder="Ex: Pizzas, Bebidas, Sobremesas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <Textarea
            label="Descrição (opcional)"
            placeholder="Uma breve descrição da categoria"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {isEditing ? 'Salvar' : 'Criar categoria'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
