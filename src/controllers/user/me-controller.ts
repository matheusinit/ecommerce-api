import { env } from '~/config/env'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { verifyToken } from '~/usecases/auth/verify-token'
import { ok } from '~/utils/http'

export class MeController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const accessToken = request?.cookies['access-token']

    const payload = await verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

    return ok(payload)
  }
}
