'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product, ProductVariant, VariantOption } from '@/types'

type ProductWithDetails = Product & {
  category?: { name: string } | null
  images?: Array<{ id: string; url: string; position: number }>
  variants?: Array<ProductVariant & {
    options: VariantOption[]
  }>
}

type Props = {
  product: ProductWithDetails | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: ProductWithDetails, selectedOptions: Record<string, VariantOption>, quantity: number) => void
  primaryColor: string
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart, primaryColor }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, VariantOption>>({})
  const [quantity, setQuantity] = useState(1)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setSelectedOptions({})
      setQuantity(1)
    }
  }, [product])

  if (!isOpen || !product) return null

  const images = product.images?.sort((a, b) => a.position - b.position) || []
  
  // Filter variants that have active options
  const validVariants = product.variants?.filter(v => 
    v.options && v.options.some(o => o.is_active !== false)
  ) || []
  const hasVariants = validVariants.length > 0

  const calculatePrice = () => {
    let price = product.price
    Object.values(selectedOptions).forEach(option => {
      if (option.price) {
        price += option.price
      }
    })
    return price
  }

  const canAddToCart = () => {
    if (!hasVariants) return true
    return validVariants.every(variant => selectedOptions[variant.id])
  }

  const handleAddToCart = () => {
    if (!canAddToCart()) return
    onAddToCart(product, selectedOptions, quantity)
    onClose()
  }

  const handleSelectOption = (variantId: string, option: VariantOption) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantId]: option
    }))
  }

  // Swipe handlers for mobile carousel
  const minSwipeDistance = 50
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const nextImage = () => {
    if (selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header - only on mobile */}
        <div className="md:hidden sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 truncate flex-1 mr-3">{product.name}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-105 shrink-0"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Close button - only on desktop */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg items-center justify-center hover:bg-white transition-all hover:scale-110 border border-gray-200"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {/* Images */}
            <div className="space-y-4">
              {images.length > 0 ? (
                <div className="relative">
                  <div 
                    className="aspect-square bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shadow-inner group"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <img
                      src={images[selectedImage]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Navigation arrows - mobile */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110 border border-gray-200"
                          disabled={selectedImage === 0}
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110 border border-gray-200"
                          disabled={selectedImage === images.length - 1}
                        >
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        </button>
                      </>
                    )}
                    
                    {/* Image indicator dots */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              idx === selectedImage ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop thumbnails */}
                  {images.length > 1 && (
                    <div className="hidden md:flex gap-2 overflow-x-auto pb-2 px-1">
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(idx)}
                          className={`h-16 w-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 transform hover:scale-105 ${
                            idx === selectedImage 
                              ? 'border-gray-900 ring-2 ring-gray-900/20 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-gray-600 mb-4">{product.description}</p>
              )}

              <div className="text-3xl font-bold text-gray-900 mb-6">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatePrice())}
              </div>

              {/* Variants */}
              {hasVariants && (
                <div className="space-y-4 mb-6">
                  {validVariants.sort((a, b) => a.position - b.position).map(variant => (
                    <div key={variant.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {variant.name}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {variant.options?.filter(o => o.is_active !== false).sort((a, b) => a.position - b.position).map(option => {
                          const isSelected = selectedOptions[variant.id]?.id === option.id
                          return (
                            <button
                              key={option.id}
                              onClick={() => handleSelectOption(variant.id, option)}
                              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                isSelected
                                  ? 'border-gray-900 bg-gray-900 text-white'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <div>{option.name}</div>
                              {option.price && option.price > 0 && (
                                <div className="text-xs opacity-75">
                                  +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantidade
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                    <div className="text-xs text-gray-500">unidade{quantity !== 1 ? 's' : ''}</div>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Add to cart - sticky on mobile */}
              <div className="md:hidden sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 -mx-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart()}
                  className={`w-full py-3 text-base font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    canAddToCart()
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ 
                    backgroundColor: canAddToCart() ? primaryColor : undefined,
                    boxShadow: canAddToCart() ? `0 8px 24px ${primaryColor}40` : undefined
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {canAddToCart() ? 'Adicionar ao carrinho' : 'Selecione as opções'}
                </button>
              </div>

              {/* Total preview - mobile */}
                {canAddToCart() && (
                  <div className="text-center bg-gray-50 rounded-lg p-2 -mx-4">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatePrice() * quantity)}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to cart - desktop version */}
              <div className="hidden md:block space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart()}
                  className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    canAddToCart()
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ 
                    backgroundColor: canAddToCart() ? primaryColor : undefined,
                    boxShadow: canAddToCart() ? `0 8px 24px ${primaryColor}40` : undefined
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {canAddToCart() ? 'Adicionar ao carrinho' : 'Selecione as opções'}
                </button>

                {/* Total preview */}
                {canAddToCart() && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculatePrice() * quantity)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
