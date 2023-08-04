export interface HttpRequest {
  body: any
  cookies?: Record<string, any>
  query?: Record<string, string>
}
