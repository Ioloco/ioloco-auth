import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleAccessSession } from '@/Handlers/Get/handleAccessSession'
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

describe('handleAccessSession', () => {
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

    await handleAccessSession()

    expect(mockJson).toHaveBeenCalledWith({ error: '`getCookies()` is not defined in config.' }, { status: 500 })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // No session found
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

    await handleAccessSession()

    expect(mockJson).toHaveBeenCalledWith({ session: null }, { status: 401 })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // =========================================
  // Valid session returned
  // =========================================
  it('should return 200 with session if session is valid', async () => {
    const fakeCookieStore = { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
    const session = { userId: '123', role: 'admin' }

    vi.mocked(getIolocoAuthConfig).mockReturnValue({
      backendUrls,
      cookies: {
        getCookies: async () => fakeCookieStore
      }
    })

    vi.mocked(getSession).mockResolvedValue(session)

    await handleAccessSession()

    expect(mockJson).toHaveBeenCalledWith({ session }, { status: 200 })
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
