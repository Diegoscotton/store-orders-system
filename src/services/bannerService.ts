import { createClient } from '@/lib/supabase'
import type { Banner } from '@/types'

export async function getBanners(storeId: string): Promise<Banner[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('store_id', storeId)
    .order('position', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createBanner(storeId: string, file: File, title?: string, linkUrl?: string): Promise<Banner> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${storeId}/banner-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('store-assets')
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('store-assets')
    .getPublicUrl(path)

  const { count } = await supabase
    .from('banners')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', storeId)

  const { data, error } = await supabase
    .from('banners')
    .insert({
      store_id: storeId,
      image_url: urlData.publicUrl,
      title: title || null,
      link_url: linkUrl || null,
      position: (count || 0) + 1,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('banners')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteBanner(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id)

  if (error) throw error
}
