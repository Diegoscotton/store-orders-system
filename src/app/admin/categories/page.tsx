'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button, Badge, Card, Skeleton } from '@/components/ui'
import {
  getCategoriesWithCount,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService'
import CategoryModal from '@/components/admin/categories/CategoryModal'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react'
import type { Category } from '@/types'

type CategoryWithCount = Category & { product_count: number }

export default function CategoriesPage() {
  const { store, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null)

  const loadCategories = useCallback(async () => {
    if (!store) return
    try {
      const data = await getCategoriesWithCount(store.id)
      setCategories(data)
    } catch (err: any) {
      toast({ type: 'error', title: 'Erro ao carregar categorias', description: err.message })
    } finally {
      setLoading(false)
    }
  }, [store, toast])

  useEffect(() => {
    if (!authLoading && store) loadCategories()
  }, [authLoading, store, loadCategories])

  function handleOpenCreate() {
    setEditingCategory(null)
    setModalOpen(true)
  }

  function handleOpenEdit(category: Category) {
    setEditingCategory(category)
    setModalOpen(true)
  }

  async function handleSubmit(data: { name: string; description?: string }) {
    if (!store) return
    if (editingCategory) {
      await updateCategory(editingCategory.id, data)
      toast({ type: 'success', title: 'Categoria atualizada' })
    } else {
      await createCategory(store.id, data)
      toast({ type: 'success', title: 'Categoria criada' })
    }
    await loadCategories()
  }

  function handleOpenDelete(category: CategoryWithCount) {
    setDeletingCategory(category)
    setDeleteModalOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingCategory) return
    try {
      await deleteCategory(deletingCategory.id)
      toast({ type: 'success', title: 'Categoria excluída' })
      await loadCategories()
    } catch (err: any) {
      toast({ type: 'error', title: 'Erro ao excluir', description: err.message })
    }
  }

  if (authLoading || loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <Card className="p-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24 ml-auto" />
            </div>
          ))}
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 mt-1">Organize seus produtos por categorias</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhuma categoria</h3>
          <p className="text-gray-500 mb-6">Crie sua primeira categoria para organizar os produtos</p>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            Criar categoria
          </Button>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Nome</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Produtos</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      {cat.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{cat.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {cat.product_count} {cat.product_count === 1 ? 'produto' : 'produtos'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cat.is_active ? 'success' : 'default'}>
                      {cat.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cat)} title="Editar">
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(cat)} title="Excluir">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        category={editingCategory}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir categoria"
        description={
          deletingCategory?.product_count
            ? `A categoria "${deletingCategory.name}" possui ${deletingCategory.product_count} produto(s). Os produtos ficarão sem categoria.`
            : `Tem certeza que deseja excluir a categoria "${deletingCategory?.name}"?`
        }
      />
    </div>
  )
}
