import { expect, describe, it } from 'vitest'
import { validatePaginationQueryParams } from '.'

describe('Pagination', () => {
  describe('Validate pagination query params', () => {
    it('when query params is provided, get back query params', async () => {
      const page = '0'
      const perPage = '10'

      const queryParams = validatePaginationQueryParams({
        page, perPage
      })

      expect(queryParams).toBeDefined()
    })

    it('when query params is provided, get query params in number type', async () => {
      const page = '0'
      const perPage = '10'

      const queryParams = validatePaginationQueryParams({
        page, perPage
      })

      expect(queryParams).toMatchObject({
        page: 0,
        perPage: 10
      })
    })

    it('when only page query param is provided, get default value for per page', async () => {
      const page = '0'
      const perPage = undefined
      const expectedDefault = 10

      const queryParams = validatePaginationQueryParams({
        page, perPage
      })

      expect(queryParams).toMatchObject({
        page: 0,
        perPage: expectedDefault
      })
    })
  })
})
