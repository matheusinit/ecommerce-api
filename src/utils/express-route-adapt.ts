import { type Request, type Response } from 'express'
import { type Controller } from '~/infra/protocols/controller'

export const expressRouteAdapt = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    return await controller.handle(request, response)
  }
}
