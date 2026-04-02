import { createClient } from '@/lib/supabase'
import type { Store, Profile } from '@/types'

export type StoreWithOwner = Store & {
  owner: Profile | null
  product_count: number
  order_count: number
  is_free: boolean
}

export async function getMasterMetrics() {
  const supabase = createClient()

  const [stores, activeStores, users, orders] = await Promise.all([
    supabase.from('stores').select('*', { count: 'exact', head: true }),
    supabase.from('stores').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ])

  // Recent signups (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: recentSignups } = await supabase
    .from('stores')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo)

  return {
    totalStores: stores.count || 0,
    activeStores: activeStores.count || 0,
    totalUsers: users.count || 0,
    totalOrders: orders.count || 0,
    recentSignups: recentSignups || 0,
  }
}

export async function getMasterStores(): Promise<StoreWithOwner[]> {
  const supabase = createClient()
  supabase.channel('custom-all-channel').unsubscribe()

  const timestamp = Date.now()
  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false })
    .gt('created_at', '2000-01-01')

  if (error) throw error

  // Get owners
  const ownerIds = [...new Set((stores || []).map((s) => s.owner_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', ownerIds)

  const profileMap: Record<string, Profile> = {}
  profiles?.forEach((p) => { profileMap[p.id] = p })

  // Get product counts
  const { data: products } = await supabase
    .from('products')
    .select('store_id')

  const productCounts: Record<string, number> = {}
  products?.forEach((p) => {
    productCounts[p.store_id] = (productCounts[p.store_id] || 0) + 1
  })

  // Get order counts
  const { data: orders } = await supabase
    .from('orders')
    .select('store_id')

  const orderCounts: Record<string, number> = {}
  orders?.forEach((o) => {
    orderCounts[o.store_id] = (orderCounts[o.store_id] || 0) + 1
  })

  return (stores || []).map((store) => ({
    ...store,
    owner: profileMap[store.owner_id] || null,
    product_count: productCounts[store.id] || 0,
    order_count: orderCounts[store.id] || 0,
  }))
}

export async function toggleStoreActive(storeId: string, isActive: boolean): Promise<void> {
  const supabase = createClient()
  console.log('toggleStoreActive called:', storeId, isActive)
  const { data, error } = await supabase
    .from('stores')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', storeId)
    .select()
  console.log('toggleStoreActive result:', data, error)
  if (error) throw error
}

export async function extendStoreTrial(storeId: string, days: number): Promise<void> {
  const supabase = createClient()
  const newDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('stores')
    .update({ trial_ends_at: newDate, is_active: true })
    .eq('id', storeId)
  if (error) throw error
}

export async function getMasterUsers() {
  const supabase = createClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, email, role, created_at, updated_at, avatar_url')
    .eq('role', 'admin')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Busca lojas pelo owner_id (mais confiável que store_users)
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, slug, owner_id')

  const ownerStoreMap: Record<string, { name: string; slug: string }> = {}
  stores?.forEach((s) => {
    if (s.owner_id) ownerStoreMap[s.owner_id] = { name: s.name, slug: s.slug }
  })

  return (profiles || []).map((profile) => ({
    ...profile,
    email: null, // email vem de auth.users, não acessível pelo client
    store: ownerStoreMap[profile.id] || null,
  }))
}

export async function getPlatformSettings(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data, error } = await supabase.from('platform_settings').select('*')
  if (error) throw error
  
  const settings: Record<string, string> = {}
  data?.forEach((row) => {
    settings[row.key] = row.value
  })
  
  return settings
}

export async function getDefaultTrialDays(): Promise<number> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', 'default_trial_days')
    .single()
  
  if (error || !data) return 30 // Fallback para 30 dias
  return parseInt(data.value, 10) || 30
}

export async function updatePlatformSetting(key: string, value: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('platform_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) throw error
}

export async function setStoreFree(storeId: string, isFree: boolean): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('stores')
    .update({ is_free: isFree, is_active: true })
    .eq('id', storeId)
  if (error) throw error
}

export async function applyNewTrialToNewStores(days: number): Promise<void> {
  const supabase = createClient()
  const newDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('stores')
    .update({ trial_ends_at: newDate })
    .eq('is_free', false)
    .is('trial_ends_at', null)
  if (error) throw error
}

export async function deleteStore(storeId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', storeId)
  if (error) throw error
}

export async function deleteUser(userId: string): Promise<void> {
  const supabase = createClient()
  // Deleta a loja do usuário primeiro
  const { data: storeUser } = await supabase
    .from('store_users')
    .select('store_id')
    .eq('user_id', userId)
    .single()
  if (storeUser?.store_id) {
    await supabase.from('stores').delete().eq('id', storeUser.store_id)
  }
  // Deleta o profile
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)
  if (error) throw error
}
