import { type Product } from '@prisma/client'
import { type CreateOperationDtos, type ProductRepository } from '../protocols/product-repository'

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = []
  async create (data: CreateOperationDtos, id?: string): Promise<Product> {
    const {
      name, price, userId
    } = data

    if (!id) throw Error('Must pass id property')

    const product = {
      id,
      name,
      price,
      userId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    }

    this.products.push(product)

    return product
  }
}
