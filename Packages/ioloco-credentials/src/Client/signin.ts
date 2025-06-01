// Queries
import { signInRequest } from '@Queries/Backend/signin'

// Types
import { AuthProvider, EmailSignInOptions, OauthSignInOptions, SignInData, allowedProviders } from '@Types/signin'

// =====================================================================================================================

// =========================================
// Overload
// =========================================
export function signIn(provider: 'credentials', data: SignInData, options: EmailSignInOptions): Promise<void>
export function signIn(provider: 'Oauth Provider', data: SignInData, options: OauthSignInOptions): Promise<void>

// =========================================
// Signin
// =========================================
export async function signIn(
  provider: AuthProvider,
  data: SignInData = {},
  options: EmailSignInOptions | OauthSignInOptions
): Promise<void> {
  // =========================================
  // Provider Check
  // =========================================
  if (!allowedProviders.includes(provider)) {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  switch (provider) {
    // =========================================
    // Email
    // =========================================
    case 'credentials':
      {
        const { email, password } = data

        if (!email || !password) {
          throw new Error('Email and password are required for email sign-in.')
        }

        const response = await signInRequest(data)

        if (response?.temporaryToken) {
          window.location.href = `/mfa?temporary_token=${response.temporaryToken}`
          return
        }

        if ('redirectTo' in options && options.redirectTo) {
          window.location.href = options.redirectTo
        }
      }

      break

    // =========================================
    // Oauth Provider
    // =========================================
    case 'Oauth Provider':
      {
        if (!('oauthUrl' in options) || !options.oauthUrl) {
          throw new Error('oauthUrl is required for OAuth redirection.')
        }

        window.location.href = `${options.oauthUrl}`
      }
      break

    // =========================================
    // Default
    // =========================================
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
