import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IolocoAuth, getIolocoAuthConfig } from '@/config'

// =====================================================================================================================

// Mock cookie store
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn()
}

// Setup reusable config
const baseConfig = {
  backendUrls: {
    signinUrl: '/auth/signin',
    refreshUrl: '/auth/refresh',
    signoutUrl: '/auth/signout'
  },
  cookies: {
    getCookies: async () => mockCookieStore
  },
  clientRefresh: {
    intervalMs: 10000
  }
}

// =====================================================================================================================
// =====================================================================================================================

// =========================================
// Mocks
// =========================================
vi.mock('@/Server/getSafeSession', () => ({
  getSafeSession: vi.fn().mockResolvedValue({
    session: { userId: '123' },
    needsRefresh: false,
    error: null
  })
}))

vi.mock('@/Server/getSession', () => ({
  getSession: vi.fn().mockResolvedValue({
    userId: 'abc'
  })
}))

// =====================================================================================================================
// =====================================================================================================================

describe('IolocoAuth config', () => {
  // =========================================
  // Reset before each test
  // =========================================
  beforeEach(() => {
    vi.resetModules()
  })

  // =========================================
  // Config Storage
  // =========================================
  it('should store config and return it via getIolocoAuthConfig()', () => {
    const instance = IolocoAuth(baseConfig)
    const returned = getIolocoAuthConfig()

    expect(returned.backendUrls.signinUrl).toBe('/auth/signin')
    expect(instance.handlers).toBeDefined()
    expect(typeof instance.auth).toBe('function')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Throws if not initialized
  // =========================================
  it('should throw if getIolocoAuthConfig() is called before init', async () => {
    vi.resetModules()
    const { getIolocoAuthConfig } = await import('@/config')
    expect(() => getIolocoAuthConfig()).toThrow(/not initialized/)
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // getSafeSession
  // =========================================
  it('should call getSafeSession with providedCookieStore', async () => {
    const { getSafeSession } = IolocoAuth(baseConfig)

    const result = await getSafeSession()

    expect(result.session).toMatchObject({ userId: '123' })
    expect(result.needsRefresh).toBe(false)
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // refreshSession
  // =========================================
  it('should call getSession with refresh mode', async () => {
    const { refreshSession } = IolocoAuth(baseConfig)
    const result = await refreshSession()

    expect(result).toMatchObject({ userId: 'abc' })
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
