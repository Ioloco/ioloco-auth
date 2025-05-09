import { signInRequest } from '@Queries/Backend/signin'

// =====================================================================================================================

// =========================================
// Type
// =========================================
const allowedProviders = ['email', 'google', 'github', 'linkedin', 'apple', 'meta'] as const

type AuthProvider = (typeof allowedProviders)[number]

export type SignInData = {
  email?: string
  password?: string
  [key: string]: unknown
}

export type SignInOptions = {
  redirectTo?: string
}

// =========================================
// Signin
// =========================================
export async function signIn(
  provider: AuthProvider,
  data: SignInData = {},
  options: SignInOptions = {}
): Promise<void> {
  if (!allowedProviders.includes(provider)) {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  switch (provider) {
    // =========================================
    // Email
    // =========================================
    case 'email':
      const { email, password } = data

      if (!email || !password) {
        throw new Error('Email and password are required for email sign-in.')
      }

      await signInRequest(data)

      if (options.redirectTo) {
        window.location.href = options.redirectTo
      }

      break

    // =========================================
    // Google
    // =========================================
    case 'google':
      break

    // =========================================
    // Github
    // =========================================
    case 'github':
      break

    // =========================================
    // Linkedin
    // =========================================
    case 'linkedin':
      break

    // =========================================
    // Apple
    // =========================================
    case 'apple':
      break

    // =========================================
    // Meta
    // =========================================
    case 'meta':
      break

    // case "meta": {
    //   // Redirect to OAuth2 provider (handled on backend)
    //   const url = new URL(`${uri}/auth/oauth/${provider}`);
    //   if (options.redirectTo) {
    //     url.searchParams.set("redirectTo", options.redirectTo);
    //   }
    //   window.location.href = url.toString();
    //   break;
    // }

    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
