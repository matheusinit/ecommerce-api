import { type CreateProduct } from '~/data/protocols/create-product'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, created, httpError, internalServerError, unauthorized } from '~/utils/http'

export class CreateProductController implements Controller {
  constructor (
    private readonly createProduct: CreateProduct
  ) {}

  async handle (request: HttpRequest) {
    try {
      const { name, price, userId } = request.body

      if (!name) {
        return badRequest('Name is required')
      }

      if (!price) {
        return badRequest('Price is required')
      }

      if (!userId) {
        return badRequest('User ID is required')
      }

      const product = await this.createProduct.execute({ name, price, userId })

      return created(product)
    } catch (error) {
      if (error instanceof Error && error.message === 'User does not have authorization') {
        return unauthorized(httpError(error.message))
      }

      return internalServerError(httpError('expected error occured'))
    }
  }
}
