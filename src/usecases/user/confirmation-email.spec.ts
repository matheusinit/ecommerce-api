import { it, describe, expect } from 'vitest'
import { ConfirmationEmail } from './confirmation-email'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'

describe('Send confirmation email', () => {
  it('when email is not provided, then should get an error', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new ConfirmationEmail(userRepository)

    // @ts-expect-error "Pass email as undefined to test case"
    const promise = sut.send()

    void expect(promise).rejects.toThrowError('Email is required')
  })

  it('when an invalid email is provided, then should get an error', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new ConfirmationEmail(userRepository)

    const promise = sut.send('invalid-email')

    void expect(promise).rejects.toThrowError('Invalid email was provided does not has the format: john.doe@email.com')
  })

  it('when a user is not found with given email, then should get an error', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new ConfirmationEmail(userRepository)

    const promise = sut.send('matheus@email.com')

    void expect(promise).rejects.toThrowError('User not found with given email')
  })
})
