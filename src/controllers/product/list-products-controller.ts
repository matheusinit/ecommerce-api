import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { validatePaginationQueryParams } from '~/lib/pagination'
import { type ListProducts } from '~/usecases/list-products'
import { badRequest, httpError, ok } from '~/utils/http'
import { defineResponseHeader } from '~/utils/response-headers'

export class ListProductsController implements Controller {
  constructor (
    private readonly listProducts: ListProducts
  ) {}

  async handle (request: HttpRequest) {
    const perPageQuery = request.query?.per_page
    const pageQuery = request.query?.page

    if (perPageQuery === '0') {
      return badRequest(httpError('per_page has to be 1 or greater'))
    }

    const { perPage, page } = validatePaginationQueryParams({ perPage: perPageQuery, page: pageQuery })

    const skipCount = page * perPage
    const getCount = perPage

    const products = await this.listProducts.execute({
      skipCount,
      getCount
    })

    const response = ok(products)

    return defineResponseHeader(response, {
      'Pagination-Page-Count': '2',
      'Pagination-Total-Count': '10'
    })
  }
}
