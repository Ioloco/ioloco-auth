// Next
import { NextResponse } from 'next/server'

// Config
import { getIolocoAuthConfig } from '@/config'

// =====================================================================================================================

export async function handleRefresh() {
  const config = getIolocoAuthConfig()

  if (!config.cookies?.getCookies) {
    return NextResponse.json({ success: false, error: '`getCookies()` is not defined in config.' }, { status: 500 })
  }

  const cookieStore = await config.cookies.getCookies()
  const refreshTokenCookie = cookieStore.get('refresh_token')?.value
  const accessToken = cookieStore.get('access_token')?.value
  const backendRefreshUrl = config.backendUrls.refreshUrl

  if (!refreshTokenCookie) {
    return NextResponse.json({ success: false, error: 'No refresh token cookie found' }, { status: 401 })
  }

  const res = await fetch(backendRefreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `refresh_token=${refreshTokenCookie}`
    },
    credentials: 'include',
    body: JSON.stringify({ accessToken })
  })

  if (!res.ok) {
    return NextResponse.json({ success: false, error: 'Backend refresh failed' }, { status: 401 })
  }

  const result = await res.json()
  const response = NextResponse.json({ success: true })

  response.cookies.set('access_token', result.accessToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600
  })

  return response
}
