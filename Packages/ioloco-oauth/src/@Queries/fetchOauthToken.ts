export async function fetchOAuthToken({
  tokenUrl,
  clientId,
  clientSecret,
  redirectUri,
  code,
  codeVerifier
}: {
  tokenUrl: string
  clientId: string
  clientSecret: string
  redirectUri: string
  code: string
  codeVerifier: string
}) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: params
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OAuth token error response:', errorText)
    throw new Error(`OAuth token request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
