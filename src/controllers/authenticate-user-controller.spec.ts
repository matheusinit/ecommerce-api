import { describe, it, expect, vitest } from 'vitest'
import { AuthenticateUserController } from './authenticate-user-controller'
import { type AuthenticateUser } from '~/data/protocols/authenticate-user'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { httpError } from '~/utils/http'

const makeAuthenticateUser = () => {
  class AuthenticateUserStub implements AuthenticateUser {
    async execute (request: { email: string, password: string }) {
      return {
        accessToken: 'random-token',
        refreshToken: 'random-token'
      }
    }
  }

  return new AuthenticateUserStub()
}

const makeSut = () => {
  const authenticateUser = makeAuthenticateUser()

  const sut = new AuthenticateUserController(authenticateUser)

  return {
    sut,
    authenticateUser
  }
}

describe('Authenticate user controller', () => {
  it('should return a bad request if email is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'random-password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.body).toEqual(httpError('email is required'))
  })

  it('should return a bad request if password is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'random-email@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.body).toEqual(httpError('password is required'))
  })

  it('should return a internal server error if email could not reach the usecase class', async () => {
    const { sut, authenticateUser } = makeSut()

    vitest.spyOn(authenticateUser, 'execute').mockReturnValueOnce(Promise.reject(new Error('\'email\' is not provided')))

    const httpRequest: HttpRequest = {
      body: {
        email: 'random-email@email.com',
        password: 'random-email'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.body).toEqual(httpError('an internal error occured involving the \'email\' field'))
  })
})
