import { type Product } from '@prisma/client'

export interface ProductData {
  name: string
  price: number
  userId: string
}

export interface CreateProduct {
  execute: (productData: ProductData) => Promise<Product>
}
