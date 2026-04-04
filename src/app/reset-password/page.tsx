'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button, Input } from '@/components/ui'
import { Store, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Erro ao redefinir senha. O link pode ter expirado.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/admin')
    }, 2000)
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

          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nova senha</h1>
              <p className="text-sm text-gray-500">Digite sua nova senha abaixo</p>
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nova senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <Input
                label="Confirmar nova senha"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Redefinir senha
              </Button>
            </form>
          ) : (
            <div className="bg-green-50 text-green-700 px-4 py-4 rounded-xl text-sm text-center">
              ✅ Senha alterada com sucesso! Redirecionando...
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
