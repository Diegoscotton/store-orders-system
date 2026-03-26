'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardMetrics, type DashboardMetrics } from '@/services/dashboardService'
import { Card, MetricCardSkeleton, Badge } from '@/components/ui'
import { Package, ShoppingCart, Clock, TrendingUp, DollarSign, CheckCircle, Eye, AlertTriangle, AlertCircle } from 'lucide-react'
import { formatCurrency, getTrialDaysLeft } from '@/lib/utils'

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  ready: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
}

export default function AdminDashboard() {
  const { store, loading: authLoading } = useAuth()
  const router = useRouter()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!store) {
      setLoading(false)
      return
    }
    loadMetrics()
  }, [store, authLoading])

  async function loadMetrics() {
    if (!store) return
    try {
      const data = await getDashboardMetrics(store.id)
      setMetrics(data)
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <MetricCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma loja encontrada</h2>
        <p className="text-gray-500 mb-6">Entre em contato com o suporte.</p>
      </div>
    )
  }

  const trialDays = getTrialDaysLeft(store.trial_ends_at)

  const metricCards = [
    { label: 'Total de Pedidos', value: metrics?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
    { label: 'Receita Total', value: formatCurrency(metrics?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pendentes', value: metrics?.pendingOrders || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Concluídos', value: metrics?.completedOrders || 0, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getTrialWarning(store: any) {
    if (!store) return null
    if (store.is_free) return null
    if (!store.trial_ends_at) return null
    const now = new Date()
    const end = new Date(store.trial_ends_at)
    const diffMs = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { type: 'expired' }
    if (diffDays <= 10) return { type: 'expiring', days: diffDays }
    return null
  }

  const trialWarning = getTrialWarning(store)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bem-vindo de volta, {store.name}</p>
      </div>

      {trialWarning?.type === 'expiring' && (
        <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: 10, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">Seu período de teste expira em <strong>{trialWarning.days} dia{trialWarning.days !== 1 ? 's' : ''}</strong>. Entre em contato para continuar usando o Fosfo.</p>
          </div>
          <a href="https://wa.me/5551981219406" target="_blank" rel="noopener noreferrer" style={{ background: '#F59E0B', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Falar com suporte
          </a>
        </div>
      )}

      {trialWarning?.type === 'expired' && (
        <div style={{ background: '#FFF7ED', borderLeft: '4px solid #EA580C', borderRadius: 10, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-orange-800">Seu período de teste encerrou. Entre em contato para reativar sua loja.</p>
          </div>
          <a href="https://wa.me/5551981219406" target="_blank" rel="noopener noreferrer" style={{ background: '#EA580C', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Reativar agora
          </a>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((m, index) => (
          <Card 
            key={m.label} 
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${m.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <m.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">{m.value}</p>
                {/* Trend indicator */}
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">+12%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <Card className="group">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
            <button
              onClick={() => router.push('/admin/orders')}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors hover:bg-gray-50 px-2 py-1 rounded-lg"
            >
              Ver todos <Eye className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
              metrics.recentOrders.map((order, index) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer group/item hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover/item:text-blue-600 transition-colors">#{order.order_number}</p>
                      <p className="text-sm text-gray-600 truncate">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(order.total_amount || order.total || 0)}</p>
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Nenhum pedido ainda</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="group">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-3">
            {metrics?.topProducts && metrics.topProducts.length > 0 ? (
              metrics.topProducts.map((product, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer group/item hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform ${
                      index === 0 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100' :
                      index === 1 ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                      index === 2 ? 'bg-gradient-to-br from-purple-50 to-purple-100' :
                      'bg-gradient-to-br from-gray-50 to-gray-100'
                    }`}>
                      <span className={`text-sm font-bold ${
                        index === 0 ? 'text-emerald-600' :
                        index === 1 ? 'text-blue-600' :
                        index === 2 ? 'text-purple-600' :
                        'text-gray-600'
                      }`}>#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover/item:text-emerald-600 transition-colors truncate">{product.product_name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">{product.total_quantity} vendidos</p>
                        {/* Revenue indicator */}
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                          <span className="text-xs text-emerald-500 font-medium">+8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(product.total_revenue)}</p>
                    <div className="h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(20, 100 - index * 20)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Nenhuma venda ainda</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              label: 'Novo produto', 
              desc: 'Adicione um produto à sua loja', 
              href: '/admin/products/create',
              icon: Package,
              color: 'from-blue-500 to-blue-600'
            },
            { 
              label: 'Ver pedidos', 
              desc: 'Acompanhe os pedidos recebidos', 
              href: '/admin/orders',
              icon: ShoppingCart,
              color: 'from-emerald-500 to-emerald-600'
            },
            { 
              label: 'Configurações', 
              desc: 'Personalize sua loja', 
              href: '/admin/settings',
              icon: TrendingUp,
              color: 'from-purple-500 to-purple-600'
            },
          ].map((action) => (
            <Card
              key={action.href}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              onClick={() => router.push(action.href)}
            >
              <div className="relative">
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${action.color} opacity-10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500`} />
                
                <div className="relative p-6">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">{action.label}</h3>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                  
                  {/* Arrow indicator */}
                  <div className="flex items-center justify-end mt-3">
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <div className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
