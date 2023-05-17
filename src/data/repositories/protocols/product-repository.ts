import { type Product } from '@prisma/client'

export interface CreateOperationDtos {
  userId: string
  name: string
  price: number
}

export abstract class ProductRepository {
  abstract create (data: CreateOperationDtos): Promise<Product>
}
