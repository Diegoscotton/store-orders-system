'use client'

import { useState, useEffect } from 'react'
import { getMasterUsers, deleteUser } from '@/services/masterService'
import { Button, Card, Modal, ModalContent, Input, useToast, Skeleton } from '@/components/ui'
import { Users, Store, User, MessageCircle, Trash2, ExternalLink, Search } from 'lucide-react'
import { formatDate, formatPhone } from '@/lib/utils'

type UserWithStore = {
  id: string
  full_name: string
  phone: string | null
  email?: string | null
  role: string
  created_at: string
  store: { name: string; slug: string } | null
}

export default function MasterUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<UserWithStore[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('')
  const [pendingDeleteUser, setPendingDeleteUser] = useState<UserWithStore | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getMasterUsers()
      console.log('users data:', data[0])
      setUsers(data)
    } catch (err) {
      console.error('loadUsers error:', err)
      toast({ type: 'error', title: 'Erro ao carregar usuários' })
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(user: UserWithStore) {
    setPendingDeleteUser(user)
    setDeleteConfirmInput('')
    setDeleteModalOpen(true)
  }

  async function handleDeleteUser() {
    if (!pendingDeleteUser || deleteConfirmInput !== pendingDeleteUser.full_name) return
    try {
      await deleteUser(pendingDeleteUser.id)
      toast({ type: 'success', title: 'Usuário excluído' })
      setUsers(prev => prev.filter(u => u.id !== pendingDeleteUser.id))
      setDeleteModalOpen(false)
      setPendingDeleteUser(null)
    } catch {
      toast({ type: 'error', title: 'Erro ao excluir usuário' })
    }
  }

  function getWhatsAppLink(phone: string) {
    const digits = phone.replace(/\D/g, '')
    return `https://wa.me/55${digits}` 
  }

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (u.store?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    ((u as any).email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 mt-1">{filteredUsers.length} de {users.length} usuário{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou loja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
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

      {!loading && filteredUsers.length === 0 && (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum usuário</h3>
          <p className="text-gray-500">Os usuários aparecerão aqui quando se registrarem</p>
        </Card>
      )}

      {!loading && filteredUsers.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loja vinculada</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name || '—'}</p>
                        <p className="text-xs text-gray-500">{(user as any).email || user.id.slice(0, 8) + '...'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {user.phone ? (
                      <a
                        href={getWhatsAppLink(user.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {formatPhone(user.phone)}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {user.store ? (
                      <a
                        href={`/${user.store.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                      >
                        <Store className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{user.store.name}</p>
                          <p className="text-xs text-gray-500">/{user.store.slug}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-blue-400 transition-colors" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Sem loja</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500">{formatDate(user.created_at)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {user.phone && (
                        <a href={getWhatsAppLink(user.phone)} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" title="Contato WhatsApp">
                            <MessageCircle className="h-4 w-4 text-emerald-500" />
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal(user)}
                        title="Excluir usuário"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Delete User Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent title="Excluir usuário permanentemente">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700 font-medium">⚠️ Esta ação é irreversível.</p>
              <p className="text-sm text-red-600 mt-1">O usuário e sua loja vinculada serão deletados permanentemente.</p>
            </div>
            <p className="text-sm text-gray-600">
              Para confirmar, digite o nome do usuário: <strong>{pendingDeleteUser?.full_name}</strong>
            </p>
            <Input
              placeholder="Digite o nome do usuário"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
            />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDeleteUser}
                disabled={deleteConfirmInput !== pendingDeleteUser?.full_name}
              >
                <Trash2 className="h-4 w-4" />
                Excluir permanentemente
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}
