import { createClient } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import type { Category } from '@/types'

export async function getCategories(storeId: string): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', storeId)
    .order('position', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getCategoriesWithCount(storeId: string) {
  const supabase = createClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', storeId)
    .order('position', { ascending: true })

  if (error) throw error

  const { data: products } = await supabase
    .from('products')
    .select('category_id')
    .eq('store_id', storeId)

  const counts: Record<string, number> = {}
  products?.forEach((p) => {
    if (p.category_id) {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1
    }
  })

  return (categories || []).map((cat) => ({
    ...cat,
    product_count: counts[cat.id] || 0,
  }))
}

export async function createCategory(
  storeId: string,
  data: { name: string; description?: string }
): Promise<Category> {
  const supabase = createClient()
  const slug = generateSlug(data.name)

  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', storeId)

  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name: data.name,
      slug,
      description: data.description || null,
      store_id: storeId,
      position: (count || 0) + 1,
    })
    .select()
    .single()

  if (error) {
    if (error.message?.includes('duplicate key')) {
      throw new Error('Já existe uma categoria com este nome.')
    }
    throw error
  }
  return category
}

export async function updateCategory(
  id: string,
  data: { name: string; description?: string }
): Promise<Category> {
  const supabase = createClient()
  const slug = generateSlug(data.name)

  const { data: category, error } = await supabase
    .from('categories')
    .update({
      name: data.name,
      slug,
      description: data.description || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.message?.includes('duplicate key')) {
      throw new Error('Já existe uma categoria com este nome.')
    }
    throw error
  }
  return category
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}
