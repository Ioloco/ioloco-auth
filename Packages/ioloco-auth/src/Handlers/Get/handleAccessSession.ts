// Next
import { NextResponse } from 'next/server'

// SSR
import { getSession } from 'Server/getSession'

// Config
import { getIolocoAuthConfig } from '@/config'

// =====================================================================================================================

/**
 * Handles GET /session - Retrieves access session.
 */
export async function handleAccessSession() {
  const config = getIolocoAuthConfig()

  if (!config.cookies?.getCookies) {
    return NextResponse.json({ error: '`getCookies()` is not defined in config.' }, { status: 500 })
  }

  const cookieStore = await config.cookies.getCookies()

  const session = await getSession({
    providedCookieStore: cookieStore,
    mode: 'access'
  })

  if (!session) {
    return NextResponse.json({ session: null }, { status: 401 })
  }

  return NextResponse.json({ session }, { status: 200 })
}
