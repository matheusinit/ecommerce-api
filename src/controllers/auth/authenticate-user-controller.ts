import ms from 'ms'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, httpError, internalServerError, ok } from '~/utils/http'
import { type Cookie } from '~/infra/protocols/http-response'
import { defineCookies } from '~/utils/cookies'
import { type AuthenticateUser } from '~/data/protocols/authenticate-user'

import z from 'zod'

export class AuthenticateUserController implements Controller {
  constructor (
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle (request: HttpRequest) {
    try {
      const { email, password } = request.body

      if (!email) {
        return badRequest(httpError('Email is required'))
      }

      if (!password) {
        return badRequest(httpError('Password is required'))
      }

      const emailSchema = z.string().email()

      const result = emailSchema.safeParse(email)

      if (!result.success) {
        return badRequest(httpError('Invalid email'))
      }

      const { accessToken, refreshToken } = await this.authenticateUser.execute({
        email,
        password
      })

      const accessTokenCookie: Cookie = {
        key: 'access-token',
        value: accessToken,
        httpOnly: true,
        maxAge: ms('5m')
      }

      const refreshTokenCookie: Cookie = {
        key: 'refresh-token',
        value: refreshToken,
        httpOnly: true,
        maxAge: ms('1w')
      }

      const response = ok({
        accessToken,
        refreshToken
      })

      return defineCookies(response, [accessTokenCookie, refreshTokenCookie])
    } catch (err) {
      const error = err as Error

      if (error instanceof Error && error.message === '\'Email\' is not provided') {
        return internalServerError(httpError('An internal error occured involving the \'email\' field'))
      }

      if (error instanceof Error && error.message === '\'Password\' is not provided') {
        return internalServerError(httpError('An internal error occured involving the \'password\' field'))
      }

      if (error instanceof Error && error.message === 'Email not registered or password is wrong') {
        return badRequest(httpError('Email not registered or password is wrong'))
      }

      return internalServerError(httpError(error.message))
    }
  }
}
