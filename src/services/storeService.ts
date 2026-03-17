import { createClient } from '@/lib/supabase'
import type { Store } from '@/types'

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function updateStore(storeId: string, updates: Partial<Store>): Promise<Store> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('stores')
    .update(updates)
    .eq('id', storeId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadStoreAsset(file: File, storeId: string, type: 'logo'): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${storeId}/${type}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('store-assets')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('store-assets')
    .getPublicUrl(path)

  return data.publicUrl
}
