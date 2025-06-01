import { describe, it, expect } from 'vitest'
import { handleOAuthCallbackError } from 'Error/handleOauthCallbackError' // adjust path as needed

// =====================================================================================================================
// =====================================================================================================================

describe('handleOAuthCallbackError', () => {
  const redirectTo = 'http://localhost:3000'

  // =====================================================================================================================
  // =====================================================================================================================

  it('returns redirect URL with error when "error" is provided', () => {
    const result = handleOAuthCallbackError({
      error: 'access_denied',
      code: 'abc123',
      state: 'xyz456',
      redirectTo
    })

    expect(result).toBe('http://localhost:3000?error=access_denied')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('encodes special characters in the error parameter', () => {
    const result = handleOAuthCallbackError({
      error: 'some error with spaces & symbols!',
      code: 'abc',
      state: 'def',
      redirectTo
    })

    expect(result).toBe('http://localhost:3000?error=some%20error%20with%20spaces%20%26%20symbols!')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('returns redirect with error if "code" is missing', () => {
    const result = handleOAuthCallbackError({
      error: undefined,
      code: undefined,
      state: 'state123',
      redirectTo
    })

    expect(result).toBe('http://localhost:3000?error=missing_code_or_state')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('returns redirect with error if "state" is missing', () => {
    const result = handleOAuthCallbackError({
      error: undefined,
      code: 'code123',
      state: undefined,
      redirectTo
    })

    expect(result).toBe('http://localhost:3000?error=missing_code_or_state')
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('returns null when there is no error and both code and state are present', () => {
    const result = handleOAuthCallbackError({
      error: undefined,
      code: 'code123',
      state: 'state456',
      redirectTo
    })

    expect(result).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
