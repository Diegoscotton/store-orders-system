'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product, VariantOption } from '@/types'

export type CartItem = {
  id: string
  product: Product & {
    category?: { name: string } | null
    images?: Array<{ id: string; url: string; position: number }>
  }
  selectedOptions: Record<string, VariantOption>
  quantity: number
  price: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: any, selectedOptions: Record<string, VariantOption>, quantity: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: any, selectedOptions: Record<string, VariantOption>, quantity: number) => {
    const price = product.price + Object.values(selectedOptions).reduce((sum, opt) => sum + (opt.price || 0), 0)
    
    // Generate unique ID based on product and selected options
    const optionsKey = Object.entries(selectedOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, opt]) => opt.id)
      .join('-')
    const itemId = `${product.id}-${optionsKey}`

    setItems(prev => {
      const existingItem = prev.find(item => item.id === itemId)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        return [...prev, {
          id: itemId,
          product,
          selectedOptions,
          quantity,
          price
        }]
      }
    })

    // Don't open cart automatically - let animation handle feedback
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
