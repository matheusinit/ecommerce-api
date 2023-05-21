import { type Request, type Response } from 'express'
import { type CreateProduct } from '~/usecases/create-product'

export class CreateProductController {
  constructor (
    private readonly createProduct: CreateProduct
  ) {}

  async handle (request: Request, response: Response) {
    const { name, price, userId } = request.body

    if (!name) {
      return response.status(400).send({
        message: 'Name is required'
      })
    }

    if (!price) {
      return response.status(400).send({
        message: 'Price is required'
      })
    }

    if (!userId) {
      return response.status(400).send({
        message: 'User ID is required'
      })
    }

    const product = await this.createProduct.execute({ name, price, userId })

    return response.status(201).send(product)
  }
}
