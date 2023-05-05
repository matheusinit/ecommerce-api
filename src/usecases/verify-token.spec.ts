import { describe, it, expect } from 'vitest'
import { verifyToken } from './verify-token'

describe('Verify token', () => {
  it('should throw an if token is mal formed', async () => {
    const sut = verifyToken
    const token = 'invalid-token'

    const result = sut(token)

    void expect(result).rejects.toThrowError()
  })

  it('should throw an error if token is invalid', async () => {
    const sut = verifyToken
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    const result = sut(token)

    void expect(result).rejects.toThrowError('The token signature is invalid')
  })
})
