// 4. Ensure user can be created of type store administrator
// 5. Ensure user of type customer can be created
// 6. Ensure to throw an error if a unknown type is passed
// 8. Ensure a user logged in cannot create an account
// 9. Ensure that email is a valid email
// 10. Check lengths for name as name and surname
// 11. Check password to be at least 8 chars long and use letter and numbers with special chars
// 12. Check for fields to be empty (ensure that throw if they are, except name)

import { describe, it, expect } from 'vitest'
import { RegisterUser } from './register-user'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'

const makeSut = () => {
  const userRepository = new InMemoryUserRepository()
  const sut = new RegisterUser(userRepository)

  return {
    userRepository,
    sut
  }
}

describe('Register user usecase', () => {
  it('should throw if email is already registered', async () => {
    // Arrange
    const { userRepository, sut } = makeSut()

    await userRepository.store({
      email: 'matheus@email.com',
      password: 'some-random-password',
      type: 'STORE-ADMIN' as const
    })

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password',
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
      password: 'some-random-password',
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
      password: 'some-random-password',
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
      password: 'some-random-password',
      type: 'STORE-ADMIN' as const
    }

    const user = await sut.execute(userData)

    expect(user.type).toBe('STORE-ADMIN')
  })
})
