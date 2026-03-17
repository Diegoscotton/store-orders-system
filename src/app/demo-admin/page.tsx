'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Badge } from '@/components/ui'
import { 
  Package, ShoppingCart, Clock, TrendingUp, DollarSign, CheckCircle, 
  Store, ArrowLeft, LayoutDashboard, Settings, Image, FolderOpen,
  ExternalLink, Plus, Edit, Trash2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

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

type TabType = 'dashboard' | 'products' | 'orders' | 'categories' | 'banners' | 'settings'

export default function DemoAdminPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [storeData, setStoreData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductModal, setShowProductModal] = useState(false)

  useEffect(() => {
    loadDemoData()
  }, [])

  async function loadDemoData() {
    try {
      const supabase = createClient()
      
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', 'demo')
        .single()

      if (!store) {
        setLoading(false)
        return
      }

      // Buscar pedidos
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentOrders(orders || [])

      // Buscar produtos
      const { data: prods } = await supabase
        .from('products')
        .select('*, category:categories(name), images:product_images(url)')
        .eq('store_id', store.id)
        .limit(10)

      // Se não houver produtos reais, criar fictícios
      if (!prods || prods.length === 0) {
        const mockProducts = [
          {
            id: 'mock-p1',
            name: 'Bolo de Chocolate',
            base_price: 85.00,
            description: 'Delicioso bolo de chocolate com cobertura cremosa',
            category: { name: 'Bolos' },
            images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200' }]
          },
          {
            id: 'mock-p2',
            name: 'Bolo de Morango',
            base_price: 90.00,
            description: 'Bolo recheado com morangos frescos',
            category: { name: 'Bolos' },
            images: [{ url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200' }]
          },
          {
            id: 'mock-p3',
            name: 'Brigadeiro Gourmet',
            base_price: 5.00,
            description: 'Brigadeiro artesanal de diversos sabores',
            category: { name: 'Doces' },
            images: [{ url: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=200' }]
          },
          {
            id: 'mock-p4',
            name: 'Brownie',
            base_price: 16.00,
            description: 'Brownie de chocolate com nozes',
            category: { name: 'Doces' },
            images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200' }]
          }
        ]
        setProducts(mockProducts)
      } else {
        setProducts(prods)
      }

      // Buscar categorias
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', store.id)

      setCategories(cats || [])

      // Buscar banners
      const { data: bannersData } = await supabase
        .from('banners')
        .select('*')
        .eq('store_id', store.id)
        .order('position')

      setBanners(bannersData || [])

      // Buscar dados completos da loja
      const { data: storeComplete } = await supabase
        .from('stores')
        .select('*')
        .eq('id', store.id)
        .single()

      setStoreData(storeComplete)

      // Métricas - usar dados reais ou fictícios
      const totalOrders = orders?.length || 8
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 2450.00
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 3
      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 5

      setMetrics({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        totalProducts: prods?.length || 12
      })

      // Se não houver pedidos reais, criar fictícios
      if (!orders || orders.length === 0) {
        const mockOrders = [
          {
            id: 'mock-1',
            order_number: 'DEMO001',
            customer_name: 'Maria Silva',
            customer_phone: '(11) 98765-4321',
            total_amount: 85.00,
            status: 'pending',
            created_at: new Date().toISOString(),
            items: [
              { product_name: 'Bolo de Chocolate', quantity: 1, price: 85.00, options: 'Tamanho: Grande' }
            ]
          },
          {
            id: 'mock-2',
            order_number: 'DEMO002',
            customer_name: 'João Santos',
            customer_phone: '(11) 91234-5678',
            total_amount: 120.00,
            status: 'delivered',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            items: [
              { product_name: 'Bolo de Morango', quantity: 1, price: 90.00, options: 'Tamanho: Grande' },
              { product_name: 'Brigadeiro Gourmet', quantity: 6, price: 30.00, options: 'Sabor: Tradicional' }
            ]
          },
          {
            id: 'mock-3',
            order_number: 'DEMO003',
            customer_name: 'Ana Costa',
            customer_phone: '(11) 99876-5432',
            total_amount: 65.00,
            status: 'preparing',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            delivery_address: 'Rua das Flores, 123 - São Paulo',
            observations: 'Entregar após 18h',
            items: [
              { product_name: 'Brownie', quantity: 4, price: 65.00, options: 'Com nozes' }
            ]
          }
        ]
        setRecentOrders(mockOrders)
      }

    } catch (error) {
      console.error('Erro ao carregar dados demo:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as TabType, label: 'Produtos', icon: Package },
    { id: 'categories' as TabType, label: 'Categorias', icon: FolderOpen },
    { id: 'orders' as TabType, label: 'Pedidos', icon: ShoppingCart },
    { id: 'banners' as TabType, label: 'Banners', icon: Image },
    { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
  ]

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20">Carregando...</div>
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total de Pedidos', value: metrics?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
                { label: 'Receita Total', value: formatCurrency(metrics?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Pendentes', value: metrics?.pendingOrders || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                { label: 'Concluídos', value: metrics?.completedOrders || 0, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
              ].map((m) => (
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

            <Card className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
              </div>
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">#{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 mb-1">{formatCurrency(order.total_amount || 0)}</p>
                      <Badge className={ORDER_STATUS_COLORS[order.status]}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )

      case 'products':
        return (
          <>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Lista de Produtos</h2>
                <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed">
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </button>
              </div>
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      {product.images?.[0]?.url && (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category?.name}</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.base_price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowProductModal(true)
                        }}
                        className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Modal de Produto */}
            {showProductModal && selectedProduct && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setShowProductModal(false)}>
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl m-2 sm:m-0" onClick={(e) => e.stopPropagation()}>
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Detalhes do Produto</h2>
                    <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 rotate-45" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* Imagem */}
                    {selectedProduct.images?.[0]?.url && (
                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                        <img src={selectedProduct.images[0].url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Informações */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                        <input 
                          type="text" 
                          value={selectedProduct.name} 
                          disabled 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                          <input 
                            type="text" 
                            value={selectedProduct.category?.name || 'Sem categoria'} 
                            disabled 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preço Base</label>
                          <input 
                            type="text" 
                            value={formatCurrency(selectedProduct.base_price)} 
                            disabled 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                        <textarea 
                          value={selectedProduct.description || 'Sem descrição'} 
                          disabled 
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                          <span className="font-semibold">Modo demonstração:</span> Edição desabilitada
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
                        Salvar Alterações
                      </button>
                      <button className="px-4 py-2.5 border border-red-600 text-red-600 text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
                        Excluir Produto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )

      case 'orders':
        return (
          <>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Todos os Pedidos</h2>
                <span className="text-sm text-gray-500">{recentOrders.length} pedidos</span>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">#{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{order.customer_phone}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 mb-2">{formatCurrency(order.total_amount || 0)}</p>
                        <Badge className={ORDER_STATUS_COLORS[order.status]}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderModal(true)
                        }}
                        className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Modal de Pedido */}
            {showOrderModal && selectedOrder && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowOrderModal(false)}>
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Pedido #{selectedOrder.order_number}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                    <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Plus className="h-5 w-5 rotate-45" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status do Pedido</label>
                      <select 
                        disabled 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value={selectedOrder.status}>{ORDER_STATUS_LABELS[selectedOrder.status]}</option>
                      </select>
                    </div>

                    {/* Cliente */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Informações do Cliente</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-600 w-24">Nome:</span>
                          <span className="font-medium text-gray-900">{selectedOrder.customer_name}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">Telefone:</span>
                          <span className="font-medium text-gray-900">{selectedOrder.customer_phone}</span>
                        </div>
                        {selectedOrder.delivery_address && (
                          <div className="flex">
                            <span className="text-gray-600 w-24">Endereço:</span>
                            <span className="font-medium text-gray-900">{selectedOrder.delivery_address}</span>
                          </div>
                        )}
                        {selectedOrder.observations && (
                          <div className="flex">
                            <span className="text-gray-600 w-24">Observações:</span>
                            <span className="font-medium text-gray-900">{selectedOrder.observations}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Itens */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                      <div className="space-y-2">
                        {(selectedOrder.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{item.quantity}x {item.product_name}</p>
                              {item.options && <p className="text-xs text-gray-500 mt-1">{item.options}</p>}
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">Total do Pedido</span>
                        <span className="text-xl font-bold text-gray-900">{formatCurrency(selectedOrder.total_amount || 0)}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-700">
                        <span className="font-semibold">Modo demonstração:</span> Ações desabilitadas
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
                        Imprimir Pedido
                      </button>
                      <button className="flex-1 px-4 py-2.5 border border-gray-900 text-gray-900 text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
                        Enviar WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )

      case 'categories':
        return (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
              <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-1">{cat.name}</p>
                  <p className="text-sm text-gray-500">Posição: {cat.position}</p>
                </div>
              ))}
            </div>
          </Card>
        )

      case 'banners':
        return (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Banners da Loja</h2>
              <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed">
                <Plus className="h-4 w-4" />
                Novo Banner
              </button>
            </div>
            {banners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Posição: {banner.position}</span>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 opacity-50 cursor-not-allowed">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 opacity-50 cursor-not-allowed">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Nenhum banner cadastrado</p>
            )}
            <p className="text-xs text-gray-500 mt-4 italic">Modo demonstração - edição desabilitada</p>
          </Card>
        )

      case 'settings':
        return (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações da Loja</h2>
            <div className="space-y-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo da Loja</label>
                {storeData?.logo_url ? (
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-center">
                      <img src={storeData.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg opacity-50 cursor-not-allowed">
                      Alterar Logo
                    </button>
                  </div>
                ) : (
                  <button className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 opacity-50 cursor-not-allowed">
                    Upload de Logo
                  </button>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Loja</label>
                  <input 
                    type="text" 
                    value={storeData?.name || 'Doce Sabor Confeitaria'} 
                    disabled 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                  <input 
                    type="text" 
                    value={storeData?.slug || 'demo'} 
                    disabled 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea 
                  value={storeData?.description || 'Confeitaria artesanal com produtos frescos e deliciosos'} 
                  disabled 
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={storeData?.whatsapp_number || '(11) 99999-9999'} 
                    disabled 
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                    <input type="checkbox" checked={storeData?.whatsapp_enabled} disabled className="rounded text-gray-900 focus:ring-gray-900" />
                    <span className="text-sm text-gray-700">Ativo</span>
                  </label>
                </div>
              </div>

              {/* Cor Primária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                <div className="flex gap-3">
                  <input 
                    type="color" 
                    value={storeData?.primary_color || '#10b981'} 
                    disabled 
                    className="h-11 w-20 rounded-lg border border-gray-200 cursor-not-allowed"
                  />
                  <input 
                    type="text" 
                    value={storeData?.primary_color || '#10b981'} 
                    disabled 
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Entrega</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                    <input type="checkbox" checked={storeData?.delivery_enabled} disabled className="rounded text-gray-900 focus:ring-gray-900" />
                    <span className="text-sm text-gray-700">Entrega disponível</span>
                  </label>
                  <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                    <input type="checkbox" checked={storeData?.pickup_enabled} disabled className="rounded text-gray-900 focus:ring-gray-900" />
                    <span className="text-sm text-gray-700">Retirada no local</span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">Modo demonstração:</span> Edição desabilitada
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Tarja Superior Demo */}
      <div className="bg-blue-600 text-white py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">🎯 Loja Demonstração</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Explore todas as funcionalidades</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="/demo"
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
          >
            Ver Loja Demo
          </a>
          <a
            href="/"
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
          >
            Voltar para Home
          </a>
          <a
            href="/register"
            className="px-3 py-1 bg-white text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors"
          >
            Criar minha loja →
          </a>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - EXATAMENTE igual ao admin real */}
        <aside className="hidden lg:block w-64 bg-gray-950 text-white flex flex-col shrink-0">
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">Doce Sabor</p>
                <p className="text-xs text-gray-400">Painel Admin</p>
              </div>
            </div>
          </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                activeTab === item.id
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
        </aside>

        {/* Main content - EXATAMENTE igual ao admin real */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
