import { createClient } from '@/lib/supabase'
import type { OrderStatus } from '@/types'

export type DashboardMetrics = {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  ordersByStatus: Record<OrderStatus, number>
  recentOrders: any[]
  topProducts: Array<{
    product_name: string
    total_quantity: number
    total_revenue: number
  }>
}

export async function getDashboardMetrics(storeId: string): Promise<DashboardMetrics> {
  const supabase = createClient()

  // Get all orders for the store
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })

  if (ordersError) throw ordersError

  const allOrders = orders || []

  // Calculate metrics
  const totalOrders = allOrders.length
  const totalRevenue = allOrders.reduce((sum, order) => {
    return sum + Number(order.total_amount || order.total || 0)
  }, 0)

  const pendingOrders = allOrders.filter(o => o.status === 'pending').length
  const completedOrders = allOrders.filter(o => o.status === 'delivered').length

  // Orders by status
  const ordersByStatus: Record<OrderStatus, number> = {
    pending: 0,
    accepted: 0,
    preparing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  }

  allOrders.forEach(order => {
    if (order.status in ordersByStatus) {
      ordersByStatus[order.status as OrderStatus]++
    }
  })

  // Recent orders (last 5)
  const recentOrders = allOrders.slice(0, 5)

  // Top products from items JSONB field
  const productStats: Record<string, { quantity: number; revenue: number }> = {}

  allOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const productName = item.product_name || 'Produto sem nome'
        if (!productStats[productName]) {
          productStats[productName] = { quantity: 0, revenue: 0 }
        }
        productStats[productName].quantity += item.quantity || 0
        productStats[productName].revenue += Number(item.total_price || 0)
      })
    }
  })

  const topProducts = Object.entries(productStats)
    .map(([product_name, stats]) => ({
      product_name,
      total_quantity: stats.quantity,
      total_revenue: stats.revenue,
    }))
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5)

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    completedOrders,
    ordersByStatus,
    recentOrders,
    topProducts,
  }
}
