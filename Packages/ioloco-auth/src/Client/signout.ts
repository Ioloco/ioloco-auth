import { getIolocoAuthConfig } from '@/config'

// =====================================================================================================================

// =========================================
// Type
// =========================================
export type SignOutOptions = {
  redirectTo?: string
}

// =========================================
// SignOut
// =========================================
export async function signOut(options: SignOutOptions = {}): Promise<void> {
  const config = getIolocoAuthConfig()
  const url = config.backendUrls.signoutUrl

  if (!url) {
    throw new Error('signoutUrl is missing in the IolocoAuth config')
  }

  await fetch(url, {
    method: 'POST',
    credentials: 'include'
  })

  if (options.redirectTo) {
    window.location.href = options.redirectTo
  }
}
