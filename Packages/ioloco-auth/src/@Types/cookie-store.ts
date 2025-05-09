// src/ioloco-auth/src/Types/cookie-store.ts

// ===============================
//  Cookie Options
// ===============================

/**
 * Options when setting or deleting a cookie.
 */
export interface CookieOptions {
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  expires?: Date;
  maxAge?: number;
  name?: string; // Useful for delete operations

  // Allow extra properties
  [key: string]: unknown;
}

// ===============================
//  Cookie Value
// ===============================

/**
 * Describes a single cookie value.
 */
export interface CookieValue {
  value: string;
  name?: string; // Optional
}

// ===============================
//  Cookie Store Abstraction
// ===============================

/**
 * A minimal, abstract cookie store interface.
 * Your framework (Next.js, Express, etc.) must implement this.
 */
export interface CookieStore {
  /**
   * Retrieves a cookie by name.
   */
  get(name: string): CookieValue | undefined;

  /**
   * Sets a cookie.
   */
  set(name: string, value: string, options?: CookieOptions): void;

  /**
   * Deletes a cookie.
   */
  delete(name: string, options?: CookieOptions): void;
}

export type GetCookiesFn = () => CookieStore;
