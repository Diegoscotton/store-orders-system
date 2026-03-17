'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getProducts, deleteProduct } from '@/services/productService'
import { Button, Card, Badge, useToast, Skeleton } from '@/components/ui'
import { Plus, Pencil, Trash2, Package, Eye, EyeOff } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductsPage() {
  const { store } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (store) loadProducts()
  }, [store])

  async function loadProducts() {
    if (!store) return
    try {
      setLoading(true)
      const data = await getProducts(store.id)
      setProducts(data)
    } catch {
      toast({ type: 'error', title: 'Erro ao carregar produtos' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) return
    try {
      await deleteProduct(product.id)
      toast({ type: 'success', title: 'Produto excluído' })
      await loadProducts()
    } catch {
      toast({ type: 'error', title: 'Erro ao excluir produto' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 mt-1">{products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => router.push('/admin/products/create')}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {loading && (
        <Card className="p-0 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-100 last:border-0">
              <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </Card>
      )}

      {!loading && products.length === 0 && (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum produto</h3>
          <p className="text-gray-500 mb-6">Cadastre seu primeiro produto para começar a vender</p>
          <Button onClick={() => router.push('/admin/products/create')}>
            <Plus className="h-4 w-4" />
            Criar primeiro produto
          </Button>
        </Card>
      )}

      {!loading && products.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const mainImage = product.images?.[0]?.url
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {mainImage ? (
                            <img src={mainImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.category ? (
                        <Badge variant="default">{product.category.name}</Badge>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <Badge variant="success">
                          <Eye className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="warning">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
