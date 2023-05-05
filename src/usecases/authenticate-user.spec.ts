import { expect, it, describe } from 'vitest'
import { AuthenticateUser } from './authenticate-user'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'
import { hash } from '~/utils/hashing'

const makeSut = () => {
  const userRepositoryInMemory = new InMemoryUserRepository()
  const sut = new AuthenticateUser(userRepositoryInMemory)

  return {
    sut,
    userRepositoryInMemory
  }
}

describe('Authenticate User', () => {
  it('should throw if email is not provided', async () => {
    const { sut } = makeSut()

    const userCredentails = {
      password: 'random-password'
    }

    // @ts-expect-error "This should not use email property to test feature in run time instead of compile time"
    const promise = sut.execute(userCredentails)

    void expect(promise).rejects.toThrowError('\'email\' is not provided')
  })

  it('should throw if password is not provided', async () => {
    const { sut } = makeSut()

    const userCredentails = {
      email: 'user@email.com'
    }

    // @ts-expect-error "This should not use password property to test feature in run time instead of compile time"
    const promise = sut.execute(userCredentails)

    void expect(promise).rejects.toThrowError('\'password\' is not provided')
  })

  it('should throw if the email is not registered', async () => {
    const { sut } = makeSut()

    const userCredentails = {
      email: 'not-registered-user@email.com',
      password: 'random-password'
    }

    const promise = sut.execute(userCredentails)

    void expect(promise).rejects.toThrowError('Email not registered or password is wrong')
  })

  it('should throw if the password doesnt not matches', async () => {
    const { sut, userRepositoryInMemory } = makeSut()

    await userRepositoryInMemory.store({
      email: 'user@email.com',
      password: await hash('actual-password'),
      type: 'CUSTOMER'
    })

    const userCredentails = {
      email: 'user@email.com',
      password: 'wrong-password'
    }

    const promise = sut.execute(userCredentails)

    void expect(promise).rejects.toThrowError('Email not registered or password is wrong')
  })

  it('should return a json web token', async () => {
    const { sut, userRepositoryInMemory } = makeSut()
    await userRepositoryInMemory.store({
      email: 'user@email.com',
      password: await hash('random-password'),
      type: 'CUSTOMER'
    })

    const userCredentails = {
      email: 'user@email.com',
      password: 'random-password'
    }

    const response = await sut.execute(userCredentails)

    expect(response.token).toBeTypeOf('string')
  })
})
