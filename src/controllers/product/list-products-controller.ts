import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type ListProducts } from '~/usecases/list-products'
import { ok } from '~/utils/http'

export class ListProductsController implements Controller {
  constructor (
    private readonly listProducts: ListProducts
  ) {}

  async handle (request: HttpRequest) {
    const products = await this.listProducts.execute()

    return ok(products)
  }
}
