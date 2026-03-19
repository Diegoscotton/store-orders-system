'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getProducts, deleteProduct } from '@/services/productService'
import { Button, Card, Badge, useToast, Skeleton } from '@/components/ui'
import { Plus, Pencil, Trash2, Package, Eye, EyeOff, RefreshCw } from 'lucide-react'
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

  // Reload products when page becomes visible (when coming back from edit)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && store) {
        loadProducts()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [store])

  async function loadProducts() {
    if (!store) return
    try {
      setLoading(true)
      console.log('Loading products for store:', store.id)
      const data = await getProducts(store.id)
      console.log('Products loaded:', data.map(p => ({
        id: p.id,
        name: p.name,
        images: p.images?.map(i => ({ id: i.id, position: i.position, url: i.url.substring(0, 50) }))
      })))
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
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => loadProducts()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => router.push('/admin/products/create')}>
            <Plus className="h-4 w-4" />
            Novo produto
          </Button>
        </div>
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
          {/* Desktop/Tablet Table */}
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Categoria</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Preço</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Status</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const mainImage = product.images?.[0]?.url
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {mainImage ? (
                              <img src={mainImage} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-3 w-3 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-gray-500 truncate">{product.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        {product.category ? (
                          <Badge variant="default" className="text-xs truncate block">{product.category.name}</Badge>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-2 py-4">
                        <span className="font-semibold text-gray-900 text-sm truncate block">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-2 py-4">
                        {product.is_active ? (
                          <Badge variant="success" className="text-xs">
                            <Eye className="h-2 w-2 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">
                            <EyeOff className="h-2 w-2 mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/products/${product.id}/edit`)} title="Editar">
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} title="Excluir">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {products.map((product) => {
              const mainImage = product.images?.[0]?.url
              return (
                <div key={product.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      {mainImage ? (
                        <img src={mainImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {product.category ? (
                      <Badge variant="default" className="text-xs">{product.category.name}</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">Sem categoria</span>
                    )}
                    <span className="font-semibold text-gray-900 text-sm">{formatCurrency(product.price)}</span>
                    {product.is_active ? (
                      <Badge variant="success" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inativo
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
