import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            try { cookieStore.set({ name, value, ...options }) } catch {}
          },
          remove(name: string, options: CookieOptions) {
            try { cookieStore.set({ name, value: '', ...options }) } catch {}
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Aguarda trigger handle_new_user() criar o profile
      await new Promise((r) => setTimeout(r, 800))

      // Verifica role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'master') {
        return NextResponse.redirect(new URL('/master', request.url))
      }

      // Verifica se já tem loja
      const { data: storeUser } = await supabase
        .from('store_users')
        .select('store_id')
        .eq('user_id', data.user.id)
        .single()

      if (!storeUser) {
        // Novo usuário Google sem loja — vai completar cadastro
        return NextResponse.redirect(new URL('/register/complete', request.url))
      }

      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.redirect(new URL('/login?error=oauth', request.url))
}
