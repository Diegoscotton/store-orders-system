import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: { headers: req.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: req.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: req.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin routes
  if (!user && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Protect /master routes
  if (!user && req.nextUrl.pathname.startsWith('/master')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If logged in, check master role for /master routes
  if (user && req.nextUrl.pathname.startsWith('/master')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'master') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  // Redirect logged users away from login/register
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    // Check if master
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'master') {
      return NextResponse.redirect(new URL('/master', req.url))
    }
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/master/:path*', '/login', '/register'],
}
