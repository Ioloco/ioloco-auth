// =====================================================================================================================

// ===============================
//  Cookie Options
// ===============================
export interface CookieOptions {
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  expires?: Date
  maxAge?: number
  name?: string // Useful for delete operations
  // Allow extra properties
  [key: string]: unknown
}

// ===============================
//  Cookie Value
// ===============================
export interface CookieValue {
  value: string
  name?: string // Optional
}

// ===============================
//  Cookie Store Abstraction
// ===============================
export interface CookieStore {
  get(name: string): CookieValue | undefined
  set(name: string, value: string, options?: CookieOptions): void
  delete(name: string, options?: CookieOptions): void
}

export type GetCookiesFn = () => CookieStore
