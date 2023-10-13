import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { type ConfirmationEmailImpl } from '~/usecases/user/confirmation-email'
import { badRequest, httpError } from '~/utils/http'

export class SendConfirmationEmailController {
  constructor (
    private readonly confirmationEmail: ConfirmationEmailImpl
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    await this.confirmationEmail.send(request.body.email)

    return badRequest(httpError('User is already verified'))
  }
}
