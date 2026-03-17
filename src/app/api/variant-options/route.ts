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
    const { variant_id, name, price } = body

    if (!variant_id || !name || price === undefined) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Verificar permissão através do variant -> product -> store
    const { data: variant } = await supabase
      .from('product_variants')
      .select('product_id, products!inner(store_id)')
      .eq('id', variant_id)
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

    // Obter próxima posição
    const { data: existing } = await supabase
      .from('variant_options')
      .select('position')
      .eq('variant_id', variant_id)
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition = (existing?.[0]?.position ?? -1) + 1

    // Criar opção
    const { data, error } = await supabase
      .from('variant_options')
      .insert({ variant_id, name, price, position: nextPosition })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar opção:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...data, price: Number(data.price) })
  } catch (error: any) {
    console.error('Erro na API de opções:', error)
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
    const optionId = searchParams.get('id')

    if (!optionId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar permissão
    const { data: option } = await supabase
      .from('variant_options')
      .select('variant_id, product_variants!inner(product_id, products!inner(store_id))')
      .eq('id', optionId)
      .single()

    if (!option) {
      return NextResponse.json({ error: 'Opção não encontrada' }, { status: 404 })
    }

    const storeId = (option.product_variants as any).products.store_id

    const { data: storeUser } = await supabase
      .from('store_users')
      .select('store_id')
      .eq('user_id', user.id)
      .eq('store_id', storeId)
      .single()

    if (!storeUser) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    // Deletar opção
    const { error } = await supabase
      .from('variant_options')
      .delete()
      .eq('id', optionId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}
