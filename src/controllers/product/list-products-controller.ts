import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { validatePaginationQueryParams } from '~/lib/pagination'
import { type ListProducts } from '~/usecases/list-products'
import { badRequest, httpError, internalServerError, ok } from '~/utils/http'
import { defineResponseHeader } from '~/utils/response-headers'

export class ListProductsController implements Controller {
  constructor (
    private readonly listProducts: ListProducts
  ) {}

  async handle (request: HttpRequest) {
    try {
      const perPageQuery = request.query?.per_page
      const pageQuery = request.query?.page
      const includeQuery = request.query?.include

      const { perPage, page } = validatePaginationQueryParams({ perPage: perPageQuery, page: pageQuery })

      const skipCount = page * perPage
      const getCount = perPage

      const { products, count } = await this.listProducts.execute({
        skipCount,
        getCount
      })

      const pageCount = Math.ceil(count / perPage)

      if (includeQuery === 'metadata') {
        return ok({
          _metadata: {
            page_count: pageCount,
            total_count: count,
            page,
            per_page: perPage,
            links: [
              { self: `/products?page=${page}&per_page=${perPage}` },
              { first: `/products?page=0&per_page=${perPage}` },
              { next: `/products?page=${page + 1}&per_page=${perPage}` },
              { last: `/products?page=${pageCount - 1}&per_page=${perPage}` }
            ]
          },
          data: products
        })
      }

      const response = ok(products)

      return defineResponseHeader(response, {
        'Pagination-Page-Count': String(pageCount),
        'Pagination-Total-Count': String(count),
        'Pagination-Page': String(page),
        'Pagination-Per-Page': String(perPage)
      })
    } catch (err) {
      const error = err as Error

      if (error.message === 'per_page has to be 1 or greater') {
        return badRequest(httpError(error.message))
      }

      return internalServerError('unexpect error occured')
    }
  }
}
