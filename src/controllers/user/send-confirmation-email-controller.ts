import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { type ConfirmationEmailQueueImpl } from '~/usecases/user/confirmation-email-queue'
import { badRequest, httpError } from '~/utils/http'

export class SendConfirmationEmailController {
  constructor (
    private readonly confirmationEmailQueue: ConfirmationEmailQueueImpl
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    await this.confirmationEmailQueue.enqueue(request.body.email)

    return badRequest(httpError('User is already verified'))
  }
}
