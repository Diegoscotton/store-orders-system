'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile, Store } from '@/types'
import type { User } from '@supabase/supabase-js'

type AuthState = {
  user: User | null
  profile: Profile | null
  store: Store | null
  loading: boolean
  isMaster: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    store: null,
    loading: true,
    isMaster: false,
  })

  const supabase = createClient()

  const loadUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setState({ user: null, profile: null, store: null, loading: false, isMaster: false })
        return
      }

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Get store (if admin)
      let store: Store | null = null
      if (profile?.role === 'admin') {
        const { data: storeUser } = await supabase
          .from('store_users')
          .select('store_id')
          .eq('user_id', user.id)
          .single()

        if (storeUser) {
          const { data: storeData } = await supabase
            .from('stores')
            .select('*')
            .eq('id', storeUser.store_id)
            .single()
          store = storeData
        }
      }

      setState({
        user,
        profile,
        store,
        loading: false,
        isMaster: profile?.role === 'master',
      })
    } catch {
      setState({ user: null, profile: null, store: null, loading: false, isMaster: false })
    }
  }, [supabase])

  useEffect(() => {
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [loadUser, supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return { ...state, signOut, refresh: loadUser }
}
