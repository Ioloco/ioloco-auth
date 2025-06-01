// Validation
import { z } from 'zod'

// Security
import { createHash, randomBytes } from 'crypto'

// Errors
import { InvalidCodeVerifierError, InvalidStateError, InvalidTokenError, InvalidUserError } from '../Error/errors'

// Queries
import { fetchOAuthToken } from '@Queries/fetchOauthToken'
import { fetchOAuthUser } from '@Queries/fetchOauthUser'

// Types
import { AuthUrlOptions, Cookies, OauthProvider, OAuthTokenResponse, OAuthUserResult } from '../@Types'

// =====================================================================================================================

export class OAuthClient<T> {
  readonly provider: OauthProvider
  private readonly urls: {
    auth: string
    token: string
    user: string
    redirect_base: string
  }
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly scopes: string[]

  private readonly userInfo: {
    schema: z.ZodSchema<T>
    parser: (data: T) => { id: string; email: string; name: string }
  }

  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string().optional(),
    refresh_token: z.string().optional(),
    expires_in: z.number().optional(),
    scope: z.string().optional()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  // ======================================================
  // Constructor
  // ======================================================
  constructor({
    provider,
    urls,
    clientId,
    clientSecret,
    scopes,
    userInfo
  }: {
    provider: OauthProvider
    urls: {
      auth: string
      token: string
      user: string
      redirect_base: string
    }
    clientId: string
    clientSecret: string
    scopes: string[]
    userInfo: {
      schema: z.ZodSchema<T>
      parser: (data: T) => { id: string; email: string; name: string }
    }
  }) {
    this.provider = provider
    this.urls = urls
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.scopes = scopes
    this.userInfo = userInfo
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ======================================================
  // Create Auth Url
  // ======================================================
  async createAuthUrl(cookies: Pick<Cookies, 'set'>, options?: AuthUrlOptions) {
    const state = createState(cookies)
    const codeVerifier = createCodeVerifier(cookies)
    const url = new URL(this.urls.auth)
    url.searchParams.set('client_id', this.clientId)
    url.searchParams.set('redirect_uri', this.urls.redirect_base.toString())
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', this.scopes.join(' '))

    url.searchParams.set('state', state)
    url.searchParams.set('code_challenge_method', 'S256')

    const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url')
    url.searchParams.set('code_challenge', codeChallenge)

    // Add this:
    if (this.provider === 'google') {
      url.searchParams.set('access_type', 'offline')

      if (options?.forceConsent) {
        url.searchParams.set('prompt', 'consent')
      }
    }

    // Redirect to the constructed OAuth URL
    return url.toString()
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ======================================================
  // Fetch Token
  // ======================================================
  async fetchToken({ code, codeVerifier }: { code: string; codeVerifier: string }): Promise<OAuthTokenResponse> {
    const response = await fetchOAuthToken({
      tokenUrl: this.urls.token,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.urls.redirect_base,
      code,
      codeVerifier
    })

    const parsed = this.tokenSchema.safeParse(response)

    if (!parsed.success) {
      throw new InvalidTokenError(parsed.error)
    }

    return {
      accessToken: parsed.data.access_token,
      tokenType: parsed.data.token_type ?? 'Bearer',
      refreshToken: parsed.data.refresh_token,
      expiresIn: parsed.data.expires_in,
      scope: parsed.data.scope
    }
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ======================================================
  // Fetch User
  // ======================================================
  async fetchUser({
    code,
    state,
    cookies
  }: {
    code: string
    state: string
    cookies: Pick<Cookies, 'get' | 'delete'>
  }): Promise<OAuthUserResult> {
    const isValidState = await validateState(state, cookies)
    if (!isValidState) throw new InvalidStateError()

    const { accessToken, tokenType, refreshToken, expiresIn, scope } = await this.fetchToken({
      code,
      codeVerifier: getCodeVerifier(cookies)
    })

    const rawData = await fetchOAuthUser({
      userUrl: this.urls.user,
      accessToken,
      tokenType
    })

    // Validate with schema
    const parsed = this.userInfo.schema.safeParse(rawData)
    if (!parsed.success) {
      throw new InvalidUserError(parsed.error)
    }

    cookies.delete('oauth_validate_cookie')
    cookies.delete('oauth_code_verifier')

    const user = this.userInfo.parser(parsed.data)

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn,
      scope
    }
  }

  // =====================================================================================================================
  // =====================================================================================================================
}

function createState(cookies: Pick<Cookies, 'set'>) {
  const state = randomBytes(64).toString('hex')
  cookies.set('oauth_validate_cookie', state, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + 10 * 60 * 1000)
  })
  return state
}

function createCodeVerifier(cookies: Pick<Cookies, 'set'>) {
  const codeVerifier = randomBytes(64).toString('hex')
  cookies.set('oauth_code_verifier', codeVerifier, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + 10 * 60 * 1000)
  })
  return codeVerifier
}

// =====================================================================================================================
// =====================================================================================================================

function validateState(state: string, cookies: Pick<Cookies, 'get'>) {
  const cookieState = cookies.get('oauth_validate_cookie')?.value
  return cookieState === state
}

function getCodeVerifier(cookies: Pick<Cookies, 'get'>) {
  const codeVerifier = cookies.get('oauth_code_verifier')?.value
  if (codeVerifier == null) throw new InvalidCodeVerifierError()
  return codeVerifier
}

// =====================================================================================================================
// =====================================================================================================================
