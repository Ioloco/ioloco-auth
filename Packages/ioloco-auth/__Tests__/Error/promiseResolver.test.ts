import { describe, it, expect } from 'vitest'
import promiseResolver from 'Error/promiseResolver'

// =====================================================================================================================

describe('promiseResolver', () => {
  it('should resolve a successful promise and return data', async () => {
    const mockFn = async () => 'success'

    const [result, error] = await promiseResolver(mockFn)

    expect(result).toBe('success')
    expect(error).toBeNull()
  })

  // =====================================================================================================================
  // =====================================================================================================================

  it('should catch a rejected promise and return error', async () => {
    const mockError = new Error('Something went wrong')
    const mockFn = async () => {
      throw mockError
    }

    const [result, error] = await promiseResolver(mockFn)

    expect(result).toBeNull()
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('Something went wrong')
  })

  // =====================================================================================================================
  // =====================================================================================================================
})
