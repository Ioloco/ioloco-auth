import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { OAuthClient } from '@/index'
import { InvalidCodeVerifierError, InvalidStateError } from 'Error/errors'

// =====================================================================================================================

// Mocks for token and user fetch
vi.mock('@Queries/fetchOauthToken', () => ({
  fetchOAuthToken: vi.fn().mockResolvedValue({
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'profile email'
  })
}))

vi.mock('@Queries/fetchOauthUser', () => ({
  fetchOAuthUser: vi.fn().mockResolvedValue({
    id: '123',
    email: 'test@example.com',
    name: 'Test User'
  })
}))

// =====================================================================================================================
// =====================================================================================================================

describe('OAuthClient', () => {
  let mockCookies: {
    get: ReturnType<typeof vi.fn<(key: string) => { value: string } | undefined>>
    set: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  let oauth: OAuthClient<any>

  beforeEach(() => {
    mockCookies = {
      get: vi.fn((key: string) => {
        if (key === 'oauth_validate_cookie') return { value: 'valid-state' }
        if (key === 'oauth_code_verifier') return { value: 'valid-verifier' }
        return undefined
      }),
      set: vi.fn(),
      delete: vi.fn()
    }

    oauth = new OAuthClient({
      provider: 'github',
      urls: {
        auth: 'https://provider.com/auth',
        token: 'https://provider.com/token',
        user: 'https://provider.com/user',
        redirect_base: 'http://localhost/callback'
      },
      clientId: 'client-id',
      clientSecret: 'client-secret',
      scopes: ['email', 'profile'],
      userInfo: {
        schema: z.object({
          id: z.string(),
          email: z.string().email(),
          name: z.string()
        }),
        parser: data => ({
          id: data.id,
          email: data.email,
          name: data.name
        })
      }
    })
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should generate a valid auth URL', async () => {
    const url = await oauth.createAuthUrl(mockCookies)
    expect(url).toContain('client_id=client-id')
    expect(url).toContain('response_type=code')
    expect(url).toContain('scope=email+profile')
    expect(url).toContain('code_challenge=')
    expect(url).toContain('code_challenge_method=S256')
    expect(mockCookies.set).toHaveBeenCalledWith(
      expect.stringContaining('oauth_'),
      expect.any(String),
      expect.any(Object)
    )
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should fetch and parse token successfully', async () => {
    const token = await oauth.fetchToken({ code: 'abc', codeVerifier: 'verifier' })
    expect(token.accessToken).toBe('mock-access-token')
    expect(token.refreshToken).toBe('mock-refresh-token')
    expect(token.tokenType).toBe('Bearer')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should throw InvalidStateError if state is invalid', async () => {
    mockCookies.get = vi.fn((key: string) => {
      if (key === 'oauth_validate_cookie') return { value: 'wrong-state' }
      return { value: 'valid-verifier' }
    })

    await expect(oauth.fetchUser({ code: 'abc', state: 'bad-state', cookies: mockCookies })).rejects.toThrow(
      InvalidStateError
    )
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should throw InvalidCodeVerifierError if code_verifier is missing', async () => {
    mockCookies.get = vi.fn((key: string) => (key === 'oauth_validate_cookie' ? { value: 'valid-state' } : undefined))

    await expect(oauth.fetchUser({ code: 'abc', state: 'valid-state', cookies: mockCookies })).rejects.toThrow(
      InvalidCodeVerifierError
    )
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should fetch user info and return parsed user result', async () => {
    const result = await oauth.fetchUser({
      code: 'abc',
      state: 'valid-state',
      cookies: mockCookies
    })

    expect(result.user).toEqual({
      id: '123',
      email: 'test@example.com',
      name: 'Test User'
    })
    expect(mockCookies.delete).toHaveBeenCalledWith('oauth_validate_cookie')
    expect(mockCookies.delete).toHaveBeenCalledWith('oauth_code_verifier')
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
