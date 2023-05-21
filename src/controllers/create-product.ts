import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type CreateProduct } from '~/usecases/create-product'
import { badRequest, created } from '~/utils/http'

export class CreateProductController implements Controller {
  constructor (
    private readonly createProduct: CreateProduct
  ) {}

  async handle (request: HttpRequest) {
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
  }
}
