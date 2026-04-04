'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button, Input, PhoneInput } from '@/components/ui'
import { Store, ArrowLeft } from 'lucide-react'
import { generateSlug, unmaskPhone } from '@/lib/utils'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [storeName, setStoreName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const slug = generateSlug(storeName)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    try {
      // 1. Create auth user (trigger creates profile automatically)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: unmaskPhone(phone),
            role: 'admin',
          },
        },
      })

      if (authError) {
        if (authError.message?.includes('already registered')) {
          setError('Este email já está cadastrado. Tente fazer login.')
          setLoading(false)
          return
        }
        throw authError
      }
      if (!authData.user) throw new Error('Erro ao criar conta')

      // Small delay to ensure the trigger has time to create the profile
      await new Promise((r) => setTimeout(r, 500))

      // 2. Create store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({
          name: storeName,
          slug,
          owner_id: authData.user.id,
        })
        .select()
        .single()

      if (storeError) {
        if (storeError.message?.includes('duplicate key') && storeError.message?.includes('slug')) {
          setError('Já existe uma loja com este nome. Tente outro nome.')
          setLoading(false)
          return
        }
        throw storeError
      }

      // 3. Link user to store
      const { error: linkError } = await supabase
        .from('store_users')
        .insert({
          user_id: authData.user.id,
          store_id: store.id,
          role: 'admin',
        })

      if (linkError) throw linkError

      // Redirect to admin
      window.location.href = '/admin'
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Erro ao criar conta. Tente novamente.')
      setLoading(false)
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
              <p className="text-sm text-gray-500">Configure sua loja em minutos</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Seu nome"
              type="text"
              placeholder="João Silva"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PhoneInput
              label="Telefone (WhatsApp)"
              value={phone}
              onChange={setPhone}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <div className="border-t border-gray-100 pt-4 mt-4">
              <Input
                label="Nome da sua loja"
                type="text"
                placeholder="Ex: Açaí Central"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                hint={slug ? `Sua loja ficará em: seusite.com/${slug}` : undefined}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Criar minha loja
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
            Já tem conta?{' '}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - decorative */}
      <div className="hidden lg:flex flex-1 bg-gray-950 items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6">
            Em 3 passos simples
          </h2>
          <div className="space-y-6">
            {[
              { n: '1', title: 'Crie sua conta', desc: 'Preencha seus dados e escolha o nome da loja' },
              { n: '2', title: 'Cadastre produtos', desc: 'Adicione fotos, preços e variações' },
              { n: '3', title: 'Receba pedidos', desc: 'Compartilhe o link e comece a vender' },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">{step.n}</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
