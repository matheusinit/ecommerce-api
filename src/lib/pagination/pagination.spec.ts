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

    describe('Missing inputs', () => {
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

      it('when only per page query param is provided, get default value for page', async () => {
        const page = undefined
        const perPage = '10'
        const expectedDefault = 0

        const queryParams = validatePaginationQueryParams({
          page, perPage
        })

        expect(queryParams).toMatchObject({
          page: expectedDefault,
          perPage: 10
        })
      })
    })
  })

  describe('Invalid data', () => {
    it('when 0 is provided as per page value, should throw an error', async () => {
      const perPage = '0'
      const page = '0'

      const sut = () => validatePaginationQueryParams({
        page, perPage
      })

      expect(sut).toThrowError()
    })
  })
})
