// Next
import { NextRequest } from 'next/server'

// Get
import { handleAccessSession } from 'Handlers/Get/handleAccessSession'
import { handleRefreshSession } from 'Handlers/Get/handleRefreshSession'

// =====================================================================================================================

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname

  // =====================================================================================================================
  // =====================================================================================================================

  if (pathname.endsWith('/session')) {
    return handleAccessSession()
  }

  // =====================================================================================================================
  // =====================================================================================================================

  if (pathname.endsWith('/refresh')) {
    return handleRefreshSession()
  }

  // =====================================================================================================================
  // =====================================================================================================================

  return new Response(JSON.stringify({ message: 'Not found' }), {
    status: 404
  })
}
