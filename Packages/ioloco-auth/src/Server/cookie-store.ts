// Types
import { CookieStore, CookieOptions } from '@Types/cookie-store'

// =====================================================================================================================

// =========================================
// Type
// =========================================
type CookiesInstance = {
  get: (name: string) => { value: string } | undefined
  set: (name: string, value: string, options?: CookieOptions) => unknown
  delete(name: string): unknown
  delete(options: { name: string } & Record<string, unknown>): unknown
}

// =========================================
// Create Cookie Store
// =========================================
export function createCookieStore(cookiesInstance: CookiesInstance): CookieStore {
  return {
    get(name) {
      const cookie = cookiesInstance.get(name)

      if (!cookie) return undefined
      return { value: cookie.value }
    },

    // =====================================================================================================================
    // =====================================================================================================================

    set(name, value, options) {
      cookiesInstance.set(name, value, options)
    },

    // =====================================================================================================================
    // =====================================================================================================================

    delete(name, options) {
      if (options) {
        cookiesInstance.delete({ name, ...options })
      } else {
        cookiesInstance.delete(name)
      }
    }

    // =====================================================================================================================
    // =====================================================================================================================
  }
}
