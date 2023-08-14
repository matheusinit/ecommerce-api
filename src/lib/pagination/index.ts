interface ValidatePaginationQueryParamsRequest {
  perPage?: string
  page?: string
}

export const validatePaginationQueryParams = (data: ValidatePaginationQueryParamsRequest) => {
  let perPage: number | undefined
  let page: number | undefined

  if (data.perPage === '0') {
    throw new Error('per_page has to be 1 or greater')
  }

  if (data.perPage) {
    perPage = Number(data.perPage)
  }

  if (data.page) {
    page = Number(data.page)
  }

  return {
    page: page ?? 0,
    perPage: perPage ?? 10
  }
}
