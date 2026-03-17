import { createClient } from '@/lib/supabase'
import type { Store, Profile } from '@/types'

export type StoreWithOwner = Store & {
  owner: Profile | null
  product_count: number
  order_count: number
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

  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false })

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
  const { error } = await supabase
    .from('stores')
    .update({ is_active: isActive })
    .eq('id', storeId)
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
    .select('*')
    .eq('role', 'admin')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Get store links
  const { data: storeUsers } = await supabase
    .from('store_users')
    .select('user_id, store_id')

  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, slug')

  const storeMap: Record<string, { name: string; slug: string }> = {}
  stores?.forEach((s) => { storeMap[s.id] = { name: s.name, slug: s.slug } })

  const userStoreMap: Record<string, { name: string; slug: string }> = {}
  storeUsers?.forEach((su) => {
    if (storeMap[su.store_id]) {
      userStoreMap[su.user_id] = storeMap[su.store_id]
    }
  })

  return (profiles || []).map((profile) => ({
    ...profile,
    store: userStoreMap[profile.id] || null,
  }))
}

export async function getPlatformSettings() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')

  if (error) throw error
  const settings: Record<string, string> = {}
  data?.forEach((s) => { settings[s.key] = s.value })
  return settings
}

export async function updatePlatformSetting(key: string, value: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('platform_settings')
    .update({ value })
    .eq('key', key)
  if (error) throw error
}
