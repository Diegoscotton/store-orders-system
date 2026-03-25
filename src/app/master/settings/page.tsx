'use client'

import { useState, useEffect } from 'react'
import { getPlatformSettings, updatePlatformSetting } from '@/services/masterService'
import { Button, Input, Card, useToast } from '@/components/ui'
import { Check, X, Loader2 } from 'lucide-react'

type FieldState = 'idle' | 'saving' | 'success' | 'error'

export default function MasterSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({})

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

  async function saveSetting(key: string, value: string) {
    setFieldStates((prev) => ({ ...prev, [key]: 'saving' }))
    try {
      await updatePlatformSetting(key, value)
      setFieldStates((prev) => ({ ...prev, [key]: 'success' }))
      
      if (key === 'default_trial_days') {
        toast({ 
          type: 'success', 
          title: 'Dias de trial atualizados',
          description: 'O novo prazo vale apenas para novas lojas cadastradas a partir de agora'
        })
      } else {
        toast({ type: 'success', title: 'Configuração salva' })
      }
      
      setTimeout(() => {
        setFieldStates((prev) => ({ ...prev, [key]: 'idle' }))
      }, 2000)
    } catch {
      setFieldStates((prev) => ({ ...prev, [key]: 'error' }))
      toast({ type: 'error', title: 'Erro ao salvar' })
      setTimeout(() => {
        setFieldStates((prev) => ({ ...prev, [key]: 'idle' }))
      }, 2000)
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function renderFieldIcon(key: string) {
    const state = fieldStates[key] || 'idle'
    if (state === 'saving') return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    if (state === 'success') return <Check className="h-4 w-4 text-green-500" />
    if (state === 'error') return <X className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500 mt-1">Configurações globais da plataforma</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plataforma</h2>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Nome da plataforma"
                  value={settings.platform_name || ''}
                  onChange={(e) => updateSetting('platform_name', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => saveSetting('platform_name', settings.platform_name || '')}
                disabled={fieldStates.platform_name === 'saving'}
                className="mb-0.5"
              >
                {renderFieldIcon('platform_name') || 'Salvar'}
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Slug da plataforma"
                  value={settings.platform_slug || ''}
                  onChange={(e) => updateSetting('platform_slug', e.target.value)}
                  hint="Identificador único da plataforma (ex: fosfo)"
                />
              </div>
              <Button 
                onClick={() => saveSetting('platform_slug', settings.platform_slug || '')}
                disabled={fieldStates.platform_slug === 'saving'}
                className="mb-0.5"
              >
                {renderFieldIcon('platform_slug') || 'Salvar'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trial</h2>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
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
              <Button 
                onClick={() => saveSetting('default_trial_days', settings.default_trial_days || '14')}
                disabled={fieldStates.default_trial_days === 'saving'}
                className="mb-0.5"
              >
                {renderFieldIcon('default_trial_days') || 'Salvar'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loja Demo</h2>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Slug da loja demo"
                  value={settings.demo_store_slug || 'demo'}
                  onChange={(e) => updateSetting('demo_store_slug', e.target.value)}
                  hint="O slug da loja que será usada como demonstração (ex: demo)"
                />
              </div>
              <Button 
                onClick={() => saveSetting('demo_store_slug', settings.demo_store_slug || 'demo')}
                disabled={fieldStates.demo_store_slug === 'saving'}
                className="mb-0.5"
              >
                {renderFieldIcon('demo_store_slug') || 'Salvar'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
