import { describe, it, expect } from 'vitest'
import { Email } from './email'
import { InMemoryConfirmationEmailTokenRepository } from '~/data/repositories/in-memory/in-memory-confirmation-email-token-repository'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'

const makeSut = () => {
  const confirmationEmailTokenRepository = new InMemoryConfirmationEmailTokenRepository()
  const userRepository = new InMemoryUserRepository()
  const sut = new Email(confirmationEmailTokenRepository, userRepository)

  return {
    confirmationEmailTokenRepository,
    userRepository,
    sut
  }
}

describe('Email', () => {
  it('when invalid token is provided, then should throw an error', () => {
    const { sut } = makeSut()

    const promise = sut.confirm('invalid-token')

    void expect(promise).rejects.toThrowError('Invalid token')
  })

  it('when valid token provided is not stored in database, then should throw an error', () => {
    const { sut } = makeSut()
    const validToken = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'

    const promise = sut.confirm(validToken)

    void expect(promise).rejects.toThrowError('Token not found')
  })

  it('when valid token is provided and user is already verified, then should throw an error', async () => {
    const { sut, userRepository, confirmationEmailTokenRepository } = makeSut()
    await userRepository.store({
      email: 'matheus@email.com',
      type: 'CUSTOMER',
      name: 'Matheus Oliveira',
      password: 'random-hash'
    })

    await userRepository.verify('matheus@email.com')

    await confirmationEmailTokenRepository.storeToken('matheus@email.com', 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26')

    const validToken = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'

    const promise = sut.confirm(validToken)

    void expect(promise).rejects.toThrowError('User is already verified')
  })

  it('when valid token is provided, then should verify user', async () => {
    const { sut, userRepository, confirmationEmailTokenRepository } = makeSut()

    await userRepository.store({
      email: 'matheus@email.com',
      type: 'CUSTOMER',
      name: 'Matheus Oliveira',
      password: 'random-hash'
    })

    await confirmationEmailTokenRepository.storeToken('matheus@email.com', 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26')

    const validToken = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'
    await sut.confirm(validToken)

    const user = await userRepository.findByEmail({
      email: 'matheus@email.com'
    })

    expect(user?.verified).toEqual(true)
  })
})
