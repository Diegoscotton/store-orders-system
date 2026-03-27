'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getOrders, updateOrderStatus, updateOrdersStatusBatch } from '@/services/orderService'
import { Button, Card, Badge, Modal, ModalContent, useToast, Skeleton } from '@/components/ui'
import { ShoppingCart, Eye, Printer, CheckCircle, Clock, ChefHat, PackageCheck, Truck, XCircle, Search, MessageCircle } from 'lucide-react'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types'

const STATUS_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Aceitos', value: 'accepted' },
  { label: 'Preparando', value: 'preparing' },
  { label: 'Prontos', value: 'ready' },
  { label: 'Entregues', value: 'delivered' },
  { label: 'Cancelados', value: 'cancelled' },
]

const STATUS_FLOW: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'delivered']

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  accepted: <CheckCircle className="h-4 w-4" />,
  preparing: <ChefHat className="h-4 w-4" />,
  ready: <PackageCheck className="h-4 w-4" />,
  delivered: <Truck className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
}

export default function OrdersPage() {
  const { store } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [hasNewOrders, setHasNewOrders] = useState(false)
  const previousOrderCountRef = useRef<number>(0)

  useEffect(() => {
    if (store) loadOrders()
  }, [store, activeTab])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!store) return
    
    const interval = setInterval(() => {
      loadOrdersQuietly()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [store, activeTab])

  async function loadOrdersQuietly() {
    if (!store) return
    try {
      const data = await getOrders(store.id, activeTab === 'all' ? undefined : activeTab)
      
      // Check if there are new orders
      if (previousOrderCountRef.current > 0 && data.length > previousOrderCountRef.current) {
        setHasNewOrders(true)
        // Auto-hide notification after 5 seconds
        setTimeout(() => setHasNewOrders(false), 5000)
      }
      
      previousOrderCountRef.current = data.length
      setOrders(data)
    } catch {
      // Silent fail on background refresh
    }
  }

  async function loadOrders() {
    if (!store) return
    try {
      setLoading(true)
      const data = await getOrders(store.id, activeTab === 'all' ? undefined : activeTab)
      console.log('📦 Pedidos carregados:', data.length)
      console.log('📦 Primeiro pedido:', data[0])
      setOrders(data)
      previousOrderCountRef.current = data.length
    } catch {
      toast({ type: 'error', title: 'Erro ao carregar pedidos' })
    } finally {
      setLoading(false)
    }
  }

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery || searchQuery.trim() === '') return true
    
    const query = searchQuery.toLowerCase().trim()
    
    // Debug log
    console.log('Buscando por:', query)
    console.log('Pedido:', {
      number: order.order_number,
      name: order.customer_name,
      phone: order.customer_phone
    })
    
    // Search in order number
    const matchesNumber = order.order_number?.toString().toLowerCase().includes(query)
    
    // Search in customer name
    const matchesName = order.customer_name?.toLowerCase().includes(query)
    
    // Search in phone (remove all non-digits)
    const cleanQuery = query.replace(/\D/g, '')
    const cleanPhone = order.customer_phone?.replace(/\D/g, '') || ''
    const matchesPhone = cleanQuery.length > 0 && cleanPhone.includes(cleanQuery)
    
    const matches = matchesNumber || matchesName || matchesPhone
    
    if (matches) {
      console.log('✅ Match encontrado:', order.customer_name)
    }
    
    return matches
  })

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast({ type: 'success', title: `Status alterado para ${ORDER_STATUS_LABELS[newStatus]}` })
      await loadOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null)
      }
    } catch {
      toast({ type: 'error', title: 'Erro ao alterar status' })
    }
  }

  async function handleBatchMark(status: OrderStatus) {
    if (selected.size === 0) return
    try {
      await updateOrdersStatusBatch(Array.from(selected), status)
      toast({ type: 'success', title: `${selected.size} pedido(s) marcado(s) como ${ORDER_STATUS_LABELS[status]}` })
      setSelected(new Set())
      await loadOrders()
    } catch {
      toast({ type: 'error', title: 'Erro ao atualizar pedidos' })
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === orders.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(orders.map((o) => o.id)))
    }
  }

  function openDetails(order: Order) {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  function getNextStatus(current: OrderStatus): OrderStatus | null {
    const idx = STATUS_FLOW.indexOf(current)
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null
    return STATUS_FLOW[idx + 1]
  }

  function handlePrint() {
    const ordersToPrint = orders.filter((o) => selected.has(o.id))
    if (ordersToPrint.length === 0) return

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pedidos</title>
    <style>
      body{font-family:Arial,sans-serif;margin:0;padding:20px;font-size:12px}
      .order{border:1px solid #ddd;padding:16px;margin-bottom:16px;page-break-inside:avoid;border-radius:8px}
      .order h2{margin:0 0 8px;font-size:16px}
      .order .meta{color:#666;margin-bottom:12px;line-height:1.6}
      .order table{width:100%;border-collapse:collapse;margin-top:12px}
      .order th,.order td{text-align:left;padding:6px 8px;border-bottom:1px solid #eee}
      .order th{background:#f5f5f5;font-weight:600}
      .order .total{font-size:16px;font-weight:bold;text-align:right;margin-top:12px;padding-top:8px;border-top:2px solid #333}
      @media print{body{padding:0}.order{border:1px solid #ccc}}
    </style></head><body>
    ${ordersToPrint.map((o) => {
      const totalAmount = o.total_amount || o.total || 0
      const deliveryAddr = o.delivery_address || o.customer_address || ''
      const obs = o.observations || o.notes || ''
      
      return `
      <div class="order">
        <h2>Pedido #${o.order_number}</h2>
        <div class="meta">
          <strong>${o.customer_name}</strong> — ${formatPhone(o.customer_phone)}<br>
          ${deliveryAddr ? `Endereço: ${deliveryAddr}<br>` : ''}
          ${o.delivery_complement ? `Complemento: ${o.delivery_complement}<br>` : ''}
          ${obs ? `Observações: ${obs}<br>` : ''}
          Data: ${formatDate(o.created_at)}
        </div>
        <table>
          <thead><tr><th>Item</th><th>Qtd</th><th>Preço</th></tr></thead>
          <tbody>${Array.isArray(o.items) && o.items.length > 0 ? o.items.map((item: any) => {
            const optionsText = item.selected_options?.map((opt: any) => opt.option_name).join(', ') || ''
            return `
            <tr>
              <td>${item.product_name}${optionsText ? ` (${optionsText})` : ''}</td>
              <td>${item.quantity}</td>
              <td>R$ ${Number(item.total_price || 0).toFixed(2)}</td>
            </tr>`
          }).join('') : '<tr><td colspan="3">Nenhum item</td></tr>'}</tbody>
        </table>
        <div class="total">Total: R$ ${Number(totalAmount).toFixed(2)}</div>
      </div>
      `
    }).join('')}
    <script>window.print()</script></body></html>`

    const w = window.open('', '_blank')
    if (w) {
      w.document.write(html)
      w.document.close()
    }
  }

  return (
    <div>
      {/* New Orders Notification */}
      {hasNewOrders && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium text-emerald-800">
              Novos pedidos recebidos! A lista foi atualizada.
            </p>
          </div>
          <button
            onClick={() => setHasNewOrders(false)}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
          >
            Dispensar
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 mt-1">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</p>
        </div>
        {selected.size > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Imprimir ({selected.size})
            </Button>
            <button
              onClick={() => handleBatchMark('delivered')}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-150 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <CheckCircle className="h-4 w-4" />
              Marcar entregue ({selected.size})
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredOrders.length} resultado{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''} para "{searchQuery}"
          </p>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-colors ${
              activeTab === tab.value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <Card className="p-0 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-32 flex-1" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </Card>
      )}

      {!loading && orders.length === 0 && (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum pedido</h3>
          <p className="text-gray-500">Os pedidos aparecerão aqui quando seus clientes fizerem compras</p>
        </Card>
      )}

      {!loading && orders.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nº</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-4 font-medium text-gray-900">#{order.order_number}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{formatPhone(order.customer_phone)}</p>
                      </div>
                      {order.customer_phone && (
                        <a
                          href={`https://wa.me/55${order.customer_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Contatar cliente"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 font-semibold text-gray-900">{formatCurrency(order.total_amount || order.total || 0)}</td>
                  <td className="px-3 py-4">
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      {STATUS_ICONS[order.status]}
                      <span className="ml-1">{ORDER_STATUS_LABELS[order.status]}</span>
                    </Badge>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDetails(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {getNextStatus(order.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, getNextStatus(order.status)!)}
                        >
                          {ORDER_STATUS_LABELS[getNextStatus(order.status)!]}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Details Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent title={selectedOrder ? `Pedido #${selectedOrder.order_number}` : 'Detalhes'} className="max-w-lg">
          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Cliente</p>
                    {selectedOrder.customer_phone && (
                      <a
                        href={`https://wa.me/55${selectedOrder.customer_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Contatar cliente
                      </a>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600">{formatPhone(selectedOrder.customer_phone)}</p>
                </div>
                
                {(selectedOrder.delivery_address || selectedOrder.customer_address) && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Endereço de entrega</p>
                    <p className="text-sm text-gray-700">{selectedOrder.delivery_address || selectedOrder.customer_address}</p>
                    {selectedOrder.delivery_complement && (
                      <p className="text-sm text-gray-600">{selectedOrder.delivery_complement}</p>
                    )}
                  </div>
                )}
                
                {(selectedOrder.observations || selectedOrder.notes) && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Observações</p>
                    <p className="text-sm text-gray-700 italic">{selectedOrder.observations || selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Itens do pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                    selectedOrder.items.map((item: any, index: number) => {
                      const optionsText = item.selected_options?.map((opt: any) => opt.option_name).join(', ')
                      return (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.product_name}
                            {optionsText && (
                              <span className="text-gray-400"> ({optionsText})</span>
                            )}
                          </span>
                          <span className="font-medium text-gray-900">{formatCurrency(item.total_price)}</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-gray-400 italic">Nenhum item encontrado</p>
                  )}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(selectedOrder.total_amount || selectedOrder.total || 0)}
                  </span>
                </div>
              </div>

              {/* Status actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Alterar status</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <Button
                      key={s}
                      variant={selectedOrder.status === s ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      disabled={selectedOrder.status === s}
                    >
                      {STATUS_ICONS[s]}
                      <span className="ml-1">{ORDER_STATUS_LABELS[s]}</span>
                    </Button>
                  ))}
                  <Button
                    variant={selectedOrder.status === 'cancelled' ? 'danger' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="ml-1">Cancelar</span>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-400">{formatDate(selectedOrder.created_at)}</p>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
