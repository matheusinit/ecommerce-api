import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, httpError, ok } from '~/utils/http'
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

    if (request.body.price && request.body.price < 0) {
      return badRequest(httpError('Price cannot be a negative number'))
    }

    if (request.body.stock && request.body.stock < 0) {
      return badRequest(httpError('Stock cannot be a negative number'))
    }

    if (request.body.name && request.body.name.length < 3) {
      return badRequest(httpError('Name must be at least 3 characters long'))
    }

    if (!request.body.name && !request.body.price && !request.body.stock) {
      return badRequest(httpError('Must pass a value for fields to edit a product: name, price or stock'))
    }

    return ok({})
  }
}
