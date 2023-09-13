// 1. Ensure a user logged in cannot create an account

import { describe, it, expect, vitest } from 'vitest'
import { RegisterUser } from './register-user'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'

const makeSut = () => {
  class FakeConfirmationEmail {
    async send (email: string) {
      return null
    }
  }

  const userRepository = new InMemoryUserRepository()
  const confirmationEmailService = new FakeConfirmationEmail()
  const sut = new RegisterUser(userRepository, confirmationEmailService)

  return {
    userRepository,
    confirmationEmailService,
    sut
  }
}

describe('Register user usecase', () => {
  it('should throw if email is already registered', async () => {
    // Arrange
    const { userRepository, sut } = makeSut()

    await userRepository.store({
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'STORE-ADMIN' as const
    })

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'STORE-ADMIN' as const
    }

    // Act
    const promise = sut.execute(userData)

    // Assert
    void expect(promise).rejects.toThrowError()
  })

  it('should return the data on success', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'STORE-ADMIN' as const
    }

    const user = await sut.execute(userData)

    expect(user).toBeTruthy()
    expect(user.name).toBe(userData.name)
    expect(user.email).toBe(userData.email)
    expect(user.password).not.toBe(userData.password)
  })

  it('should return the password hashed', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'STORE-ADMIN' as const
    }

    const user = await sut.execute(userData)
    const [salt, key] = user.password.split(':')

    expect(salt).toBeTruthy()
    expect(key).toBeTruthy()
  })

  it('may be created as type store administrator', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'STORE-ADMIN' as const
    }

    const user = await sut.execute(userData)

    expect(user.type).toBe('STORE-ADMIN')
  })

  it('may be created as type customer', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'CUSTOMER' as const
    }

    const user = await sut.execute(userData)

    expect(user.type).toBe('CUSTOMER')
  })

  it('should throw an error if a unknown type is passed', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'UNKNOWN-TYPE' as const
    }

    // @ts-expect-error "This should use wrong constant to test feature in run time instead of compile time"
    const promise = sut.execute(userData)

    void expect(promise).rejects.toThrowError()
  })

  it('should throw an error if email is not valid', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'invalid_email',
      password: 'some-random-password1.',
      type: 'CUSTOMER' as const
    }

    const promise = sut.execute(userData)

    void expect(promise).rejects.toThrowError()
  })

  it('should throw if name is not 3 chars long at least', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Ab',
      email: 'valid_email@email.com',
      password: 'some-random-password1.',
      type: 'CUSTOMER' as const
    }

    const promise = sut.execute(userData)

    void expect(promise).rejects.toThrowError()
  })

  it('should throw if password is not at least 8 chars long', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'passw',
      type: 'CUSTOMER' as const
    }

    const promise = sut.execute(userData)

    void expect(promise).rejects.toThrowError()
  })

  it('should throw if password does not have numbers in it', async () => {
    const { sut } = makeSut()

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'password',
      type: 'CUSTOMER' as const
    }

    const promise = sut.execute(userData)

    void expect(promise).rejects.toThrowError()
  })

  it('when valid input is provided, then should call service that sends confirmation email', async () => {
    const { sut, confirmationEmailService } = makeSut()
    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password1.',
      type: 'CUSTOMER' as const
    }
    const sendConfirmationEmailSpy = vitest.spyOn(confirmationEmailService, 'send')

    await sut.execute(userData)

    expect(sendConfirmationEmailSpy).toHaveBeenCalled()
  })
})
