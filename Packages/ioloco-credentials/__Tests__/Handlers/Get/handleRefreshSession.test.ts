import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleRefreshSession } from '@/Handlers/Get/handleRefreshSession'
import { getIolocoAuthConfig } from '@/config'
import { getSession } from '@/Server/getSession'
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

// =====================================================================================================================

describe('handleRefreshSession', () => {
  const mockJson = vi.mocked(NextResponse.json)

  const backendUrls = {
    signinUrl: '/auth/signin',
    refreshUrl: '/auth/refresh',
    signoutUrl: '/auth/signout'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // getCookies missing
  // =========================================
  it('should return 500 if getCookies is not defined', async () => {
    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {}
    })

    await handleRefreshSession()

    expect(mockJson).toHaveBeenCalledWith({ error: '`getCookies()` is not defined in config.' }, { status: 500 })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // No refresh session found
  // =========================================
  it('should return 401 if session is null', async () => {
    const fakeCookieStore = { get: vi.fn(), set: vi.fn(), delete: vi.fn() }

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {
        getCookies: async () => fakeCookieStore
      }
    })

    vi.mocked(getSession).mockResolvedValue(null)

    await handleRefreshSession()

    expect(mockJson).toHaveBeenCalledWith({ refresh: null }, { status: 401 })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Valid refresh session returned
  // =========================================
  it('should return 200 with session if refresh is valid', async () => {
    const fakeCookieStore = { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
    const session = { userId: '456', scope: 'refresh' }

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {
        getCookies: async () => fakeCookieStore
      }
    })

    vi.mocked(getSession).mockResolvedValue(session)

    await handleRefreshSession()

    expect(mockJson).toHaveBeenCalledWith({ refresh: session }, { status: 200 })
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
