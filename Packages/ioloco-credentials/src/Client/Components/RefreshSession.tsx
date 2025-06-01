'use client'

// React
import { useEffect } from 'react'

// Next
import { useRouter } from 'next/navigation'

// Queries
import { refreshRoute } from '@Queries/Next/refreshRoute'

// =====================================================================================================================

export function RefreshSessionComponent() {
  const router = useRouter()

  useEffect(() => {
    async function handleRefresh() {
      try {
        await refreshRoute()
        router.refresh()
      } catch (error) {
        console.error('Error refreshing session:', error)
      }
    }

    handleRefresh()
  }, [router])

  return null
}
