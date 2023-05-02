import { expect, it, describe } from 'vitest'
import { AuthenticateUser } from './authenticate-user'

describe('Authenticate User', () => {
  it('should throw if email is not provided', async () => {
    const userCredentails = {
      password: 'random-password'
    }
    const sut = new AuthenticateUser()

    // @ts-expect-error "This should not use email property to test feature in run time instead of compile time"
    const promise = sut.execute(userCredentails)

    void expect(promise).rejects.toThrowError()
  })
})
