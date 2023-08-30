import { type Product } from '@prisma/client'

type ProductDomain = Product & {
  stock: number
}

type ProductOptional = Partial<Omit<ProductDomain, 'id'>>

export class EditProductFields {
  async execute (product: Product, changes: ProductOptional) {
    const changesWithoutUndefined: Omit<typeof changes, 'createdAt' | 'updatedAt' | 'deletedAt'> = {}

    if (!product) {
      throw new Error('product not passed to edit')
    }

    if (!!changes.price && changes.price < 0) {
      throw new Error('price must be a 0 or positive number')
    }

    if (!!changes.stock && changes.stock < 0) {
      throw new Error('stock must be a 0 or positive number')
    }

    if (changes.name === '') {
      throw new Error('name cannot be a empty string')
    }

    if (changes.name && changes.name.length < 3) {
      throw new Error('name must be at least 3 characters long')
    }

    if (!changes.name && !changes.price && !changes.stock) {
      throw new Error('must pass a value for fields to edit a product: name, price or stock')
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
