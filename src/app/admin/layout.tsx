'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Image,
  Settings,
  ExternalLink,
  LogOut,
  Store,
  Loader2,
  Share2,
  Check,
  Smile,
  Compass,
  MessageCircle,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/categories', label: 'Categorias', icon: FolderOpen },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
  { href: 'divider', label: '', icon: null },
  { href: '/admin/start', label: 'Por onde começar', icon: Compass },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile, store, loading, signOut } = useAuth()
  const [copied, setCopied] = React.useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://store-orders-system.vercel.app/')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 text-white flex flex-col shrink-0 h-screen sticky top-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white/10 rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{store?.name || 'Meu Catálogo'}</p>
              <p className="text-xs text-gray-400">Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.href === 'divider') {
              return <div key="divider" className="h-px bg-white/10 my-2" />
            }
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
          {store?.slug && (
            <Link
              href={`/${store.slug}`}
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <ExternalLink className="h-4.5 w-4.5" />
              Ver meu catálogo
            </Link>
          )}
          {!store?.is_demo && (
            <a
              href="https://wa.me/5554981219406?text=Olá!%20Preciso%20de%20ajuda%20com%20o%20Sistema%20de%20Pedidos%20Fosfo."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              Falar com suporte
            </a>
          )}
        </nav>

        {/* Bottom - Fixed */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
          {/* Card de indicação */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Smile className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-xs font-semibold text-white">Indique o sistema</div>
            </div>
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                copied 
                  ? 'bg-green-500/15 text-green-400' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {copied ? (
                <Check className="h-4 w-4 shrink-0" />
              ) : (
                <Share2 className="h-4 w-4 shrink-0" />
              )}
              <div className="flex-1 text-left">
                <div className="font-medium text-xs">{copied ? 'Link copiado!' : 'Copiar link de indicação'}</div>
              </div>
            </button>
            <p className="text-xs text-gray-500 leading-relaxed">
              Compartilhe com outros empreendedores e ajude quem precisa de organização.
            </p>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sair
          </button>

          {/* User info */}
          <div className="px-3 py-3 mt-2">
            <p className="text-sm text-white truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{store?.slug ? `/${store.slug}` : ''}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
