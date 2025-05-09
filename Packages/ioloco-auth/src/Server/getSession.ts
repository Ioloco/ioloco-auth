// Config
import { getIolocoAuthConfig } from '@/config'

// Core
import { decodeJwt } from 'Core/jwt'

// Types
import { CookieStore } from '@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Types
// =========================================
export type SessionData = {
  [key: string]: unknown
  token?: string
}

// =========================================
// Interfaces
// =========================================
interface GetSessionParams {
  providedCookieStore: CookieStore
  mode: 'access' | 'refresh' // Which token you want to parse
}

// =========================================
// Get Session
// =========================================
export async function getSession({ providedCookieStore, mode }: GetSessionParams): Promise<SessionData | null> {
  const { cookies: cookieConfig } = getIolocoAuthConfig()
  const cookieStore = providedCookieStore

  const accessTokenName = cookieConfig?.accessTokenCookieName || 'access_token'
  const refreshTokenName = cookieConfig?.refreshTokenCookieName || 'refresh_token'

  let token: string | null = null

  if (mode === 'access') {
    token = cookieStore.get(accessTokenName)?.value ?? null
  } else if (mode === 'refresh') {
    token = cookieStore.get(refreshTokenName)?.value ?? null
  }

  if (!token) {
    return null
  }

  // ============================
  //  JWT Decoded
  // ============================
  const payload = decodeJwt<SessionData>(token)

  if (!payload) {
    return null
  }

  // ============================
  //  JWT Token Expiration Time
  // ============================
  const nowInSeconds = Math.floor(Date.now() / 1000)

  if (typeof payload.exp === 'number' && nowInSeconds > payload.exp) {
    // throw new TokenExpiredError("Token has expired");
    return null
  }

  // ============================
  //  Extract allowed fields
  // ============================
  const sessionData: SessionData = {}

  const fields =
    mode === 'access' ? cookieConfig?.sessionFields?.accessToken : cookieConfig?.sessionFields?.refreshToken

  if (fields) {
    const shape = fields.shape as Record<string, unknown> // Trust ZodObject shape

    for (const fieldName of Object.keys(shape)) {
      if (fieldName in payload) {
        sessionData[fieldName] = payload[fieldName]
      }
    }
  }

  if (mode === 'access' && cookieConfig.exposeAccessTokenInSession) {
    sessionData.token = token
  }

  return Object.keys(sessionData).length > 0 ? sessionData : null
}
