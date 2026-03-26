'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/services/bannerService'
import { Button, Card, Badge, useToast, Skeleton } from '@/components/ui'
import { Plus, Trash2, Image as ImageIcon, Eye, EyeOff, Upload, ArrowUp, ArrowDown } from 'lucide-react'
import type { Banner } from '@/types'

export default function BannersPage() {
  const { store } = useAuth()
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (store) loadBanners()
  }, [store])

  async function loadBanners() {
    if (!store) return
    try {
      setLoading(true)
      const data = await getBanners(store.id)
      setBanners(data)
    } catch {
      toast({ type: 'error', title: 'Erro ao carregar banners' })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!store || !e.target.files?.[0]) return
    setUploading(true)
    try {
      await createBanner(store.id, e.target.files[0])
      toast({ type: 'success', title: 'Banner adicionado' })
      await loadBanners()
    } catch {
      toast({ type: 'error', title: 'Erro ao enviar banner' })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleToggle(banner: Banner) {
    try {
      await updateBanner(banner.id, { is_active: !banner.is_active })
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
      )
      toast({ type: 'success', title: banner.is_active ? 'Banner desativado' : 'Banner ativado' })
    } catch {
      toast({ type: 'error', title: 'Erro ao atualizar banner' })
    }
  }

  async function handleDelete(banner: Banner) {
    if (!confirm('Excluir este banner?')) return
    try {
      await deleteBanner(banner.id)
      toast({ type: 'success', title: 'Banner excluído' })
      await loadBanners()
    } catch {
      toast({ type: 'error', title: 'Erro ao excluir banner' })
    }
  }

  async function handleMove(banner: Banner, direction: 'up' | 'down') {
    const idx = banners.findIndex((b) => b.id === banner.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= banners.length) return

    const other = banners[swapIdx]
    try {
      await updateBanner(banner.id, { position: other.position })
      await updateBanner(other.id, { position: banner.position })
      await loadBanners()
    } catch {
      toast({ type: 'error', title: 'Erro ao reordenar' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-500 mt-1">Gerencie os banners do seu catálogo</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-2 inline-block">
            <p className="text-sm text-gray-700 font-medium">📐 Dimensão recomendada: 1200x400px (ratio 3:1)</p>
          </div>
        </div>
        <Button onClick={() => fileRef.current?.click()} loading={uploading}>
          <Plus className="h-4 w-4" />
          Novo banner
        </Button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {loading && (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-0 overflow-hidden">
              <Skeleton className="h-40 w-full" />
            </Card>
          ))}
        </div>
      )}

      {!loading && banners.length === 0 && (
        <Card className="text-center py-16">
          <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum banner</h3>
          <p className="text-gray-500 mb-2">Adicione banners para destacar promoções no seu catálogo</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mx-auto inline-block mb-6">
            <p className="text-sm text-gray-700 font-medium">📐 Dimensão recomendada: 1200x400px (ratio 3:1)</p>
          </div>
          <Button onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Enviar primeiro banner
          </Button>
        </Card>
      )}

      {!loading && banners.length > 0 && (
        <div className="space-y-4">
          {banners.map((banner, idx) => (
            <Card key={banner.id} className="p-0 overflow-hidden">
              <div className="flex">
                {/* Image preview */}
                <div className="w-48 h-28 shrink-0 bg-gray-100">
                  <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {banner.title || `Banner ${idx + 1}`}
                    </p>
                    <Badge variant={banner.is_active ? 'success' : 'warning'} className="mt-1">
                      {banner.is_active ? (
                        <><Eye className="h-3 w-3 mr-1" /> Ativo</>
                      ) : (
                        <><EyeOff className="h-3 w-3 mr-1" /> Inativo</>
                      )}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleMove(banner, 'up')} disabled={idx === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleMove(banner, 'down')} disabled={idx === banners.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggle(banner)}>
                      {banner.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(banner)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
