'use client'

import { useState, useEffect } from 'react'
import { Store as StoreIcon, ShoppingCart } from 'lucide-react'
import BannerCarousel from '@/components/store/BannerCarousel'
import ProductModal from '@/components/store/ProductModal'
import CartDrawer from '@/components/store/CartDrawer'
import { useCart } from '@/contexts/CartContext'
import type { Store, Product, Banner, Category, ProductVariant, VariantOption } from '@/types'

type ProductWithDetails = Product & {
  category?: { name: string } | null
  images?: Array<{ id: string; url: string; position: number }>
  variants?: Array<ProductVariant & {
    options: VariantOption[]
  }>
}

type Props = {
  store: Store
  products: ProductWithDetails[]
  banners: Banner[]
  categories: Category[]
}

function StoreContent({ store, products, banners, categories }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const { addItem, itemCount, openCart } = useCart()

  const primaryColor = store.primary_color || '#000000'

  // Check if filters overflow
  const checkOverflow = () => {
    const container = document.getElementById('filters-container')
    if (container) {
      setHasOverflow(container.scrollWidth > container.clientWidth)
    }
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [categories])

  const handleProductClick = (product: ProductWithDetails) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddToCart = (product: ProductWithDetails, selectedOptions: Record<string, VariantOption>, quantity: number) => {
    addItem(product, selectedOptions, quantity)
    
    // Trigger cart animation
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 600)
  }

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products

  const isDemo = store.slug === 'demo'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xl">🎯</span>
              <span className="font-medium">Catálogo Demonstração</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Explore todas as funcionalidades</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="/"
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                ← Voltar para Home
              </a>
              <a
                href="/demo-admin"
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                Ver Admin Demo
              </a>
              <a
                href="/register"
                className="inline-flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
              >
                Criar meu catálogo →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {store.logo_url ? (
              <div className="h-10 sm:h-12 flex items-center shrink-0 group cursor-pointer">
                <img src={store.logo_url} alt={store.name} className="max-h-full max-w-[150px] sm:max-w-[200px] object-contain transition-transform group-hover:scale-105" />
              </div>
            ) : (
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
                <StoreIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{store.name}</h1>
              {store.description && (
                <p className="text-xs sm:text-sm text-gray-500 hidden md:block line-clamp-1">{store.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className={`relative p-2.5 sm:p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                cartAnimation ? 'animate-bounce ring-4 ring-opacity-30' : ''
              }`}
              style={{ 
                backgroundColor: primaryColor, 
                color: 'white',
                boxShadow: `0 4px 14px ${primaryColor}40`
              }}
            >
              <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 sm:h-5 sm:w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Banners */}
      {banners && banners.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
          <BannerCarousel banners={banners} />
        </div>
      )}

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-6">
            <div id="filters-container" className="flex gap-2 overflow-x-auto py-2 pb-4 px-3 relative">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium shrink-0 transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === null
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                Todos os Produtos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium shrink-0 transition-all duration-200 transform hover:scale-105 ${
                    selectedCategory === cat.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <StoreIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Nenhum produto ainda</h2>
            <p className="text-gray-500">Esta loja ainda está sendo montada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const mainImage = product.images?.sort((a, b) => a.position - b.position)?.[0]?.url

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden flex-shrink-0">
                    {mainImage ? (
                      <img 
                        src={mainImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <StoreIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {product.category?.name && (
                      <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-1 rounded-full shadow-sm">
                        {product.category.name}
                      </span>
                    )}
                    {/* Quick view indicator */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ShoppingCart className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base group-hover:text-gray-800 transition-colors">{product.name}</h3>
                    {product.description && (
                      <p className="text-xs text-gray-500 mb-2 sm:mb-3 line-clamp-2 hidden sm:block flex-1">{product.description}</p>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </span>
                    </div>

                    {/* Add to cart button */}
                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex-shrink-0"
                      style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: `0 4px 12px ${primaryColor}40`
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(product)
                      }}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <a
            href="https://fosfo.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Powered by Fosfo
          </a>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        primaryColor={primaryColor}
      />

      {/* Cart Drawer */}
      <CartDrawer storeSlug={store.slug} primaryColor={primaryColor} />
    </div>
  )
}

export default function StoreClient(props: Props) {
  return <StoreContent {...props} />
}
