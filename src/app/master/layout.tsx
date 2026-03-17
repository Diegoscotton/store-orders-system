'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Store, Users, Settings, LogOut, Shield, Loader2,
} from 'lucide-react'

const navItems = [
  { href: '/master', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/master/stores', label: 'Lojas', icon: Store },
  { href: '/master/users', label: 'Usuários', icon: Users },
  { href: '/master/settings', label: 'Configurações', icon: Settings },
]

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile, loading, signOut, isMaster } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-950 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Master Admin</p>
              <p className="text-xs text-gray-400">Fosfo Pedidos</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
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
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sair
          </button>
          <div className="px-3 py-3">
            <p className="text-sm text-white truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-500">Master</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
