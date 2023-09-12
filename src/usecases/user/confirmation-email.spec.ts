import { it, describe, expect } from 'vitest'
import { ConfirmationEmail } from './confirmation-email'

describe('Send confirmation email', () => {
  it('when email is not provided, then should get an error', async () => {
    const sut = new ConfirmationEmail()

    // @ts-expect-error "Pass email as undefined to test case"
    const promise = sut.send()

    void expect(promise).rejects.toThrowError('Email is required')
  })
})
