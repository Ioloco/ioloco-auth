// Config
import { getIolocoAuthConfig } from '@/config'

// Core
import { decodeJwt } from 'Core/jwt'

// Utils
import { isJwtExpired } from 'Utils/jwtExpiration'

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
  mode: 'access' | 'refresh'
}

// =========================================
// Get Session
// =========================================
export async function getSession({ providedCookieStore, mode }: GetSessionParams): Promise<SessionData | null> {
  const { cookies } = getIolocoAuthConfig()
  const cookieStore = providedCookieStore

  const accessName = cookies?.accessTokenCookieName || 'access_token'
  const refreshName = cookies?.refreshTokenCookieName || 'refresh_token'

  const token =
    mode === 'access' ? (cookieStore.get(accessName)?.value ?? null) : (cookieStore.get(refreshName)?.value ?? null)

  if (!token) return null

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
  if (isJwtExpired(payload?.exp)) return null

  // ============================
  //  Extract allowed fields
  // ============================
  const sessionData: SessionData = {}

  const fields = mode === 'access' ? cookies?.sessionFields?.accessToken : cookies?.sessionFields?.refreshToken

  if (fields) {
    const shape = fields.shape as Record<string, unknown>

    for (const fieldName of Object.keys(shape)) {
      if (fieldName in payload) {
        sessionData[fieldName] = payload[fieldName]
      }
    }
  }

  if (mode === 'access' && cookies.exposeAccessTokenInSession) {
    sessionData.token = token
  }

  return Object.keys(sessionData).length > 0 ? sessionData : null
}
