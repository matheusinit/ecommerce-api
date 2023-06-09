import ms from 'ms'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, httpError, internalServerError, ok } from '~/utils/http'
import { type Cookie } from '~/infra/protocols/http-response'
import { defineCookies } from '~/utils/cookies'
import { type AuthenticateUser } from '~/data/protocols/authenticate-user'

export class AuthenticateUserController implements Controller {
  constructor (
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle (request: HttpRequest) {
    try {
      const { email, password } = request.body

      if (!email) {
        return badRequest(httpError('email is required'))
      }

      if (!password) {
        return badRequest(httpError('password is required'))
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
    } catch (error) {
      if (error instanceof Error && error.message === '\'email\' is not provided') {
        return internalServerError(httpError('an internal error occured involving the \'email\' field'))
      }

      if (error instanceof Error && error.message === '\'password\' is not provided') {
        return internalServerError(httpError('an internal error occured involving the \'password\' field'))
      }

      return internalServerError(httpError(error.message))
    }
  }
}
