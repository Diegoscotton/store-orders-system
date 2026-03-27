'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Compass, Settings, FolderOpen, Package, ExternalLink, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Configure sua loja',
    description: 'Adicione o nome, logo, cor da sua marca e número de WhatsApp para receber pedidos.',
    buttonText: 'Configurar agora',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    number: 2,
    title: 'Crie suas categorias',
    description: 'Organize seus produtos em categorias como Salgados, Doces, Bebidas — facilita a vida do seu cliente.',
    buttonText: 'Criar categorias',
    href: '/admin/categories',
    icon: FolderOpen,
  },
  {
    number: 3,
    title: 'Cadastre seus produtos',
    description: 'Adicione fotos, preços e variações como tamanho ou sabor. Cada detalhe ajuda o cliente a escolher.',
    buttonText: 'Adicionar produtos',
    href: '/admin/products',
    icon: Package,
  },
]

export default function OnboardingPage() {
  const { store } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Compass className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Por onde começar</h1>
          </div>
        </div>
        <p className="text-gray-600 text-base">
          Siga os passos abaixo para configurar sua loja e começar a receber pedidos.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
          >
            <div className="flex items-start gap-4">
              {/* Number Circle */}
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <step.icon className="h-5 w-5 text-gray-400 shrink-0" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  {step.buttonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Step 4 - Special (uses store slug) */}
        {store?.slug && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
            <div className="flex items-start gap-4">
              {/* Number Circle */}
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                4
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Compartilhe seu catálogo</h3>
                  <ExternalLink className="h-5 w-5 text-gray-400 shrink-0" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Seu catálogo já está no ar. Copie o link e mande para seus clientes pelo WhatsApp.
                </p>
                <Link
                  href={`/${store.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ver meu catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
