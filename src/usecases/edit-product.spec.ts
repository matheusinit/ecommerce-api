import { describe, it, expect } from 'vitest'
import { EditProduct } from './edit-product'
import falso from '@ngneat/falso'

describe('Edit product', () => {
  it('when a price is provided, then should change the price of a product', async () => {
    // Arrange
    const sut = new EditProduct()

    const productToEdit = {
      id: falso.randUuid(),
      name: falso.randProductName(),
      price: falso.randNumber({ min: 1, max: 99999 }),
      stock: falso.randNumber({ min: 0, max: 100 }),
      userId: falso.randUuid(),
      createdAt: falso.randPastDate(),
      updatedAt: null,
      deletedAt: null
    }

    // Act
    const product = await sut.execute(productToEdit, {
      price: 10000
    })

    // Assert
    expect(product.price).toBe(10000)
  })

  it('when a name is provided, then should change the name of a product', async () => {
    // Arrange
    const sut = new EditProduct()

    const productToEdit = {
      id: falso.randUuid(),
      name: falso.randProductName(),
      price: falso.randNumber({ min: 1, max: 99999 }),
      stock: falso.randNumber({ min: 0, max: 100 }),
      userId: falso.randUuid(),
      createdAt: falso.randPastDate(),
      updatedAt: null,
      deletedAt: null
    }

    const randProductName = falso.randProductName()

    // Act
    const product = await sut.execute(productToEdit, {
      name: randProductName
    })

    // Assert
    expect(product.name).toBe(randProductName)
  })

  it('when a stock is provided, then should change the stock of a product', async () => {
    // Arrange
    const sut = new EditProduct()

    const productToEdit = {
      id: falso.randUuid(),
      name: falso.randProductName(),
      price: falso.randNumber({ min: 1, max: 99999 }),
      stock: falso.randNumber({ min: 0, max: 100 }),
      userId: falso.randUuid(),
      createdAt: falso.randPastDate(),
      updatedAt: null,
      deletedAt: null
    }

    const randStock = falso.randNumber()

    // Act
    const product = await sut.execute(productToEdit, {
      stock: randStock
    })

    // Assert
    expect(product.stock).toBe(randStock)
  })

  it('when a name is provided, then should change only the name of the product', async () => {
    const sut = new EditProduct()

    const productToEdit = {
      id: falso.randUuid(),
      name: falso.randProductName(),
      price: falso.randNumber({ min: 1, max: 99999 }),
      stock: falso.randNumber({ min: 0, max: 100 }),
      userId: falso.randUuid(),
      createdAt: falso.randPastDate(),
      updatedAt: null,
      deletedAt: null
    }

    const randProductName = falso.randProductName()

    const product = await sut.execute(productToEdit, { name: randProductName })

    expect(product).toEqual({
      id: productToEdit.id,
      name: randProductName,
      price: productToEdit.price,
      stock: productToEdit.stock,
      userId: productToEdit.userId,
      createdAt: productToEdit.createdAt,
      updatedAt: productToEdit.updatedAt,
      deletedAt: productToEdit.deletedAt
    })
  })
})
