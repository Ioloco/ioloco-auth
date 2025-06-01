// =========================================
// Type
// =========================================
export const allowedProviders = ['credentials', 'Oauth Provider'] as const
export type AuthProvider = (typeof allowedProviders)[number]

export type SignInData = {
  email?: string
  password?: string
  [key: string]: unknown
}

export type EmailSignInOptions = {
  redirectTo?: string
}

export type OauthSignInOptions = {
  oauthUrl: string
}

export type SignInResponse = {
  temporaryToken?: string
}
