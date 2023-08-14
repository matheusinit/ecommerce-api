export interface Cookie {
  key: string
  value: any
  httpOnly: boolean
  maxAge?: number
}

export interface HttpResponse {
  body?: any
  statusCode: number
  cookies?: Cookie[]
  cookiesBin?: string[]
  headers?: Record<string, string>
}
