import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { badRequest, httpError } from '~/utils/http'

export class ConfirmEmailController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { token } = request.params

    return badRequest(httpError('Invalid token'))
  }
}
