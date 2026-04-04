import { createClient } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    console.log('[DELETE USER] Iniciando exclusão de usuário')
    
    // 1. Verificar que quem chama é master — usa server client (lê cookies)
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('[DELETE USER] Unauthorized - sem usuário logado')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'master') {
      console.log('[DELETE USER] Forbidden - usuário não é master')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Pegar userId do body
    const { userId } = await request.json()
    if (!userId) {
      console.log('[DELETE USER] userId não fornecido')
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    console.log('[DELETE USER] Deletando usuário:', userId)

    // 3. Validar e usar service_role para operações destrutivas
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey) {
      console.error('[DELETE USER] SUPABASE_SERVICE_ROLE_KEY não encontrada!')
      return NextResponse.json({ error: 'Service role key não configurada' }, { status: 500 })
    }

    if (!supabaseUrl) {
      console.error('[DELETE USER] NEXT_PUBLIC_SUPABASE_URL não encontrada!')
      return NextResponse.json({ error: 'Supabase URL não configurada' }, { status: 500 })
    }

    console.log('[DELETE USER] Service role key presente:', serviceRoleKey.substring(0, 20) + '...')
    console.log('[DELETE USER] Supabase URL:', supabaseUrl)

    const adminSupabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // 4. Deletar loja vinculada — busca por owner_id primeiro
    console.log('[DELETE USER] Buscando lojas vinculadas...')
    const { data: ownedStores } = await adminSupabase
      .from('stores')
      .select('id')
      .eq('owner_id', userId)

    if (ownedStores && ownedStores.length > 0) {
      console.log('[DELETE USER] Encontradas', ownedStores.length, 'lojas por owner_id')
      for (const store of ownedStores) {
        console.log('[DELETE USER] Deletando loja:', store.id)
        await adminSupabase.from('stores').delete().eq('id', store.id)
      }
    } else {
      console.log('[DELETE USER] Nenhuma loja encontrada por owner_id, tentando store_users...')
      // Fallback: busca via store_users
      const { data: storeUser } = await adminSupabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', userId)
        .single()
      if (storeUser?.store_id) {
        console.log('[DELETE USER] Deletando loja via store_users:', storeUser.store_id)
        await adminSupabase.from('stores').delete().eq('id', storeUser.store_id)
      } else {
        console.log('[DELETE USER] Nenhuma loja vinculada encontrada')
      }
    }

    // 5. Deletar o profile
    console.log('[DELETE USER] Deletando profile...')
    const { error: profileError } = await adminSupabase.from('profiles').delete().eq('id', userId)
    if (profileError) {
      console.error('[DELETE USER] Erro ao deletar profile:', profileError)
    }

    // 6. Deletar de auth.users permanentemente
    console.log('[DELETE USER] Deletando de auth.users...')
    const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(userId)
    if (deleteAuthError) {
      console.error('[DELETE USER] Erro ao deletar de auth.users:', deleteAuthError)
      throw deleteAuthError
    }

    console.log('[DELETE USER] Usuário deletado com sucesso!')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DELETE USER] Erro fatal:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
