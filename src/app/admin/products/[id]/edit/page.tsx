'use client'

import { useState, useEffect, use } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getProduct } from '@/services/productService'
import { getCategories } from '@/services/categoryService'
import ProductForm from '@/components/admin/ProductForm'
import { Skeleton } from '@/components/ui'
import type { Product, Category } from '@/types'

type Props = {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params)
  const { store } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (store) loadData()
  }, [store])

  async function loadData() {
    if (!store) return
    try {
      const [prod, cats] = await Promise.all([
        getProduct(id),
        getCategories(store.id),
      ])
      setProduct(prod)
      setCategories(cats)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  if (loading || !store || !product) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return <ProductForm storeId={store.id} categories={categories} product={product} />
}
