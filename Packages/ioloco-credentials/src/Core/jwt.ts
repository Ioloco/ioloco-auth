// JWT
import jwt from 'jsonwebtoken'

// Error
import syncResolver from 'Error/syncResolver'

// =====================================================================================================================

// =========================================
// Decode JWT
// =========================================
export function decodeJwt<T extends object = Record<string, unknown>>(token: string): T | null {
  const [decoded, error] = syncResolver(() => jwt.decode(token))

  if (error || !decoded) {
    return null
  }

  return decoded as T
}

// =====================================================================================================================
// =====================================================================================================================
