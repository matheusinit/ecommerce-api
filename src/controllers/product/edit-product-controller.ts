import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, httpError } from '~/utils/http'

export class EditProductController {
  async handle (request: HttpRequest) {
    return badRequest(httpError('Must pass a value for fields to edit a product: name, price or stock'))
  }
}
