import { type HttpRequest } from '~/infra/protocols/http-request'
import { type HttpResponse } from '~/infra/protocols/http-response'

export interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>
}
