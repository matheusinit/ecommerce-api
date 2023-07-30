import { type Product } from '@prisma/client'

export interface CreateOperationDtos {
  userId: string
  name: string
  price: number
}

export interface ListOperationDtos {
  skip: number
  get: number
}

export abstract class ProductRepository {
  abstract create (data: CreateOperationDtos): Promise<Product>
  abstract list (options: ListOperationDtos): Promise<Product[]>
}
