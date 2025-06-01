import type { HashAlgorithms } from 'otplib/core'
export type { HashAlgorithms } from 'otplib/core'

export interface TempTokenStore {
  get(key: string): Promise<string | null>
  set(key: string, value: string, expiresInSec?: number): Promise<void>
  delete(key: string): Promise<void>
}

export interface MFAOptions {
  issuer?: string
  tempTokenPrefix?: string
  tempTokenExpirySeconds?: number
  step?: number
  digits?: number
  window?: number
  algorithm?: HashAlgorithms
}
