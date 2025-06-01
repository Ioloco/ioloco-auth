import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { decodeJwt } from '@/Core/jwt'

// =====================================================================================================================

// Mock secret for creating tokens
const secret = 'test-secret'

describe('decodeJwt', () => {
  it('should decode a valid JWT and return payload', () => {
    const payload = { userId: '123', role: 'admin' }
    const token = jwt.sign(payload, secret)

    const decoded = decodeJwt<typeof payload>(token)

    expect(decoded).toMatchObject(payload)
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should return null for an invalid token', () => {
    const decoded = decodeJwt('invalid.token.here')

    expect(decoded).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should return null for empty string', () => {
    const decoded = decodeJwt('')

    expect(decoded).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
