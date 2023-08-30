import { type Product } from '@prisma/client'

export interface CreateOperationDtos {
  userId: string
  name: string
  price: number
}

interface SearchByField {
  value: string
  type: 'fuzzy' | 'startsWith' | 'endsWith'
}

export interface ListOperationDtos {
  skip: number
  get: number
  select: {
    id?: boolean
    name?: boolean
    price?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }
  search: {
    name?: SearchByField
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
  abstract findById (id: string): Promise<Product | null>
}
