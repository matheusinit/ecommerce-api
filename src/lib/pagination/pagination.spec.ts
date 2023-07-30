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
  })
})
