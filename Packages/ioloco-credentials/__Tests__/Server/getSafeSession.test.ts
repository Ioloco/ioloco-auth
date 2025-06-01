import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSafeSession } from '@/Server/getSafeSession'
import { decodeJwt } from '@/Core/jwt'
import { getSession } from '@/Server/getSession'
import { getIolocoAuthConfig } from '@/config'
import { AccessTokenExpiredError, RefreshTokenExpiredError } from '@/Error/errors'

// Types
import type { CookieStore } from '@/@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Mocks
// =========================================
vi.mock('Server/getSession', () => ({
  getSession: vi.fn()
}))
vi.mock('Core/jwt', () => ({
  decodeJwt: vi.fn()
}))
vi.mock('@/config', () => ({
  getIolocoAuthConfig: vi.fn()
}))

// =========================================
// Helper
// =========================================
function createMockCookieStore(refreshToken: string | null): CookieStore {
  return {
    get: vi.fn((name: string) => {
      if (name === 'refresh_token' && refreshToken) return { value: refreshToken }
      return undefined
    }) as CookieStore['get'],
    set: vi.fn(),
    delete: vi.fn()
  }
}

// =========================================
// Base config mock
// =========================================
const baseConfig = {
  backendUrls: {
    signinUrl: '/auth/signin',
    refreshUrl: '/auth/refresh'
  },
  cookies: {
    refreshTokenCookieName: 'refresh_token',
    getCookies: vi.fn()
  }
}

// =====================================================================================================================
// =====================================================================================================================

describe('getSafeSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================
  // Valid Access Token
  // =========================================
  it('should return session if access token is valid', async () => {
    const cookieStore = createMockCookieStore(null)
    vi.mocked(getIolocoAuthConfig).mockReturnValue({ ...baseConfig, cookies: { ...baseConfig.cookies } })
    vi.mocked(getSession).mockResolvedValue({ userId: '123' })

    const result = await getSafeSession({ providedCookieStore: cookieStore })

    expect(result).toEqual({
      session: { userId: '123' },
      needsRefresh: false,
      error: null
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // getSession throws unknown error
  // =========================================
  it('should return AccessTokenExpiredError on unknown access error', async () => {
    const cookieStore = createMockCookieStore(null)
    vi.mocked(getIolocoAuthConfig).mockReturnValue({ ...baseConfig, cookies: { ...baseConfig.cookies } })
    vi.mocked(getSession).mockRejectedValue(new Error('unknown error'))

    const result = await getSafeSession({ providedCookieStore: cookieStore })

    expect(result).toEqual({
      session: null,
      needsRefresh: false,
      error: new AccessTokenExpiredError()
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // No refresh token present
  // =========================================
  it('should return RefreshTokenExpiredError if no refresh token found', async () => {
    const cookieStore = createMockCookieStore(null)
    vi.mocked(getIolocoAuthConfig).mockReturnValue({ ...baseConfig, cookies: { ...baseConfig.cookies } })
    vi.mocked(getSession).mockResolvedValue(null)

    const result = await getSafeSession({ providedCookieStore: cookieStore })

    expect(result).toEqual({
      session: null,
      needsRefresh: true,
      error: new RefreshTokenExpiredError()
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Malformed refresh token
  // =========================================
  it('should return RefreshTokenExpiredError if refresh token is invalid', async () => {
    const cookieStore = createMockCookieStore('bad.token.here')
    vi.mocked(getIolocoAuthConfig).mockReturnValue({ ...baseConfig, cookies: { ...baseConfig.cookies } })
    vi.mocked(decodeJwt).mockReturnValue(null)

    const result = await getSafeSession({ providedCookieStore: cookieStore })

    expect(result).toEqual({
      session: null,
      needsRefresh: false,
      error: new RefreshTokenExpiredError()
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Expired refresh token
  // =========================================
  it('should return RefreshTokenExpiredError if refresh token is expired', async () => {
    const cookieStore = createMockCookieStore('expired.token')
    vi.mocked(getIolocoAuthConfig).mockReturnValue({ ...baseConfig, cookies: { ...baseConfig.cookies } })
    vi.mocked(decodeJwt).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10
    })

    const result = await getSafeSession({ providedCookieStore: cookieStore })

    expect(result).toEqual({
      session: null,
      needsRefresh: false,
      error: new RefreshTokenExpiredError()
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Refresh token still valid
  // =========================================
  it('should return needsRefresh=true if access is expired but refresh is valid', async () => {
    const cookieStore = createMockCookieStore('valid.token')
    vi.mocked(getIolocoAuthConfig).mockReturnValue({ ...baseConfig, cookies: { ...baseConfig.cookies } })
    vi.mocked(getSession).mockResolvedValue(null)
    vi.mocked(decodeJwt).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 100
    })

    const result = await getSafeSession({ providedCookieStore: cookieStore })

    expect(result).toEqual({
      session: null,
      needsRefresh: true,
      error: null
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
