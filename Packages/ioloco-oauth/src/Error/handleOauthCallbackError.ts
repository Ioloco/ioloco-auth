export function handleOAuthCallbackError({
  error,
  code,
  state,
  redirectTo
}: {
  error?: string
  code?: string
  state?: string
  redirectTo: string
}): string | null {
  if (error) {
    return `${redirectTo}?error=${encodeURIComponent(error)}`
  }

  if (!code || !state) {
    return `${redirectTo}?error=missing_code_or_state`
  }

  return null
}
