import { type HttpRequest } from '~/infra/protocols/http-request'
import { badRequest, httpError, internalServerError, ok } from '~/utils/http'
import z from 'zod'
import { type EditProduct } from '~/usecases/product/edit-product'

export class EditProductController {
  constructor (
    private readonly editProduct: EditProduct
  ) {}

  async handle (request: HttpRequest) {
    try {
      // Should not use "as string", write an integration test to check if id is null
      const id = request.params?.id as string

      const idValidation = z.string().cuid()

      const validation = idValidation.safeParse(id)

      if (!validation.success) {
        return badRequest(httpError('Product id must be a cuid'))
      }

      const product = await this.editProduct.execute(id, request.body)

      return ok(product)
    } catch (err) {
      const error = err as Error

      if (error.message === 'name cannot be a empty string') {
        return badRequest(httpError('Name cannot be a empty string'))
      }

      if (error.message === 'price must be a 0 or positive number') {
        return badRequest(httpError('Price cannot be a negative number'))
      }

      if (error.message === 'stock must be a 0 or positive number') {
        return badRequest(httpError('Stock cannot be a negative number'))
      }

      if (error.message === 'name must be at least 3 characters long') {
        return badRequest(httpError('Name must be at least 3 characters long'))
      }

      if (error.message === 'must pass a value for fields to edit a product: name, price or stock') {
        return badRequest(httpError('Must pass a value for fields to edit a product: name, price or stock'))
      }

      return internalServerError(httpError('Unexpected error occured'))
    }
  }
}
