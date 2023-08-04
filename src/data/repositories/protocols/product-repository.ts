import { type Product } from '@prisma/client'

export interface CreateOperationDtos {
  userId: string
  name: string
  price: number
}

export interface ListOperationDtos {
  skip: number
  get: number
  select: {
    name?: boolean
    price?: boolean
    userId?: boolean
  }
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type PartialProduct = Partial<Product>

export abstract class ProductRepository {
  abstract create (data: CreateOperationDtos): Promise<Product>
  abstract list (options: ListOperationDtos): Promise<PartialProduct[]>
  abstract count (): Promise<number>
}
