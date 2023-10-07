import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'
import { type Email } from '~/usecases/procotols/email'
import { badRequest, httpError, internalServerError, noContent, notFound } from '~/utils/http'

export class ConfirmEmailController {
  constructor (
    private readonly email: Email
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const token = request.query?.token ?? ''

      await this.email.confirm(token)

      return noContent()
    } catch (err) {
      const error = err as Error

      if (error.message === 'Token not found') {
        return notFound(httpError('Token not found'))
      }

      if (error.message === 'Invalid token') {
        return badRequest(httpError('Invalid token'))
      }

      if (error.message === 'Token expired') {
        return badRequest(httpError('Token expired'))
      }

      if (error.message === 'User is already verified') {
        return badRequest(httpError('User is already verified'))
      }

      return internalServerError(httpError('Internal server error'))
    }
  }
}
