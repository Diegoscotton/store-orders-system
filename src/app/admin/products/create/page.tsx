'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getCategories } from '@/services/categoryService'
import ProductForm from '@/components/admin/ProductForm'
import { Skeleton } from '@/components/ui'
import type { Category } from '@/types'

export default function CreateProductPage() {
  const { store } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (store) loadCategories()
  }, [store])

  async function loadCategories() {
    if (!store) return
    try {
      const data = await getCategories(store.id)
      setCategories(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  if (loading || !store) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return <ProductForm storeId={store.id} categories={categories} />
}
