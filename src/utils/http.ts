export const badRequest = <T,>(body: T) => ({
  statusCode: 400,
  body
})

export const created = <T,>(body: T) => ({
  statusCode: 201,
  body
})

export const internalServerError = <T,>(body: T) => ({
  statusCode: 500,
  body
})

export const ok = <T,>(body: T) => ({
  statusCode: 200,
  body
})

export const unauthorized = <T,>(body: T) => ({
  statusCode: 403,
  body
})

export const httpError = (message: string) => ({
  message
})
