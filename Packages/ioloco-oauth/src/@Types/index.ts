export type OauthProvider = string

export interface Cookies {
  get(name: string): { value: string } | undefined
  set(
    name: string,
    value: string,
    options?: {
      secure?: boolean
      httpOnly?: boolean
      sameSite?: 'lax' | 'strict' | 'none'
      expires?: Date
    }
  ): void
  delete(name: string): void // ⬅️ add this
}

export type OAuthTokenResponse = {
  accessToken: string
  tokenType: string
  refreshToken?: string
  expiresIn?: number
  scope?: string
}

export type OAuthUserResult = {
  user: {
    id: string
    email: string
    name: string
    [key: string]: unknown
  }
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  scope?: string
}

export type AuthUrlOptions = {
  forceConsent?: boolean
}
