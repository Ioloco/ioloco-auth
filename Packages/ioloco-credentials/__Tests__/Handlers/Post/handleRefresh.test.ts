import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleRefresh } from '@/Handlers/Post/handleRefresh'
import { getIolocoAuthConfig } from '@/config'
import { NextResponse } from 'next/server'

// =====================================================================================================================

// =========================================
// Mocks
// =========================================
vi.mock('@/config', () => ({
  getIolocoAuthConfig: vi.fn()
}))

vi.mock('Server/getSession', () => ({
  getSession: vi.fn()
}))

vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    NextResponse: {
      json: vi.fn()
    }
  }
})

global.fetch = vi.fn()

// =====================================================================================================================

describe('handleRefresh', () => {
  const mockJson = vi.mocked(NextResponse.json)
  const mockFetch = vi.mocked(global.fetch)

  const backendUrls = {
    signinUrl: '/auth/signin',
    refreshUrl: 'https://api.example.com/auth/refresh',
    signoutUrl: '/auth/signout'
  }

  const validCookieStore = {
    get: vi.fn((name: string) => {
      if (name === 'refresh_token') return { value: 'refresh-token-abc' }
      if (name === 'access_token') return { value: 'access-token-xyz' }
      return undefined
    }),
    set: vi.fn(),
    delete: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================
  // getCookies missing
  // =========================================
  it('should return 500 if getCookies is not defined', async () => {
    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {}
    })

    await handleRefresh()

    expect(mockJson).toHaveBeenCalledWith(
      { success: false, error: '`getCookies()` is not defined in config.' },
      { status: 500 }
    )
  })

  // =========================================
  // refresh_token missing
  // =========================================
  it('should return 401 if refresh_token is missing', async () => {
    const storeWithNoRefreshToken = {
      ...validCookieStore,
      get: vi.fn().mockImplementation((name: string) => {
        if (name === 'refresh_token') return undefined
        if (name === 'access_token') return { value: 'access-token' }
        return undefined
      })
    }

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {
        getCookies: async () => storeWithNoRefreshToken
      }
    })

    await handleRefresh()

    expect(mockJson).toHaveBeenCalledWith({ success: false, error: 'No refresh token cookie found' }, { status: 401 })
  })

  // =========================================
  // Backend refresh fails
  // =========================================
  it('should return 401 if backend refresh fails', async () => {
    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {
        getCookies: async () => validCookieStore
      }
    })

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({})
    } as Response)

    await handleRefresh()

    expect(mockJson).toHaveBeenCalledWith({ success: false, error: 'Backend refresh failed' }, { status: 401 })
  })

  // =========================================
  // Success
  // =========================================
  it('should return 200 and set new access_token cookie', async () => {
    const mockAccessToken = 'new-access-token-123'

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {
        getCookies: async () => validCookieStore
      }
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: mockAccessToken })
    } as Response)

    // ✅ Complete mock for ResponseCookies
    const mockResponseCookies = {
      set: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn(),
      has: vi.fn(),
      delete: vi.fn()
    }

    const mockResponse = {
      cookies: mockResponseCookies
    } as unknown as ReturnType<typeof NextResponse.json>

    mockJson.mockReturnValue(mockResponse)

    const result = await handleRefresh()

    expect(mockJson).toHaveBeenCalledWith({ success: true })

    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      'access_token',
      mockAccessToken,
      expect.objectContaining({
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600
      })
    )

    expect(result).toBe(mockResponse)
  })
})
