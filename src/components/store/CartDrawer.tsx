'use client'

import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
  storeSlug: string
  primaryColor: string
}

export default function CartDrawer({ storeSlug, primaryColor }: Props) {
  const { items, removeItem, updateQuantity, total, isOpen, closeCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Carrinho</h2>
          <button
            onClick={closeCart}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Carrinho vazio</h3>
              <p className="text-gray-500 text-sm">Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const mainImage = item.product.images?.[0]?.url
                const optionsText = Object.values(item.selectedOptions)
                  .map(opt => opt.name)
                  .join(', ')

                return (
                  <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                    {/* Image */}
                    <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {mainImage ? (
                        <img src={mainImage} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {item.product.name}
                      </h3>
                      {optionsText && (
                        <p className="text-xs text-gray-500 mb-2">{optionsText}</p>
                      )}
                      <p className="text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
            </div>
            <Link href={`/${storeSlug}/checkout`} onClick={closeCart}>
              <Button
                className="w-full py-4 text-base font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                Finalizar pedido
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
