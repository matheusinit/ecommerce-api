import { type Cookie, type HttpResponse } from '~/infra/protocols/http-response'

export const defineCookies = (response: HttpResponse, cookies: Cookie[]) => ({
  ...response,
  cookies: [...cookies]
})
