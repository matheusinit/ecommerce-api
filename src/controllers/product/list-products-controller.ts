import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { validatePaginationQueryParams } from '~/lib/pagination'
import { type ListProducts } from '~/usecases/product/list-products'
import { badRequest, httpError, internalServerError, notFound, ok, partialContent } from '~/utils/http'
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

interface SearchByField {
  value: string
  type: 'fuzzy' | 'startsWith' | 'endsWith'
}

const checkForFieldInQuery = (query: string | undefined, fieldName: string) =>
  query === fieldName || query?.split(',').includes(fieldName)

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
      const nameQuery = request.query?.name

      const { perPage, page } = validatePaginationQueryParams({ perPage: perPageQuery, page: pageQuery })

      const skipCount = page * perPage
      const getCount = perPage

      const nameSearch: SearchByField = {
        value: nameQuery ?? '',
        type: 'fuzzy'
      }

      if (nameQuery?.at(0) === '*') {
        nameSearch.type = 'endsWith'
        nameSearch.value = nameQuery.slice(-1)
      } else if (nameQuery?.at(nameQuery.length - 1) === '*') {
        nameSearch.type = 'startsWith'
        nameSearch.value = nameQuery.slice(0, 1)
      }

      const { products, count } = await this.listProducts.execute({
        skipCount,
        getCount,
        select: {
          name: checkForFieldInQuery(fieldsQuery, 'name'),
          price: checkForFieldInQuery(fieldsQuery, 'price'),
          userId: checkForFieldInQuery(fieldsQuery, 'userId'),
          id: checkForFieldInQuery(fieldsQuery, 'id'),
          createdAt: checkForFieldInQuery(fieldsQuery, 'createdAt'),
          updatedAt: checkForFieldInQuery(fieldsQuery, 'updatedAt'),
          deletedAt: checkForFieldInQuery(fieldsQuery, 'deletedAt')
        },
        search: {
          name: nameSearch
        }
      })

      const pageCount = Math.ceil(count / perPage)

      if (page >= pageCount && page > 0) {
        return notFound(httpError(`Page query param is greater than the number of pages: ${pageCount}`))
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

        const responseBody = {
          _metadata: {
            page_count: pageCount,
            total_count: count,
            page,
            per_page: perPage,
            links: linksArray
          },
          data: products

        }

        return fieldsQuery
          ? partialContent(responseBody)
          : ok(responseBody)
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

      const response = fieldsQuery ? partialContent(products) : ok(products)

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

      return internalServerError('Unexpect error occured')
    }
  }
}
