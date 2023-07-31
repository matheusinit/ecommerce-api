import { type Product } from '@prisma/client'
import { type CreateOperationDtos, type ProductRepository } from '../protocols/product-repository'
import crypto from 'crypto'

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = []

  async count (): Promise<number> {
    return this.products.length
  }

  async list (): Promise<Product[]> {
    return this.products
  }

  async create (data: CreateOperationDtos, id?: string): Promise<Product> {
    const {
      name, price, userId
    } = data

    const randomId = crypto.randomUUID()

    const product = {
      id: id ?? randomId,
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
