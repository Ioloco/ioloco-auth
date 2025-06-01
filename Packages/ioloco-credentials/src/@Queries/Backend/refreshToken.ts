// Ioloco Config
import { getIolocoAuthConfig } from '@/config'

// Error
import promiseResolver from '@/Error/promiseResolver'

// =====================================================================================================================

export const refreshAccessToken = () =>
  promiseResolver(async () => {
    const config = getIolocoAuthConfig()
    const uri = config.backendUrls.refreshUrl

    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({})
    })

    if (!res.ok) {
      const { message } = await res.json()
      throw new Error(message || 'Token refresh failed')
    }

    const data = await res.json()
    return data
  })
