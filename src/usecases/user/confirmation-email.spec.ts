import { it, describe, expect } from 'vitest'
import { ConfirmationEmail } from './confirmation-email'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'

const makeSut = () => {
  const userRepository = new InMemoryUserRepository()
  const sut = new ConfirmationEmail(userRepository)

  return {
    sut, userRepository
  }
}

describe('Send confirmation email', () => {
  it('when email is not provided, then should get an error', async () => {
    const { sut } = makeSut()

    // @ts-expect-error "Pass email as undefined to test case"
    const promise = sut.send()

    void expect(promise).rejects.toThrowError('Email is required')
  })

  it('when an invalid email is provided, then should get an error', async () => {
    const { sut } = makeSut()

    const promise = sut.send('invalid-email')

    void expect(promise).rejects.toThrowError('Invalid email was provided does not has the format: john.doe@email.com')
  })

  it('when an user is not found with given email, then should get an error', async () => {
    const { sut } = makeSut()

    const promise = sut.send('matheus@email.com')

    void expect(promise).rejects.toThrowError('User not found with given email')
  })
})
