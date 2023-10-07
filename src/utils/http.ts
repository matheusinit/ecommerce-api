export const badRequest = <T,>(body: T) => ({
  statusCode: 400,
  body
})

export const notFound = <T,>(body: T) => ({
  statusCode: 404,
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

export const noContent = () => ({
  statusCode: 204,
  body: {}
})

export const partialContent = <T,>(body: T) => ({
  statusCode: 206,
  body
})

export const forbidden = <T,>(body: T) => ({
  statusCode: 403,
  body
})

export const unauthorized = <T,>(body: T) => ({
  statusCode: 401,
  body
})

export const httpError = (message: string) => ({
  message
})
