import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, httpError } from '~/utils/http'
import z from 'zod'

export class EditProductController {
  async handle (request: HttpRequest) {
    const { id } = request.params

    const idValidation = z.string().cuid()

    const validation = idValidation.safeParse(id)

    if (!validation.success) {
      return badRequest(httpError('Product id must be a cuid'))
    }

    if (request.body.name === '') {
      return badRequest(httpError('Name cannot be a empty string'))
    }

    return badRequest(httpError('Must pass a value for fields to edit a product: name, price or stock'))
  }
}
