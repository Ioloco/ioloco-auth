'use client'

// React
import { useState, useEffect, ReactNode, useContext } from 'react'

// Provider
import { loadSession } from 'Client/Provider/loadSession'
import { createIolocoContext, IolocoContextType } from 'Client/Provider/context'
import { IolocoAuth } from '@/config'

// Types
import type { IolocoAuthConfig } from '@Types/config'

// =====================================================================================================================

interface CreateIolocoProviderOptions {
  config: IolocoAuthConfig
  refreshIntervalMs?: number
}

export function createIolocoProvider<AccessSession>(options: CreateIolocoProviderOptions) {
  const Context = createIolocoContext<AccessSession>()

  // =====================================================================================================================
  // =====================================================================================================================

  function Provider({ children }: { children: ReactNode }) {
    // =========================================
    // State
    // =========================================
    const [session, setSession] = useState<AccessSession | null>(null)
    const [error, setError] = useState<Error | null>(null)

    // =============================
    // Initialize IolocoAuth
    // =============================
    useEffect(() => {
      IolocoAuth(options.config)
    }, [])

    // =========================================
    // Load Session
    // =========================================
    useEffect(() => {
      loadSession(setSession, setError)
    }, [])

    // =========================================
    // Silent Token Refresh
    // =========================================
    useEffect(() => {
      const refreshInterval = options.refreshIntervalMs
      if (!refreshInterval) return

      const interval = setInterval(() => {
        loadSession(setSession, setError)
      }, refreshInterval)

      return () => clearInterval(interval)
    }, [])

    // =========================================
    // Data
    // =========================================
    const value: IolocoContextType<AccessSession> = {
      session,
      isAuthenticated: !!session,
      error
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  // =====================================================================================================================
  // =====================================================================================================================

  function useAuth(): IolocoContextType<AccessSession> {
    const context = useContext(Context)
    if (!context) {
      throw new Error('useAuth must be used within <Provider>')
    }
    return context
  }

  // =====================================================================================================================
  // =====================================================================================================================

  return { Provider, useAuth }
}
