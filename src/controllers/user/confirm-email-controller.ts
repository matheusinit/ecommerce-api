import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { type Email } from '~/usecases/user/email'
import { badRequest, httpError, notFound } from '~/utils/http'

export class ConfirmEmailController {
  constructor (
    private readonly email: Email
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const token = request.query?.token ?? ''

      await this.email.confirm(token)
    } catch (err) {
      const error = err as Error

      if (error.message === 'Token not found') {
        return notFound(httpError('Token not found'))
      }

      return badRequest(httpError('Invalid token'))
    }
  }
}
