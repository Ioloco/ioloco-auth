import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSession } from 'Server/getSession'
import { getIolocoAuthConfig } from '@/config'
import { decodeJwt } from 'Core/jwt'
import { z } from 'zod'

// Types
import type { CookieStore } from '@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Mocks
// =========================================
vi.mock('@/config', () => ({
  getIolocoAuthConfig: vi.fn()
}))

vi.mock('Core/jwt', () => ({
  decodeJwt: vi.fn()
}))

// =========================================
// Helper to create fully typed mock CookieStore
// =========================================
function createMockCookieStore(initialToken: string | null): CookieStore {
  return {
    get: vi.fn(() => {
      if (initialToken) return { value: initialToken }
      return undefined
    }) as unknown as CookieStore['get'],
    set: vi.fn(),
    delete: vi.fn()
  }
}

// =========================================
// Base config for all tests
// =========================================
const baseConfig = {
  backendUrls: {
    signinUrl: '/auth/signin',
    refreshUrl: '/auth/refresh'
  },
  cookies: {
    accessTokenCookieName: 'access_token',
    refreshTokenCookieName: 'refresh_token',
    exposeAccessTokenInSession: false,
    sessionFields: {}
  }
}

// =====================================================================================================================
// =====================================================================================================================

describe('getSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // No Token Present
  // =========================================
  it('should return null if no token is found', async () => {
    const cookieStore = createMockCookieStore(null)
    vi.mocked(getIolocoAuthConfig).mockReturnValue(baseConfig)

    const result = await getSession({ providedCookieStore: cookieStore, mode: 'access' })
    expect(result).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Invalid Token
  // =========================================
  it('should return null if token cannot be decoded', async () => {
    const cookieStore = createMockCookieStore('invalid-token')
    vi.mocked(getIolocoAuthConfig).mockReturnValue(baseConfig)
    vi.mocked(decodeJwt).mockReturnValue(null)

    const result = await getSession({ providedCookieStore: cookieStore, mode: 'access' })
    expect(result).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Expired Token
  // =========================================
  it('should return null if token is expired', async () => {
    const cookieStore = createMockCookieStore('expired-token')
    vi.mocked(getIolocoAuthConfig).mockReturnValue(baseConfig)
    vi.mocked(decodeJwt).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10
    })

    const result = await getSession({ providedCookieStore: cookieStore, mode: 'access' })
    expect(result).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Valid Token with Fields
  // =========================================
  it('should return selected fields from payload', async () => {
    const cookieStore = createMockCookieStore('valid-token')

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      ...baseConfig,
      cookies: {
        ...baseConfig.cookies,
        sessionFields: {
          accessToken: z.object({
            userId: z.string(),
            role: z.string()
          })
        }
      }
    })

    vi.mocked(decodeJwt).mockReturnValue({
      userId: 'u123',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 500,
      extra: 'ignore'
    })

    const result = await getSession({ providedCookieStore: cookieStore, mode: 'access' })

    expect(result).toEqual({
      userId: 'u123',
      role: 'admin'
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Expose Token
  // =========================================
  it('should include token if exposeAccessTokenInSession is true', async () => {
    const cookieStore = createMockCookieStore('token-abc')

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      ...baseConfig,
      cookies: {
        ...baseConfig.cookies,
        exposeAccessTokenInSession: true,
        sessionFields: {
          accessToken: z.object({
            userId: z.string()
          })
        }
      }
    })

    vi.mocked(decodeJwt).mockReturnValue({
      userId: 'abc',
      exp: Math.floor(Date.now() / 1000) + 500
    })

    const result = await getSession({ providedCookieStore: cookieStore, mode: 'access' })

    expect(result).toEqual({
      userId: 'abc',
      token: 'token-abc'
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
