// Ioloco Config
import { getIolocoAuthConfig } from '@/config'

// Types
import { SignInResponse } from '@Types/signin'

// =====================================================================================================================

// =========================================
// Type
// =========================================
export type SignInData = {
  email?: string
  password?: string
  [key: string]: unknown
}

// =========================================
// SignIn API Request
// =========================================
export async function signInRequest(data: SignInData): Promise<SignInResponse> {
  const config = getIolocoAuthConfig()
  const uri = config.backendUrls.signinUrl

  if (!uri) throw new Error('signinUrl is missing in the IolocoAuth config')

  const res = await fetch(uri, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data })
  })

  if (!res.ok) {
    throw new Error('Failed to sign in')
  }

  return await res.json()
}
