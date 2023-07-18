import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type LogoutUser } from '~/usecases/logout-user'
import { httpError, internalServerError, ok, unauthorized } from '~/utils/http'

export class LogoutUserController implements Controller {
  constructor (
    private readonly logoutUser: LogoutUser
  ) {}

  async handle (request: HttpRequest) {
    const accessToken = request.cookies['access-token']

    if (!accessToken) {
      return unauthorized(httpError('user not authenticated'))
    }

    const result = await this.logoutUser.execute({
      accessToken
    })

    if (!result.sucess) {
      return internalServerError(result)
    }

    const response = ok(result)

    return {
      ...response,
      cookiesBin: ['access-token', 'refresh-token']
    }
  }
}
