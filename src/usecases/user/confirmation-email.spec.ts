import { it, describe, expect } from 'vitest'
import { ConfirmationEmail } from './confirmation-email'

describe('Send confirmation email', () => {
  it('when email is not provided, then should get an error', async () => {
    const sut = new ConfirmationEmail()

    // @ts-expect-error "Pass email as undefined to test case"
    const promise = sut.send()

    void expect(promise).rejects.toThrowError('Email is required')
  })

  it('when an invalid email is provided, then should get an error', async () => {
    const sut = new ConfirmationEmail()

    const promise = sut.send('invalid-email')

    void expect(promise).rejects.toThrowError('Invalid email was provided does not has the format: john.doe@email.com')
  })
})
