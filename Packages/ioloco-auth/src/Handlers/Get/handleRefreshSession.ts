// Next
import { NextResponse } from 'next/server'

// SSR
import { getSession } from 'Server/getSession'

// Config
import { getIolocoAuthConfig } from '@/config'

// =====================================================================================================================

/**
 * Handles GET /refresh - Retrieves refresh session.
 */
export async function handleRefreshSession() {
  const config = getIolocoAuthConfig()

  if (!config.cookies?.getCookies) {
    return NextResponse.json({ error: '`getCookies()` is not defined in config.' }, { status: 500 })
  }

  const cookieStore = await config.cookies.getCookies()

  const session = await getSession({
    providedCookieStore: cookieStore,
    mode: 'refresh'
  })

  if (!session) {
    return NextResponse.json({ refresh: null }, { status: 401 })
  }

  return NextResponse.json({ refresh: session }, { status: 200 })
}
