export async function fetchOAuthUser({
  userUrl,
  accessToken,
  tokenType
}: {
  userUrl: string
  accessToken: string
  tokenType: string
}) {
  const response = await fetch(userUrl, {
    headers: {
      Authorization: `${tokenType} ${accessToken}`
    }
  })

  return response.json()
}
