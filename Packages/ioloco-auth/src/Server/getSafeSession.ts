// Server
import { getSession, SessionData } from 'Server/getSession'

// Errors
import { AccessTokenExpiredError, RefreshTokenExpiredError } from 'Error/errors'

// Core
import { decodeJwt } from 'Core/jwt'

// Config
import { getIolocoAuthConfig } from '@/config'

// Types
import { CookieStore } from '@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Get Safe Session
// =========================================
export async function getSafeSession(params?: {
  providedCookieStore?: CookieStore
  backendRefreshUrl?: string
}): Promise<{
  session: SessionData | null
  needsRefresh: boolean
  error: Error | null
}> {
  const config = getIolocoAuthConfig()
  // const cookieStore = params?.providedCookieStore ?? (await config?.cookies?.getCookies())
  const cookieStore =
    params?.providedCookieStore ??
    (typeof config.cookies.getCookies === 'function'
      ? await config.cookies.getCookies()
      : (() => {
          throw new Error('getCookies() is not defined in IolocoAuth config.')
        })())

  // ========================================
  // Try getting the current session
  // ========================================
  try {
    const session = await getSession({
      providedCookieStore: cookieStore,
      mode: 'access'
    })

    if (session) {
      return { session, needsRefresh: false, error: null }
    }
  } catch (error) {
    if (!(error instanceof AccessTokenExpiredError)) {
      return {
        session: null,
        needsRefresh: false,
        error: new AccessTokenExpiredError()
      }
    }
  }

  // ========================================
  // Access token expired → Try refreshing
  // ========================================
  const refreshTokenCookie = cookieStore.get(config.cookies.refreshTokenCookieName || 'refresh_token')?.value

  if (!refreshTokenCookie) {
    return {
      session: null,
      needsRefresh: true,
      error: new RefreshTokenExpiredError()
    }
  }

  // ========================================
  // Unix Time comparison
  // ========================================
  const refreshTokenPayload = decodeJwt<{ exp?: number }>(refreshTokenCookie)

  if (!refreshTokenPayload || typeof refreshTokenPayload.exp !== 'number') {
    return {
      session: null,
      needsRefresh: false,
      error: new RefreshTokenExpiredError()
    }
  }

  const now = Math.floor(Date.now() / 1000)

  if (refreshTokenPayload.exp < now) {
    return {
      session: null,
      needsRefresh: false,
      error: new RefreshTokenExpiredError()
    }
  }

  return { session: null, needsRefresh: true, error: null }
}
