'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button, Input } from '@/components/ui'
import { Store, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    // Sempre mostra sucesso — não revelar se email existe
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>

          {!sent ? (
            <>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Esqueci minha senha</h1>
                  <p className="text-sm text-gray-500">Enviaremos um link para seu email</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  Enviar link de recuperação
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Verifique seu email</h2>
              <p className="text-gray-500 mb-8">
                Se este email estiver cadastrado, você receberá um link de recuperação em instantes.
              </p>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-900 hover:underline"
              >
                Voltar ao login
              </Link>
            </div>
          )}
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
