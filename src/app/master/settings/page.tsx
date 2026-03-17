'use client'

import { useState, useEffect } from 'react'
import { getPlatformSettings, updatePlatformSetting } from '@/services/masterService'
import { Button, Input, Card, useToast } from '@/components/ui'
import { Settings, Save } from 'lucide-react'

export default function MasterSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const data = await getPlatformSettings()
      setSettings(data)
    } catch {
      toast({ type: 'error', title: 'Erro ao carregar configurações' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          updatePlatformSetting(key, value)
        )
      )
      toast({ type: 'success', title: 'Configurações salvas' })
    } catch {
      toast({ type: 'error', title: 'Erro ao salvar configurações' })
    } finally {
      setSaving(false)
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500 mt-1">Configurações globais da plataforma</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plataforma</h2>
          <div className="space-y-4">
            <Input
              label="Nome da plataforma"
              value={settings.platform_name || ''}
              onChange={(e) => updateSetting('platform_name', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trial</h2>
          <div className="space-y-4">
            <Input
              label="Dias de trial padrão"
              type="number"
              min="1"
              max="365"
              value={settings.default_trial_days || '14'}
              onChange={(e) => updateSetting('default_trial_days', e.target.value)}
              hint="Quantidade de dias que uma nova loja terá de trial gratuito"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loja Demo</h2>
          <div className="space-y-4">
            <Input
              label="Slug da loja demo"
              value={settings.demo_store_slug || 'demo'}
              onChange={(e) => updateSetting('demo_store_slug', e.target.value)}
              hint="O slug da loja que será usada como demonstração (ex: demo)"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
