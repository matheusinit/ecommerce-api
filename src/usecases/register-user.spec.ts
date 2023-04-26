// 1. Ensure that will throw an error if email is registered
// 2. Ensure returns user data if created successfully
// 3. Ensure password is hashed
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

describe('Register user usecase', () => {
  it('should throw if email is already registered', async () => {
    // Arrange
    const userRepository = new InMemoryUserRepository()
    const sut = new RegisterUser(userRepository)

    await userRepository.store({
      email: 'matheus@email.com',
      password: 'some-random-password'
    })

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password'
    }

    // Act
    const promise = sut.execute(userData)

    // Assert
    void expect(promise).rejects.toThrowError()
  })

  it('should return the data on success', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new RegisterUser(userRepository)

    const userData = {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'some-random-password'
    }

    const user = await sut.execute(userData)

    expect(user).toBeTruthy()
    expect(user.name).toBe(userData.name)
    expect(user.email).toBe(userData.email)
    expect(user.password).not.toBe(userData.password)
  })
})
