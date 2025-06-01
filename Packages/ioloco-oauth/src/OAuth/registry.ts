import { OAuthClient } from './AuthClient'

// =====================================================================================================================

const registry = new Map<string, unknown>()

export function registerOAuthProvider<T>(
  provider: string,
  config: ConstructorParameters<typeof OAuthClient<T>>[0]
): void {
  const client = new OAuthClient<T>(config)
  registry.set(provider, client)
}

// =====================================================================================================================
// =====================================================================================================================

export function getOAuthClient<T>(provider: string): OAuthClient<T> {
  const client = registry.get(provider)
  if (!client) {
    throw new Error(`OAuth provider "${provider}" is not registered`)
  }
  return client as OAuthClient<T>
}

// =====================================================================================================================
// =====================================================================================================================
