// Zod
import { z } from 'zod'

// Types
import type { CookieStore } from '@/@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Type
// =========================================
export type EmptyZodRawShape = Record<string, z.ZodTypeAny>

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
