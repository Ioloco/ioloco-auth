// Types
import type { CookieStore } from '@Types/cookie-store'
import type { IolocoAuthConfig } from '@Types/config'

// =====================================================================================================================

// =========================================
// Get Cookie Store
// =========================================
export async function getCookieStore(config: IolocoAuthConfig): Promise<CookieStore> {
  if (!config.cookies?.getCookies) {
    throw new Error('`getCookies` is required in the IolocoAuth config.')
  }
  return config.cookies.getCookies()
}
