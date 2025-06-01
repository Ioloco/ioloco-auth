import { describe, it, expect } from 'vitest'
import { registerOAuthProvider, getOAuthClient } from '@/index'
import { OAuthClient } from '@/index'
import { z } from 'zod'

// Dummy config and schema for testing
const testProvider = 'github'

const dummyConfig = {
  provider: testProvider,
  urls: {
    auth: 'https://example.com/auth',
    token: 'https://example.com/token',
    user: 'https://example.com/user',
    redirect_base: 'https://localhost/callback'
  },
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  scopes: ['profile'],
  userInfo: {
    schema: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string()
    }),
    parser: (data: { id: string; email: string; name: string }) => ({
      id: data.id,
      email: data.email,
      name: data.name
    })
  }
}

describe('OAuth Registry', () => {
  it('should register and retrieve an OAuth client', () => {
    registerOAuthProvider(testProvider, dummyConfig)

    const client = getOAuthClient(testProvider)

    expect(client).toBeInstanceOf(OAuthClient)
    expect(client.provider).toBe(testProvider)
  })

  it('should throw if provider is not registered', () => {
    expect(() => getOAuthClient('unregistered')).toThrowError('OAuth provider "unregistered" is not registered')
  })
})
