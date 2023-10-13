import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { httpError, unauthorized } from '~/utils/http'

export class SendConfirmationEmailController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return unauthorized(httpError('Unauthorized'))
  }
}
