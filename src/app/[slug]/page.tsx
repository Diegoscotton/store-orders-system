import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import StoreClient from './StoreClient'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  // Get store
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !store) {
    notFound()
  }

  if (!store.is_active) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAF9', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          
          {/* Ícone estilo login */}
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          {/* Nome da loja */}
          <p style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{store.name}</p>

          {/* Título */}
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 12 }}>
            Loja temporariamente pausada
          </h1>

          {/* Descrição */}
          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.65, marginBottom: 8 }}>
            Esta loja está fora do ar no momento. Se você é o dono, reative sua loja para continuar recebendo pedidos.
          </p>
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 32 }}>
            Ficou sem acesso? Entre em contato e a gente resolve rapidinho. 👋
          </p>

          {/* Botão CTA */}
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16A34A', color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
            Conheça o Fosfo Pedidos
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>

        </div>
      </div>
    )
  }

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('position')

  // Get products with images and variants
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      images:product_images(id, url, position),
      variants:product_variants(
        id, name, position,
        options:variant_options(id, name, price, position)
      )
    `)
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('position')

  // Get banners
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('position')

  return (
    <StoreClient
      store={store}
      products={products || []}
      banners={banners || []}
      categories={categories || []}
    />
  )
}
