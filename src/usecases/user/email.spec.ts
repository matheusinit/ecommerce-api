import { describe, it, expect } from 'vitest'
import { Email } from './email'

describe('Email', () => {
  it('when invalid token is provided, then should throw an error', () => {
    const sut = new Email()

    const promise = sut.confirm('invalid-token')

    void expect(promise).rejects.toThrowError('Invalid token')
  })
})
