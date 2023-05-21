import { type AuthenticateUser } from '~/usecases/authenticate-user'
import ms from 'ms'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { ok } from '~/utils/http'
import { type Cookie } from '~/infra/protocols/http-response'
import { defineCookies } from '~/utils/cookies'

export class AuthenticateUserController implements Controller {
  constructor (
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle (request: HttpRequest) {
    const { email, password } = request.body

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
  }
}
