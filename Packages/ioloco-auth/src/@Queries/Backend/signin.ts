// Ioloco Config
import { getIolocoAuthConfig } from '@/config'

// Error
// import promiseResolver from 'Error/promiseResolver'

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
export async function signInRequest(data: SignInData): Promise<void> {
  const config = getIolocoAuthConfig()
  const uri = config.backendUrls.signinUrl

  if (!uri) throw new Error('signinUrl is missing in the IolocoAuth config')

  await fetch(uri, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data })
  })
}
