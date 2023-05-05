import { describe, it, expect } from 'vitest'
import { verifyToken } from './verify-token'

describe('Verify token', () => {
  it('should throw an if token is mal formed', async () => {
    const sut = verifyToken
    const token = 'invalid-token'

    const result = sut(token)

    void expect(result).rejects.toThrowError()
  })
})
