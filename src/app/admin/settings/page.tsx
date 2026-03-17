'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { updateStore, uploadStoreAsset } from '@/services/storeService'
import { Button, Input, Textarea, Card, useToast, PhoneInput } from '@/components/ui'
import { generateSlug, formatWhatsAppLink, maskPhone, unmaskPhone } from '@/lib/utils'
import { Upload, X, ExternalLink, MessageCircle, Store as StoreIcon } from 'lucide-react'

export default function SettingsPage() {
  const { store, refresh } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (store) {
      setName(store.name)
      setSlug(store.slug)
      setDescription(store.description || '')
      setPrimaryColor(store.primary_color || '#000000')
      setWhatsappNumber(store.whatsapp_number ? maskPhone(store.whatsapp_number) : '')
      setWhatsappEnabled(store.whatsapp_enabled)
      setDeliveryEnabled(store.delivery_enabled || false)
      setLogoUrl(store.logo_url)
    }
  }, [store])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!store) return

    setSaving(true)
    try {
      await updateStore(store.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        primary_color: primaryColor,
        whatsapp_number: unmaskPhone(whatsappNumber) || null,
        whatsapp_enabled: whatsappEnabled,
        delivery_enabled: deliveryEnabled,
      } as any)
      toast({ type: 'success', title: 'Configurações salvas' })
      await refresh()
    } catch (err: any) {
      if (err.message?.includes('duplicate key') && err.message?.includes('slug')) {
        toast({ type: 'error', title: 'Este slug já está em uso' })
      } else {
        toast({ type: 'error', title: 'Erro ao salvar', description: err.message })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!store || !e.target.files?.[0]) return
    setUploadingLogo(true)
    try {
      const url = await uploadStoreAsset(e.target.files[0], store.id, 'logo')
      await updateStore(store.id, { logo_url: url } as any)
      setLogoUrl(url)
      toast({ type: 'success', title: 'Logo atualizado' })
      await refresh()
    } catch {
      toast({ type: 'error', title: 'Erro ao enviar logo' })
    } finally {
      setUploadingLogo(false)
      if (logoRef.current) logoRef.current.value = ''
    }
  }

  if (!store) return null

  const sampleMessage = `🧾 *Novo Pedido #123*\n\n👤 João Silva\n📞 (54) 99999-9999\n\n📦 Itens:\n• 2x Pizza Calabresa (Grande) - R$ 90,00\n• 1x Coca-Cola 2L - R$ 12,00\n\n💰 *Total: R$ 102,00*\n\n📍 Rua Exemplo, 123\n📝 Obs: Sem cebola`

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Personalize sua loja</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Dados da loja */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados da loja</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Nome da loja"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setSlug(generateSlug(e.target.value))
                }}
                required
              />
              <Input
                label="Slug (URL)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                hint={`Sua loja: seusite.com/${slug}`}
                required
              />
              <Textarea
                label="Descrição"
                placeholder="Descreva sua loja em poucas palavras..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </form>
          </Card>

          {/* Visual */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visual</h2>
            <div className="space-y-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <p className="text-xs text-gray-500 mb-2">Logo horizontal usado no header da loja</p>
                <div className="flex items-start gap-4">
                  {logoUrl && (
                    <div className="h-16 w-48 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                      <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoRef.current?.click()}
                      loading={uploadingLogo}
                    >
                      <Upload className="h-4 w-4" />
                      {logoUrl ? 'Trocar logo' : 'Enviar logo'}
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG. Recomendado: 400x100px ou formato horizontal</p>
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>

              {/* Primary color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor primária</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#000000"
                    className="w-32"
                  />
                  <div
                    className="h-10 flex-1 rounded-xl"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* WhatsApp */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <MessageCircle className="h-5 w-5 inline mr-2" />
              WhatsApp
            </h2>
            <div className="space-y-4">
              <PhoneInput
                label="Número do WhatsApp"
                value={whatsappNumber}
                onChange={setWhatsappNumber}
                hint="Este número receberá os pedidos dos clientes via WhatsApp"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${whatsappEnabled ? 'bg-emerald-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${whatsappEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-700">
                  {whatsappEnabled ? 'Envio por WhatsApp ativado' : 'Envio por WhatsApp desativado'}
                </span>
              </div>

              {whatsappEnabled && whatsappNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview da mensagem</label>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <pre className="text-sm text-emerald-900 whitespace-pre-wrap font-sans">{sampleMessage}</pre>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Delivery */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Entrega</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${deliveryEnabled ? 'bg-gray-900' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${deliveryEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-700">
                  {deliveryEnabled ? 'Opção de entrega habilitada' : 'Opção de entrega desabilitada'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Quando habilitado, o cliente poderá informar endereço de entrega no checkout
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar - Preview */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-4" style={{ borderTop: `3px solid ${primaryColor}` }}>
                <div className="flex flex-col gap-3 mb-2">
                  {logoUrl ? (
                    <div className="h-12 flex items-center">
                      <img src={logoUrl} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-12 flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                      <StoreIcon className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{name || 'Nome da loja'}</p>
                    <p className="text-xs text-gray-500">{description || 'Descrição...'}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 w-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 w-16 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>
            <a
              href={`/${store?.slug}`}
              target="_blank"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver loja ao vivo
            </a>
          </Card>
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Cancelar
          </Button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            {saving && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  )
}
