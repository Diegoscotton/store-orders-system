'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button, Input } from '@/components/ui'
import { Store, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'master') {
        window.location.href = '/master'
      } else {
        window.location.href = '/admin'
      }
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end -mt-2">
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Esqueci minha senha
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Entrar
            </Button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">ou</span>
            </div>
          </div>

          {/* Botão Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Continuar com Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ainda não tem conta?{' '}
            <Link href="/register" className="text-gray-900 font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - decorative */}
      <div className="hidden lg:flex flex-1 bg-gray-950 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Sistema de Pedidos
          </h2>
          <p className="text-gray-400 text-lg">
            Gerencie sua loja, produtos e pedidos em um só lugar.
          </p>
        </div>
      </div>
    </div>
  )
}
