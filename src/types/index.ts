// ============================================
// PROFILES
// ============================================
export type UserRole = 'admin' | 'master'

export type Profile = {
  id: string
  full_name: string
  phone: string | null
  email?: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ============================================
// STORES
// ============================================
export type Store = {
  id: string
  name: string
  slug: string
  description: string | null
  owner_id: string
  logo_url: string | null
  primary_color: string
  whatsapp_number: string | null
  whatsapp_enabled: boolean
  delivery_enabled: boolean
  is_active: boolean
  trial_ends_at: string | null
  is_free: boolean
  created_at: string
  updated_at: string
}

export type StoreWithOwner = Store & {
  owner: Profile
}

// ============================================
// CATEGORIES
// ============================================
export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  position: number
  is_active: boolean
  store_id: string
  created_at: string
  updated_at: string
}

// ============================================
// PRODUCTS
// ============================================
export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  store_id: string
  is_active: boolean
  position: number
  created_at: string
  updated_at: string
  // Joined data
  category?: Category | null
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  position: number
  created_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  name: string
  position: number
  created_at: string
  options?: VariantOption[]
}

export type VariantOption = {
  id: string
  variant_id: string
  name: string
  price: number
  position: number
  created_at: string
}

// ============================================
// BANNERS
// ============================================
export type Banner = {
  id: string
  store_id: string
  image_url: string
  title: string | null
  link_url: string | null
  position: number
  is_active: boolean
  created_at: string
}

// ============================================
// ORDERS
// ============================================
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  order_number: number
  customer_name: string
  customer_phone: string
  customer_address: string | null
  delivery_address: string | null
  delivery_complement: string | null
  observations: string | null
  notes: string | null
  total: number
  total_amount: number
  status: OrderStatus
  whatsapp_sent: boolean
  store_id: string
  created_at: string
  updated_at: string
  // Joined data
  items?: any[] | OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  variant_description: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

// ============================================
// CART (client-side)
// ============================================
export type CartItem = {
  product_id: string
  product_name: string
  product_image: string | null
  variant_description: string | null
  unit_price: number
  quantity: number
  store_id: string
}

// ============================================
// PLATFORM
// ============================================
export type PlatformSetting = {
  id: string
  key: string
  value: string
  updated_at: string
}

// ============================================
// STATUS LABELS
// ============================================
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}
