'use client'

import { useState, useEffect } from 'react'
import { getMasterMetrics } from '@/services/masterService'
import { Card, MetricCardSkeleton } from '@/components/ui'
import { Store, Users, ShoppingCart, TrendingUp, UserPlus } from 'lucide-react'

export default function MasterDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
  }, [])

  async function loadMetrics() {
    try {
      const data = await getMasterMetrics()
      setMetrics(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Master</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => <MetricCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const cards = [
    { label: 'Total de lojas', value: metrics?.totalStores || 0, icon: Store, color: 'text-blue-600 bg-blue-50' },
    { label: 'Lojas ativas', value: metrics?.activeStores || 0, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Usuários', value: metrics?.totalUsers || 0, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pedidos (global)', value: metrics?.totalOrders || 0, icon: ShoppingCart, color: 'text-amber-600 bg-amber-50' },
    { label: 'Novos (7 dias)', value: metrics?.recentSignups || 0, icon: UserPlus, color: 'text-pink-600 bg-pink-50' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Master</h1>
        <p className="text-gray-500 mt-1">Visão geral da plataforma Fosfo Pedidos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((m) => (
          <Card key={m.label} className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${m.color}`}>
              <m.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
