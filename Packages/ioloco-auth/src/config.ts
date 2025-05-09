// Next
import { NextRequest } from 'next/server'

// Zod
import { z } from 'zod'

// Types
import type { CookieStore } from '@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Type
// =========================================
type EmptyZodRawShape = Record<string, z.ZodTypeAny>

// =========================================
// Infer Session Types
// =========================================
export type InferAccessSession<T extends EmptyZodRawShape> = z.infer<z.ZodObject<T>>
export type InferRefreshSession<T extends EmptyZodRawShape> = z.infer<z.ZodObject<T>>

// =========================================
// Interfaces
// =========================================
export interface IolocoAuthConfig<
  AccessTokenShape extends EmptyZodRawShape = EmptyZodRawShape,
  RefreshTokenShape extends EmptyZodRawShape = EmptyZodRawShape
> {
  backendUrls: {
    signinUrl: string
    refreshUrl: string
    signoutUrl?: string
  }
  cookies: {
    getCookies?: () => Promise<CookieStore>
    accessTokenCookieName?: string
    refreshTokenCookieName?: string
    sessionFields?: {
      accessToken?: z.ZodObject<AccessTokenShape>
      refreshToken?: z.ZodObject<RefreshTokenShape>
    }
    exposeAccessTokenInSession?: boolean
  }
  clientRefresh?: {
    intervalMs: number
  }
}

// =========================================
// Internal State
// =========================================
let config: IolocoAuthConfig | null = null

// =========================================
// Helpers
// =========================================
async function getCookieStore(): Promise<CookieStore> {
  if (!config?.cookies?.getCookies) {
    throw new Error('`getCookies` is required in the IolocoAuth config.')
  }
  return config.cookies.getCookies()
}

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

  return {
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

    auth: async (): Promise<AccessSession | null> => {
      const { getSafeSession } = await import('./Server/getSafeSession')
      const cookieStore = await getCookieStore()
      const { session } = await getSafeSession({
        providedCookieStore: cookieStore
      })
      return session as AccessSession | null
    },

    // =====================================================================================================================
    // =====================================================================================================================

    getSafeSession: async (): Promise<{
      session: AccessSession | null
      needsRefresh: boolean
      error: Error | null
    }> => {
      const { getSafeSession } = await import('./Server/getSafeSession')
      const cookieStore = await getCookieStore()
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

    refreshSession: async (): Promise<RefreshSession | null> => {
      const { getSession } = await import('./Server/getSession')
      const cookieStore = await getCookieStore()
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
