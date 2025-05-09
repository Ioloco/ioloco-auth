import { describe, it, expect, vi } from 'vitest'
import { createCookieStore } from 'Server/cookie-store'

// =====================================================================================================================

describe('createCookieStore', () => {
  const mockCookiesInstance = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  }

  const store = createCookieStore(mockCookiesInstance)

  // =====================================================================================================================
  // =====================================================================================================================

  it('should return a cookie value if present', () => {
    mockCookiesInstance.get.mockReturnValue({ value: '123abc' })

    const result = store.get('session_id')
    expect(result).toEqual({ value: '123abc' })
    expect(mockCookiesInstance.get).toHaveBeenCalledWith('session_id')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should return undefined if cookie not found', () => {
    mockCookiesInstance.get.mockReturnValue(undefined)

    const result = store.get('missing_cookie')
    expect(result).toBeUndefined()
    expect(mockCookiesInstance.get).toHaveBeenCalledWith('missing_cookie')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should call set on the cookies instance', () => {
    const options = { path: '/', maxAge: 3600 }

    store.set('token', 'abc123', options)
    expect(mockCookiesInstance.set).toHaveBeenCalledWith('token', 'abc123', options)
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should delete cookie with just a name', () => {
    store.delete('token')
    expect(mockCookiesInstance.delete).toHaveBeenCalledWith('token')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should delete cookie with name and options', () => {
    store.delete('token', { path: '/' })
    expect(mockCookiesInstance.delete).toHaveBeenCalledWith({ name: 'token', path: '/' })
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
