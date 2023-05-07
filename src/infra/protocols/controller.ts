import { type Request, type Response } from 'express'

export interface Controller {
  handle: (request: Request, response: Response) => Promise<Response>
}
