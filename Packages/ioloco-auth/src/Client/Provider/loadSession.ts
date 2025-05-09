import { Dispatch, SetStateAction } from 'react'

// Queries
import { fetchAccessSession } from '@Queries/Next/fetchSession'
import { refreshAccessToken } from '@Queries/Backend/refreshToken'

// =====================================================================================================================

export async function loadSession<AccessSession>(
  setSession: Dispatch<SetStateAction<AccessSession | null>>,
  setError: Dispatch<SetStateAction<Error | null>>
) {
  // =========================================
  // Check Next API
  // =========================================
  const [sessionData, sessionError] = await fetchAccessSession()
  if (sessionData) return setSession(sessionData.session)

  if (sessionError) {
    // =========================================
    // Refresh Access Token Via Backend API
    // =========================================
    const [, refreshError] = await refreshAccessToken()

    if (refreshError) {
      setSession(null)
      setError(refreshError)
      return
    }

    // =========================================
    // Check Next API Again
    // =========================================
    const [retriedSession, retryError] = await fetchAccessSession()

    setSession(retriedSession?.session ?? null)
    setError(retryError)
  }
}
