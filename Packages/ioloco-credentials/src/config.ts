// Next
import { NextRequest } from 'next/server'

// Utils
import { getCookieStore } from 'Utils/getCookieStore'

// Types
import type { IolocoAuthConfig, EmptyZodRawShape, InferAccessSession, InferRefreshSession } from '@Types/config'

// =====================================================================================================================

// =========================================
// Internal State
// =========================================
let config: IolocoAuthConfig | null = null

// =========================================
// Main Init
// =========================================
export function IolocoAuth<
  AccessTokenShape extends EmptyZodRawShape = EmptyZodRawShape,
  RefreshTokenShape extends EmptyZodRawShape = EmptyZodRawShape
>(userConfig: IolocoAuthConfig<AccessTokenShape, RefreshTokenShape>) {
  config = userConfig

  type AccessSession = InferAccessSession<AccessTokenShape>
  type RefreshSession = InferRefreshSession<RefreshTokenShape>

  // =====================================================================================================================
  // =====================================================================================================================

  return {
    // =========================================
    // Handlers
    // =========================================
    handlers: {
      GET: async (req: NextRequest) => {
        const { GET } = await import('./Handlers/Get')
        return GET(req)
      },
      POST: async (req: NextRequest) => {
        const { POST } = await import('./Handlers/Post')
        return POST(req)
      }
    },

    // =====================================================================================================================
    // =====================================================================================================================

    // =========================================
    // Auth
    // =========================================
    auth: async (): Promise<AccessSession | null> => {
      const { getSafeSession } = await import('./Server/getSafeSession')

      if (!config) {
        throw new Error('IolocoAuth must be initialized before use.')
      }

      const cookieStore = await getCookieStore(config)
      const { session } = await getSafeSession({
        providedCookieStore: cookieStore
      })
      return session as AccessSession
    },

    // =====================================================================================================================
    // =====================================================================================================================

    // =========================================
    // Get Safe Session
    // =========================================
    getSafeSession: async (): Promise<{
      session: AccessSession | null
      needsRefresh: boolean
      error: Error | null
    }> => {
      const { getSafeSession } = await import('./Server/getSafeSession')
      if (!config) {
        throw new Error('IolocoAuth must be initialized before use.')
      }

      const cookieStore = await getCookieStore(config)
      const { session, needsRefresh, error } = await getSafeSession({
        providedCookieStore: cookieStore
      })
      return {
        session: session as AccessSession | null,
        needsRefresh,
        error
      }
    },

    // =====================================================================================================================
    // =====================================================================================================================

    // =========================================
    // Refresh Session
    // =========================================
    refreshSession: async (): Promise<RefreshSession | null> => {
      const { getSession } = await import('./Server/getSession')
      if (!config) {
        throw new Error('IolocoAuth must be initialized before use.')
      }

      const cookieStore = await getCookieStore(config)
      const session = await getSession({
        providedCookieStore: cookieStore,
        mode: 'refresh'
      })
      return session as RefreshSession | null
    }

    // =====================================================================================================================
    // =====================================================================================================================
  }
}

// =====================================================================================================================
//  Accessor
// =====================================================================================================================

export function getIolocoAuthConfig(): IolocoAuthConfig {
  if (!config) {
    throw new Error('iolocoAuthConfig is not initialized. Call IolocoAuth() first.')
  }
  return config
}
