import { type Product } from '@prisma/client'
import { type CreateOperationDtos, type ProductRepository } from '../protocols/product-repository'
import crypto from 'crypto'

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = []

  async save (product: Product): Promise<Product | null> {
    const productFound = this.products.find((p) => p.id === product.id)

    if (!productFound) { return null }

    return Object.assign(productFound, product)
  }

  async findById (id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null
  }

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
      stock: 0,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    }

    this.products.push(product)

    return product
  }
}
