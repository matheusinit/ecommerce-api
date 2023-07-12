import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type UpdateSignInToken } from '~/usecases/update-sign-in-token'
import { ok } from '~/utils/http'

export class UpdateSignInTokenController implements Controller {
  constructor (
    private readonly updateSignInToken: UpdateSignInToken
  ) {}

  async handle (request: HttpRequest) {
    const { refreshToken } = request.body

    const token = await this.updateSignInToken.execute({ refreshToken })

    return ok(token)
  }
}
