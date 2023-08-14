import { type HttpResponse } from '~/infra/protocols/http-response'

export const defineResponseHeader = (response: HttpResponse, headers: Record<string, string>) => {
  response = {
    ...response,
    headers
  }

  return response
}
