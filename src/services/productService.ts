import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'

export async function getProducts(storeId: string): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      images:product_images(id, url, position),
      variants:product_variants(
        id, name, position,
        options:variant_options(id, name, price, position)
      )
    `)
    .eq('store_id', storeId)
    .order('position', { ascending: true })

  if (error) throw error
  return (data || []).map((p) => ({
    ...p,
    price: Number(p.price),
    images: p.images?.sort((a: any, b: any) => a.position - b.position) || [],
    variants: p.variants?.sort((a: any, b: any) => a.position - b.position).map((v: any) => ({
      ...v,
      options: v.options?.sort((a: any, b: any) => a.position - b.position).map((o: any) => ({
        ...o,
        price: Number(o.price),
      })) || [],
    })) || [],
  }))
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      images:product_images(id, url, position),
      variants:product_variants(
        id, name, position,
        options:variant_options(id, name, price, position)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return {
    ...data,
    price: Number(data.price),
    images: data.images?.sort((a: any, b: any) => a.position - b.position) || [],
    variants: data.variants?.sort((a: any, b: any) => a.position - b.position).map((v: any) => ({
      ...v,
      options: v.options?.sort((a: any, b: any) => a.position - b.position).map((o: any) => ({
        ...o,
        price: Number(o.price),
      })) || [],
    })) || [],
  }
}

export async function createProduct(data: {
  name: string
  description?: string
  price: number
  category_id?: string | null
  store_id: string
  is_active?: boolean
}): Promise<Product> {
  const supabase = createClient()

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', data.store_id)

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      ...data,
      position: (count || 0) + 1,
    })
    .select()
    .single()

  if (error) throw error
  return { ...product, price: Number(product.price) }
}

export async function updateProduct(id: string, data: {
  name?: string
  description?: string
  price?: number
  category_id?: string | null
  is_active?: boolean
}): Promise<Product> {
  const supabase = createClient()
  const { data: product, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return { ...product, price: Number(product.price) }
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// --- Images ---

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${productId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  // Save reference in DB
  const { data: existing } = await supabase
    .from('product_images')
    .select('position')
    .eq('product_id', productId)
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = (existing?.[0]?.position ?? -1) + 1

  const { error: dbError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      url: urlData.publicUrl,
      position: nextPosition,
    })

  if (dbError) throw dbError
  return urlData.publicUrl
}

export async function deleteProductImage(imageId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)
  if (error) throw error
}

// --- Variants ---

export async function addVariant(productId: string, name: string) {
  const response = await fetch('/api/variants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, name }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao criar variação')
  }

  return response.json()
}

export async function updateVariant(variantId: string, name: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('product_variants')
    .update({ name })
    .eq('id', variantId)
  if (error) throw error
}

export async function deleteVariant(variantId: string) {
  const response = await fetch(`/api/variants?id=${variantId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao excluir variação')
  }

  return response.json()
}

export async function addVariantOption(variantId: string, name: string, price: number) {
  const response = await fetch('/api/variant-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant_id: variantId, name, price }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao adicionar opção')
  }

  return response.json()
}

export async function updateVariantOption(optionId: string, name: string, price: number) {
  const supabase = createClient()
  const { error } = await supabase
    .from('variant_options')
    .update({ name, price })
    .eq('id', optionId)
  if (error) throw error
}

export async function deleteVariantOption(optionId: string) {
  const response = await fetch(`/api/variant-options?id=${optionId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao excluir opção')
  }

  return response.json()
}
