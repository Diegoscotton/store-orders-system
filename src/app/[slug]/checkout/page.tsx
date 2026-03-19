'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Send } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import SuccessModal from '@/components/store/SuccessModal'
import { createClient } from '@/lib/supabase'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [store, setStore] = useState<any>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  const [needsDelivery, setNeedsDelivery] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    complement: '',
    observations: ''
  })

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  useEffect(() => {
    async function loadStore() {
      const supabase = createClient()
      const { data } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.slug)
        .single()
      
      if (data) {
        setStore(data)
      }
    }
    loadStore()
  }, [params.slug])

  useEffect(() => {
    if (items.length === 0 && !showSuccessModal && !orderData) {
      router.push(`/${params.slug}`)
    }
  }, [items, params.slug, router, showSuccessModal, orderData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Verificar se é loja demo
      if (params.slug === 'demo') {
        // Simular pedido para loja demo
        const mockOrderData = {
          id: 'demo-' + Date.now(),
          created_at: new Date().toISOString()
        }
        
        // Store order data for WhatsApp message (simulado)
        setOrderData({
          order: mockOrderData,
          formData,
          items,
          total,
          needsDelivery
        })
        
        // Clear cart and show success modal
        clearCart()
        setShowSuccessModal(true)
        return
      }

      // Create order in database
      const supabase = createClient()
      
      const orderData = {
        store_id: store.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: needsDelivery ? formData.address : null,
        delivery_complement: needsDelivery ? formData.complement : null,
        observations: formData.observations || null,
        total_amount: total,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          selected_options: Object.values(item.selectedOptions).map(opt => ({
            variant_name: opt.name,
            option_name: opt.name,
            price: opt.price || 0
          }))
        }))
      }

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar pedido:', error)
        throw new Error(`Erro ao salvar pedido: ${error.message}`)
      }


      
      // Store order data for WhatsApp message
      setOrderData({
        order,
        formData,
        items,
        total,
        needsDelivery
      })
      
      // Clear cart and show success modal
      clearCart()
      setShowSuccessModal(true)
      

      
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendWhatsApp = () => {
    if (!orderData || !store?.whatsapp_number || !store?.whatsapp_enabled) return

    const { order, formData, items, total, needsDelivery } = orderData
    const orderNumber = order.id.slice(0, 8).toUpperCase()
    
    let message = `*Novo Pedido/Orcamento #${orderNumber}*\n\n`
    message += `*Cliente:* ${formData.name}\n`
    message += `*Telefone:* ${formData.phone}\n\n`
    message += `*Itens do pedido:*\n`
    
    items.forEach((item: any) => {
      const optionsText = Object.values(item.selectedOptions)
        .map((opt: any) => opt.name)
        .join(', ')
      
      message += `- ${item.quantity}x ${item.product.name}`
      if (optionsText) {
        message += ` (${optionsText})`
      }
      message += ` - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}\n`
    })

    message += `\n*TOTAL: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}*\n\n`
    
    if (needsDelivery && formData.address) {
      message += `*Endereco de entrega:*\n${formData.address}`
      if (formData.complement) {
        message += `\n${formData.complement}`
      }
      message += '\n\n'
    }
    
    if (formData.observations) {
      message += `*Observacoes:*\n${formData.observations}`
    }

    const whatsappNumber = store.whatsapp_number.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

  }

  if (!store) return null

  const primaryColor = store.primary_color || '#000000'



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Finalizar pedido</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Seus dados</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>

                {/* Toggle for delivery address - only if enabled in store settings */}
                {store?.delivery_enabled && (
                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsDelivery}
                        onChange={(e) => setNeedsDelivery(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Preciso de entrega no endereço
                      </span>
                    </label>
                  </div>
                )}

                {/* Delivery address - conditional */}
                {needsDelivery && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço de entrega *
                      </label>
                      <Textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Rua, número, bairro, cidade"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <Input
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        placeholder="Apartamento, bloco, referência..."
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Alguma observação sobre o pedido?"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-4 text-base font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="h-5 w-5" />
                  Finalizar pedido/orçamento
                </Button>
                
                {store?.whatsapp_enabled && store?.whatsapp_number && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Seu pedido será encaminhado via WhatsApp
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do pedido</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const mainImage = item.product.images?.[0]?.url
                  const optionsText = Object.values(item.selectedOptions)
                    .map(opt => opt.name)
                    .join(', ')

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {mainImage ? (
                          <img src={mainImage} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {item.quantity}x {item.product.name}
                        </h3>
                        {optionsText && (
                          <p className="text-xs text-gray-500 truncate">{optionsText}</p>
                        )}
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          // Só redireciona quando usuário clicar em "Voltar para loja"
          router.push(`/${params.slug}`)
        }}
        onSendWhatsApp={handleSendWhatsApp}
        storeName={store?.name || 'Loja'}
        hasWhatsApp={!!(store?.whatsapp_number && store?.whatsapp_enabled)}
        isDemo={params.slug === 'demo'}
      />
    </div>
  )
}
