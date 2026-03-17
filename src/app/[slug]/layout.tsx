'use client'

import { CartProvider } from '@/contexts/CartContext'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
