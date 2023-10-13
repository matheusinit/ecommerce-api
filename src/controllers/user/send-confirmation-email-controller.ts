import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { type ConfirmationEmailQueueImpl } from '~/usecases/user/confirmation-email-queue'
import { badRequest, httpError, notFound } from '~/utils/http'

export class SendConfirmationEmailController {
  constructor (
    private readonly confirmationEmailQueue: ConfirmationEmailQueueImpl
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      await this.confirmationEmailQueue.enqueue(request.body.email)
    } catch (err) {
      const error = err as Error

      if (error.message === 'Email is required') {
        return badRequest(httpError('Email is required'))
      }

      if (error.message === 'User is already verified') {
        return badRequest(httpError('User is already verified'))
      }

      if (error.message === 'User not found with given email') {
        return notFound(httpError('User not found with given email'))
      }
    }
  }
}
