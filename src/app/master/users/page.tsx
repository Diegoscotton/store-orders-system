'use client'

import { useState, useEffect } from 'react'
import { getMasterUsers } from '@/services/masterService'
import { Card, Badge, useToast, Skeleton } from '@/components/ui'
import { Users, Store, Calendar, Phone, User } from 'lucide-react'
import { formatDate, formatPhone } from '@/lib/utils'

type UserWithStore = {
  id: string
  full_name: string
  phone: string | null
  role: string
  created_at: string
  store: { name: string; slug: string } | null
}

export default function MasterUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<UserWithStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getMasterUsers()
      setUsers(data)
    } catch {
      toast({ type: 'error', title: 'Erro ao carregar usuários' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-500 mt-1">{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</p>
      </div>

      {loading && (
        <Card className="p-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          ))}
        </Card>
      )}

      {!loading && users.length === 0 && (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum usuário</h3>
          <p className="text-gray-500">Os usuários aparecerão aqui quando se registrarem</p>
        </Card>
      )}

      {!loading && users.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loja vinculada</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name || '—'}</p>
                        <p className="text-xs text-gray-500">{user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">
                      {user.phone ? formatPhone(user.phone) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {user.store ? (
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.store.name}</p>
                          <p className="text-xs text-gray-500">/{user.store.slug}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sem loja</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500">{formatDate(user.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
