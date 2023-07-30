import { type Request, type Response } from 'express'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'

export const expressRouteAdapt = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      cookies: request.cookies,
      query: request.query
    }

    const httpResponse = await controller.handle(httpRequest)

    const { cookies, cookiesBin, headers } = httpResponse

    cookies?.forEach(cookie => {
      response.cookie(cookie.key, cookie.value, {
        httpOnly: cookie.httpOnly
      })
    })

    cookiesBin?.forEach(cookie => {
      response.clearCookie(cookie)
    })

    if (headers) {
      Object.keys(headers).forEach(headerKey => {
        response.header(headerKey, headers[headerKey])
      })
    }

    return response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
