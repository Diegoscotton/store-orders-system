import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, name } = body

    if (!product_id || !name) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Verificar se o usuário tem acesso ao produto
    const { data: product } = await supabase
      .from('products')
      .select('store_id')
      .eq('id', product_id)
      .single()

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const { data: storeUser } = await supabase
      .from('store_users')
      .select('store_id')
      .eq('user_id', user.id)
      .eq('store_id', product.store_id)
      .single()

    if (!storeUser) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    // Obter próxima posição
    const { data: existing } = await supabase
      .from('product_variants')
      .select('position')
      .eq('product_id', product_id)
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition = (existing?.[0]?.position ?? -1) + 1

    // Criar variação
    const { data, error } = await supabase
      .from('product_variants')
      .insert({ product_id, name, position: nextPosition })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar variação:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro na API de variações:', error)
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const variantId = searchParams.get('id')

    if (!variantId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar permissão
    const { data: variant } = await supabase
      .from('product_variants')
      .select('product_id, products!inner(store_id)')
      .eq('id', variantId)
      .single()

    if (!variant) {
      return NextResponse.json({ error: 'Variação não encontrada' }, { status: 404 })
    }

    const { data: storeUser } = await supabase
      .from('store_users')
      .select('store_id')
      .eq('user_id', user.id)
      .eq('store_id', (variant.products as any).store_id)
      .single()

    if (!storeUser) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    // Deletar variação
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}
