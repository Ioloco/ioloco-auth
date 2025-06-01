// =====================================================================================================================

// =========================================
// Check if JWT is expired
// =========================================
export function isJwtExpired(exp: unknown): boolean {
  if (typeof exp !== 'number') return false

  const now = Math.floor(Date.now() / 1000)
  return now > exp
}
