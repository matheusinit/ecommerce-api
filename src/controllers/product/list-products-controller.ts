import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { validatePaginationQueryParams } from '~/lib/pagination'
import { type ListProducts } from '~/usecases/list-products'
import { badRequest, httpError, internalServerError, notFound, ok } from '~/utils/http'
import { defineResponseHeader } from '~/utils/response-headers'

interface PageProps {
  page: number
  pageCount: number
}

const filterLinks = (links: string[], linkNames: string[], props: PageProps) => {
  const { page, pageCount } = props

  return linkNames.map((linkName, index) => {
    if (linkName === 'prev' && page === 0) {
      return null
    }

    if (linkName === 'next' && page === pageCount - 1) {
      return null
    }

    return links[index]
  })
}

export class ListProductsController implements Controller {
  constructor (
    private readonly listProducts: ListProducts
  ) {}

  async handle (request: HttpRequest) {
    try {
      const perPageQuery = request.query?.per_page
      const pageQuery = request.query?.page
      const includeQuery = request.query?.include
      const fieldsQuery = request.query?.fields

      const { perPage, page } = validatePaginationQueryParams({ perPage: perPageQuery, page: pageQuery })

      const skipCount = page * perPage
      const getCount = perPage

      const { products, count } = await this.listProducts.execute({
        skipCount,
        getCount,
        select: {
          name: fieldsQuery === 'name' || fieldsQuery?.split(',').includes('name'),
          price: fieldsQuery === 'price' || fieldsQuery?.split(',').includes('price'),
          userId: fieldsQuery === 'userId' || fieldsQuery?.split(',').includes('userId'),
          id: fieldsQuery === 'id' || fieldsQuery?.split(',').includes('id'),
          createdAt: fieldsQuery === 'createdAt' || fieldsQuery?.split(',').includes('createdAt'),
          updatedAt: fieldsQuery === 'updatedAt' || fieldsQuery?.split(',').includes('updatedAt')
        }

      })

      const pageCount = Math.ceil(count / perPage)

      if (page >= pageCount && page > 0) {
        return notFound(httpError(`page query param is greater than the number of pages: ${pageCount}`))
      }

      const linkNames = ['self', 'first', 'prev', 'next', 'last']

      if (includeQuery === 'metadata') {
        const linkReferences = [
          `/products?page=${page}&per_page=${perPage}`,
          `/products?page=0&per_page=${perPage}`,
          `/products?page=${page - 1}&per_page=${perPage}`,
          `/products?page=${page + 1}&per_page=${perPage}`,
          `/products?page=${pageCount - 1}&per_page=${perPage}`
        ]

        const linksArray: Array<Record<string, string>> = []

        const linksFiltered = filterLinks(linkReferences, linkNames, { page, pageCount })

        linkNames.forEach((linkName, index) => {
          const link = linksFiltered[index]

          if (link === null) {
            return
          }

          linksArray.push({
            [linkName]: link
          })
        })

        return ok({
          _metadata: {
            page_count: pageCount,
            total_count: count,
            page,
            per_page: perPage,
            links: linksArray
          },
          data: products
        })
      }

      const linkReferences = [
        `</products?page=${page}&per_page=${perPage}>; rel="self"`,
        `</products?page=0&per_page=${perPage}>; rel="first"`,
        `</products?page=${page - 1}&per_page=${perPage}>; rel="prev"`,
        `</products?page=${page + 1}&per_page=${perPage}>; rel="next"`,
        `</products?page=${pageCount - 1}&per_page=${perPage}>; rel="last"`
      ]

      const linksFiltered = filterLinks(linkReferences, linkNames, { page, pageCount })
        .filter(link => link !== null)

      const linkHeader = linksFiltered.join(',')

      const response = ok(products)

      return defineResponseHeader(response, {
        'Pagination-Page-Count': String(pageCount),
        'Pagination-Total-Count': String(count),
        'Pagination-Page': String(page),
        'Pagination-Per-Page': String(perPage),
        Link: linkHeader
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
