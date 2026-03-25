'use client'

import { useState, useEffect } from 'react'
import { getMasterStores, toggleStoreActive, extendStoreTrial, setStoreFree } from '@/services/masterService'
import type { StoreWithOwner } from '@/services/masterService'
import { Button, Card, Badge, Modal, ModalContent, Input, useToast, Skeleton } from '@/components/ui'
import { Store, Eye, ExternalLink, Power, PowerOff, Clock, Package, ShoppingCart, Calendar, User, Phone, Mail, Gift, X } from 'lucide-react'
import { formatDate, formatPhone, getTrialDaysLeft } from '@/lib/utils'

export default function MasterStoresPage() {
  const { toast } = useToast()
  const [stores, setStores] = useState<StoreWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<StoreWithOwner | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [trialDays, setTrialDays] = useState('30')
  const [trialModalOpen, setTrialModalOpen] = useState(false)
  const [trialStoreId, setTrialStoreId] = useState<string | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [pendingStoreId, setPendingStoreId] = useState<string | null>(null)
  const [pendingActive, setPendingActive] = useState<boolean>(false)

  useEffect(() => {
    loadStores()
  }, [])

  async function loadStores() {
    try {
      setLoading(true)
      const data = await getMasterStores()
      setStores([])
      await new Promise(resolve => setTimeout(resolve, 100))
      setStores(data)
    } catch {
      toast({ type: 'error', title: 'Erro ao carregar lojas' })
    } finally {
      setLoading(false)
    }
  }

  function confirmToggle(store: StoreWithOwner) {
    const newState = !store.is_active
    const action = newState ? 'ativar' : 'desativar'
    setConfirmMessage(`Tem certeza que deseja ${action} a loja "${store.name}"?`)
    setPendingStoreId(store.id)
    setPendingActive(newState)
    setConfirmModalOpen(true)
  }

  async function handleConfirmToggle() {
    if (!pendingStoreId) return
    try {
      await toggleStoreActive(pendingStoreId, pendingActive)
      toast({ type: 'success', title: `Loja ${pendingActive ? 'ativada' : 'desativada'}` })
      setStores(prev => prev.map(s =>
        s.id === pendingStoreId ? { ...s, is_active: pendingActive } : s
      ))
    } catch {
      toast({ type: 'error', title: 'Erro ao alterar loja' })
    }
    setConfirmModalOpen(false)
    setPendingStoreId(null)
  }

  async function handleToggleFree(store: StoreWithOwner) {
    const newState = !store.is_free
    try {
      await setStoreFree(store.id, newState)
      toast({ type: 'success', title: newState ? 'Loja marcada como Free' : 'Free removido da loja' })
      setStores(prev => prev.map(s => 
        s.id === store.id ? { ...s, is_free: newState } : s
      ))
    } catch {
      toast({ type: 'error', title: 'Erro ao alterar status Free' })
    }
  }

  function openTrialModal(storeId: string) {
    setTrialStoreId(storeId)
    setTrialDays('30')
    setTrialModalOpen(true)
  }

  async function handleExtendTrial() {
    if (!trialStoreId) return
    try {
      await extendStoreTrial(trialStoreId, parseInt(trialDays) || 30)
      toast({ type: 'success', title: `Trial estendido por ${trialDays} dias` })
      setTrialModalOpen(false)
      await new Promise(resolve => setTimeout(resolve, 500))
      await loadStores()
    } catch {
      toast({ type: 'error', title: 'Erro ao estender trial' })
    }
  }

  function openDetails(store: StoreWithOwner) {
    setSelectedStore(store)
    setDetailsOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lojas</h1>
          <p className="text-gray-500 mt-1">{stores.length} loja{stores.length !== 1 ? 's' : ''} cadastrada{stores.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading && (
        <Card className="p-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </Card>
      )}

      {!loading && stores.length === 0 && (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhuma loja cadastrada</h3>
          <p className="text-gray-500">As lojas aparecerão aqui quando usuários se registrarem</p>
        </Card>
      )}

      {!loading && stores.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loja</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dono</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produtos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trial</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((store) => {
                const daysLeft = getTrialDaysLeft(store.trial_ends_at)
                const isExpired = daysLeft === 0
                const isExpiring = daysLeft > 0 && daysLeft <= 10
                const showExpiredBadge = isExpired && !store.is_free && store.is_active

                return (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: store.primary_color || '#000' }}
                        >
                          {store.logo_url ? (
                            <img src={store.logo_url} alt="" className="h-full w-full rounded-xl object-cover" />
                          ) : (
                            <Store className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{store.name}</p>
                          <p className="text-xs text-gray-500">/{store.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{store.owner?.full_name || '—'}</p>
                      <p className="text-xs text-gray-500">{store.owner?.phone ? formatPhone(store.owner.phone) : '—'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{store.product_count}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{store.order_count}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {store.is_free ? (
                          <Badge variant="success">Free</Badge>
                        ) : showExpiredBadge ? (
                          <Badge variant="danger">Trial expirado</Badge>
                        ) : isExpiring ? (
                          <Badge variant="warning">Expira em {daysLeft} dia{daysLeft !== 1 ? 's' : ''}</Badge>
                        ) : (
                          <Badge variant="success">{daysLeft} dias</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {store.is_active ? (
                        <Badge variant="success">Ativa</Badge>
                      ) : (
                        <Badge variant="danger">Inativa</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDetails(store)} title="Detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <a
                          href={`/${store.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon" title="Ver loja">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmToggle(store)}
                          title={store.is_active ? 'Desativar' : 'Ativar'}
                        >
                          {store.is_active ? (
                            <PowerOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Power className="h-4 w-4 text-emerald-500" />
                          )}
                        </Button>
                        {!store.is_free ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFree(store)}
                            title="Tornar Free"
                          >
                            <Gift className="h-3.5 w-3.5" />
                            Tornar Free
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFree(store)}
                            title="Remover Free"
                          >
                            <X className="h-3.5 w-3.5" />
                            Remover Free
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTrialModal(store.id)}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Trial
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Store Details Modal */}
      <Modal open={detailsOpen} onOpenChange={setDetailsOpen}>
        <ModalContent title={selectedStore?.name || 'Detalhes'} className="max-w-lg">
          {selectedStore && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Produtos</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedStore.product_count}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Pedidos</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedStore.order_count}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-medium text-gray-900 mb-3">Informações do dono</h3>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{selectedStore.owner?.full_name || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{selectedStore.owner?.id || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{selectedStore.owner?.phone ? formatPhone(selectedStore.owner.phone) : '—'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-medium text-gray-900 mb-3">Detalhes da loja</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">/{selectedStore.slug}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Criada em {formatDate(selectedStore.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    Trial: {getTrialDaysLeft(selectedStore.trial_ends_at)} dias restantes
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a href={`/${selectedStore.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    Ver loja
                  </Button>
                </a>
                <Button
                  variant={selectedStore.is_active ? 'danger' : 'primary'}
                  className="flex-1"
                  onClick={() => {
                    confirmToggle(selectedStore)
                    setDetailsOpen(false)
                  }}
                >
                  {selectedStore.is_active ? (
                    <><PowerOff className="h-4 w-4" /> Desativar</>
                  ) : (
                    <><Power className="h-4 w-4" /> Ativar</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Trial Extension Modal */}
      <Modal open={trialModalOpen} onOpenChange={setTrialModalOpen}>
        <ModalContent title="Estender trial">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Defina quantos dias de trial a loja terá a partir de hoje.
            </p>
            <Input
              label="Dias de trial"
              type="number"
              min="1"
              max="365"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
            />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setTrialModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleExtendTrial}>
                Estender trial
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <ModalContent title="Confirmar ação">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{confirmMessage}</p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleConfirmToggle}>
                Confirmar
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}
