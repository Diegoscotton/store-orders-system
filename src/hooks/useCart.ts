'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CartItem } from '@/types'

const CART_KEY = 'pedidos-fosfo-cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        localStorage.removeItem(CART_KEY)
      }
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    if (items.length > 0) {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } else {
      localStorage.removeItem(CART_KEY)
    }
  }, [items, loaded])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      // Check store mismatch
      if (prev.length > 0 && prev[0].store_id !== item.store_id) {
        return prev // Don't add - store mismatch
      }

      // Check if same product + variant already in cart
      const existing = prev.find(
        (i) => i.product_id === item.product_id && i.variant_description === item.variant_description
      )

      if (existing) {
        return prev.map((i) =>
          i.product_id === item.product_id && i.variant_description === item.variant_description
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }

      return [...prev, item]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, variantDescription: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantDescription)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product_id === productId && i.variant_description === variantDescription
          ? { ...i, quantity }
          : i
      )
    )
  }, [])

  const removeItem = useCallback((productId: string, variantDescription: string | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product_id === productId && i.variant_description === variantDescription)
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_KEY)
  }, [])

  const isStoreMismatch = useCallback((storeId: string) => {
    return items.length > 0 && items[0].store_id !== storeId
  }, [items])

  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return {
    items,
    total,
    itemCount,
    loaded,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isStoreMismatch,
  }
}
