import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type UpdateSignInToken } from '~/usecases/auth/update-sign-in-token'
import { badRequest, httpError, ok, unauthorized } from '~/utils/http'

export class UpdateSignInTokenController implements Controller {
  constructor (
    private readonly updateSignInToken: UpdateSignInToken
  ) {}

  async handle (request: HttpRequest) {
    if (!request.cookies) {
      return badRequest(httpError('No cookies are defined'))
    }

    const accessToken = request.cookies['access-token']

    const refreshToken = request.cookies['refresh-token']

    if (!accessToken) {
      return unauthorized(httpError('Access token not provided'))
    }

    if (!refreshToken) {
      return unauthorized(httpError('Unauthenticated'))
    }

    const token = await this.updateSignInToken.execute({ refreshToken })

    return ok(token)
  }
}
