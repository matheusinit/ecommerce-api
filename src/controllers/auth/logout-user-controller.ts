import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type LogoutUser } from '~/usecases/auth/logout-user'
import { httpError, ok, unauthorized } from '~/utils/http'

export class LogoutUserController implements Controller {
  constructor (
    private readonly logoutUser: LogoutUser
  ) {}

  async handle (request: HttpRequest) {
    const cookies = request.cookies

    if (!cookies) { throw Error('Cookies not defined') }

    const accessToken = cookies['access-token']

    const result = await this.logoutUser.execute({
      accessToken
    })

    if (!result.success) {
      return unauthorized(httpError('Invalid access token cookie'))
    }

    const response = ok(result)

    return {
      ...response,
      cookiesBin: ['access-token', 'refresh-token']
    }
  }
}
