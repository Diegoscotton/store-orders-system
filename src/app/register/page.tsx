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
