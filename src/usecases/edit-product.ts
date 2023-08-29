import { type Product } from '@prisma/client'

type ProductDomain = Product & {
  stock: number
}

type ProductOptional = Partial<Omit<ProductDomain, 'id'>>

export class EditProduct {
  async execute (product: Product, changes: ProductOptional) {
    const changesWithoutUndefined: Omit<typeof changes, 'createdAt' | 'updatedAt' | 'deletedAt'> = {}

    if (!!changes.price && changes.price < 0) {
      throw new Error('price must be a 0 or positive number')
    }

    if (changes?.name) {
      changesWithoutUndefined.name = changes?.name
    }

    if (changes?.price) {
      changesWithoutUndefined.price = changes.price
    }

    if (changes.stock) {
      changesWithoutUndefined.stock = changes.stock
    }

    return {
      ...product,
      ...changesWithoutUndefined
    }
  }
}
