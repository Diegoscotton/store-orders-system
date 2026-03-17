import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import StoreClient from './StoreClient'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  // Get store
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !store) {
    notFound()
  }

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('position')

  // Get products with images and variants
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      images:product_images(id, url, position),
      variants:product_variants(
        id, name, position,
        options:variant_options(id, name, price, position)
      )
    `)
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('position')

  // Get banners
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('position')

  return (
    <StoreClient
      store={store}
      products={products || []}
      banners={banners || []}
      categories={categories || []}
    />
  )
}
