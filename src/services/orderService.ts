import { createClient } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/types'

export async function getOrders(storeId: string, statusFilter?: OrderStatus): Promise<Order[]> {
  const supabase = createClient()
  let query = supabase
    .from('orders')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query

  if (error) throw error
  return (data || []).map((o) => ({
    ...o,
    total: Number(o.total || 0),
    total_amount: Number(o.total_amount || 0),
    // items is already a JSONB field, no need to map
    items: o.items || [],
  }))
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw error
}

export async function updateOrdersStatusBatch(orderIds: string[], status: OrderStatus): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .in('id', orderIds)

  if (error) throw error
}
