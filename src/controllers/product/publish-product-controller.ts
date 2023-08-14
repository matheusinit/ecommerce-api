import { type PublishProduct } from '~/data/protocols/publish-product'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, created, httpError, internalServerError, forbidden } from '~/utils/http'
import { verifyToken } from '~/usecases/verify-token'
import { env } from '~/config/env'
import { z } from 'zod'

export class PublishProductController implements Controller {
  constructor (
    private readonly publishProduct: PublishProduct
  ) {}

  async handle (request: HttpRequest) {
    try {
      const { name, price } = request.body

      const accessToken = request.cookies['access-token']

      const { id: userId } = await verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

      if (!name) {
        return badRequest(httpError('Name is required'))
      }

      const ProductNameSchema = z.string().min(5)

      const validation = ProductNameSchema.safeParse(name)

      if (!validation.success) {
        return badRequest(httpError('Name requires at least 5 characters'))
      }

      if (!price) {
        return badRequest(httpError('Price is required'))
      }

      const product = await this.publishProduct.execute({ name, price, userId })

      return created(product)
    } catch (error) {
      if (error instanceof Error && error.message === 'User does not have authorization') {
        return forbidden(httpError(error.message))
      }

      return internalServerError(httpError('Unexpected error occured'))
    }
  }
}
