import { expect, it, describe } from 'vitest'
import { AuthenticateUser } from './authenticate-user'

const makeSut = () => {
  const sut = new AuthenticateUser()

  return {
    sut
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
})
