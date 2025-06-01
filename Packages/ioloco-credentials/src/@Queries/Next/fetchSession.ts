import promiseResolver from '@/Error/promiseResolver'

export const fetchAccessSession = () =>
  promiseResolver(async () => {
    const res = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to fetch access session')
    return res.json()
  })
