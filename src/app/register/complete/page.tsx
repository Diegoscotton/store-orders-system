'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button, Input } from '@/components/ui'
import { Store } from 'lucide-react'
import { generateSlug } from '@/lib/utils'

export default function CompleteRegisterPage() {
  const [storeName, setStoreName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userName, setUserName] = useState('')

  const slug = generateSlug(storeName)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }
    }
    loadUser()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não encontrado')

      // Criar loja
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({ name: storeName, slug, owner_id: user.id })
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

      // Vincular usuário à loja
      const { error: linkError } = await supabase
        .from('store_users')
        .insert({ user_id: user.id, store_id: store.id, role: 'admin' })

      if (linkError) throw linkError

      window.location.href = '/admin'
    } catch (err: any) {
      setError(err.message || 'Erro ao criar loja. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userName ? `Olá, ${userName.split(' ')[0]}!` : 'Quase lá!'}
              </h1>
              <p className="text-sm text-gray-500">Escolha o nome do seu catálogo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome do seu catálogo"
              type="text"
              placeholder="Ex: Açaí Central"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              hint={slug ? `Seu catálogo ficará em: seusite.com/${slug}` : undefined}
              required
            />

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Criar meu catálogo
            </Button>
          </form>
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
              { n: '1', title: 'Crie sua conta', desc: 'Feito! Você entrou com o Google.' },
              { n: '2', title: 'Nomeie seu catálogo', desc: 'Escolha um nome para sua loja online.' },
              { n: '3', title: 'Cadastre seus produtos', desc: 'Adicione fotos, preços e variações.' },
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
