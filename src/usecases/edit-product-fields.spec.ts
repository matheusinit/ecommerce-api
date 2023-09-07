import { describe, it, expect } from 'vitest'
import { EditProductFields } from './edit-product-fields'
import falso from '@ngneat/falso'

const makeProduct = () => ({
  id: falso.randUuid(),
  name: falso.randProductName(),
  price: falso.randNumber({ min: 1, max: 99999 }),
  stock: falso.randNumber({ min: 0, max: 100 }),
  userId: falso.randUuid(),
  createdAt: falso.randPastDate(),
  updatedAt: null,
  deletedAt: null
})

describe('Edit product fields', () => {
  it('when a price is provided, then should change the price of a product', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    // Act
    const product = await sut.execute(productToEdit, {
      price: 10000
    })

    // Assert
    expect(product.price).toBe(10000)
  })

  it('when a name is provided, then should change the name of a product', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

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
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randStock = falso.randNumber()

    // Act
    const product = await sut.execute(productToEdit, {
      stock: randStock
    })

    // Assert
    expect(product.stock).toBe(randStock)
  })

  it('when a name is provided, then should change only the name of the product', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randProductName = falso.randProductName()

    // Act
    const product = await sut.execute(productToEdit, { name: randProductName })

    // Arrange
    expect(product).toEqual({
      id: productToEdit.id,
      name: randProductName,
      price: productToEdit.price,
      stock: productToEdit.stock,
      userId: productToEdit.userId,
      createdAt: productToEdit.createdAt,
      updatedAt: expect.any(Date),
      deletedAt: productToEdit.deletedAt
    })
  })

  it('when a stock is provided, then should change only the stock of the product', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randStock = falso.randNumber()

    // Act
    const product = await sut.execute(productToEdit, { stock: randStock })

    // Assert
    expect(product).toEqual({
      id: productToEdit.id,
      name: productToEdit.name,
      price: productToEdit.price,
      stock: randStock,
      userId: productToEdit.userId,
      createdAt: productToEdit.createdAt,
      updatedAt: expect.any(Date),
      deletedAt: productToEdit.deletedAt
    })
  })

  it('when a price is provided, then should change only the price of the product', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randPrice = falso.randNumber()

    // Act
    const product = await sut.execute(productToEdit, { price: randPrice })

    // Assert
    expect(product).toEqual({
      id: productToEdit.id,
      name: productToEdit.name,
      price: randPrice,
      stock: productToEdit.stock,
      userId: productToEdit.userId,
      createdAt: productToEdit.createdAt,
      updatedAt: expect.any(Date),
      deletedAt: productToEdit.deletedAt
    })
  })

  it('when negative number is given as price, then should throw an error', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randPrice = falso.randNumber({ min: -99999, max: 0 })

    // Act
    const promise = sut.execute(productToEdit, { price: randPrice })

    // Assert
    void expect(promise).rejects.toThrow('price must be a 0 or positive number')
  })

  it('when negative number is given as stock, then should throw an error', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randStock = falso.randNumber({ min: -99999, max: 0 })

    // Act
    const promise = sut.execute(productToEdit, { stock: randStock })

    // Assert
    void expect(promise).rejects.toThrow('stock must be a 0 or positive number')
  })

  it('when an empty string is passed as name, then should throw an error', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    // Act
    const promise = sut.execute(productToEdit, { name: '' })

    // Assert
    void expect(promise).rejects.toThrow('name cannot be a empty string')
  })

  it('when a name with less than 3 characters is passed, then should throw an error', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    // Act
    const promise = sut.execute(productToEdit, { name: 'Ab' })

    // Assert
    void expect(promise).rejects.toThrow('name must be at least 3 characters long')
  })

  it('when no value for edit is passed, then should throw an error', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    // Act
    const promise = sut.execute(productToEdit, { })

    // Assert
    void expect(promise).rejects.toThrow('must pass a value for fields to edit a product: name, price or stock')
  })

  it('when no product is passed, then should throw an error', async () => {
    // Arrange
    const sut = new EditProductFields()

    const randProductName = falso.randProductName()

    // Act
    // @ts-expect-error "Pass undefined to test input edge case"
    const promise = sut.execute(undefined, { name: randProductName })

    // Assert
    void expect(promise).rejects.toThrow('product not passed to edit')
  })

  it('when multiple values for change are passed, then should change multiple values of product', async () => {
    // Arrange
    const sut = new EditProductFields()

    const productToEdit = makeProduct()

    const randProductName = falso.randProductName()
    const randStock = falso.randNumber({ min: 0 })
    const randPrice = falso.randNumber({ min: 0 })

    // Act
    const product = await sut.execute(productToEdit, {
      name: randProductName,
      stock: randStock,
      price: randPrice
    })

    // Assert
    expect(product).toEqual(expect.objectContaining({
      name: randProductName,
      stock: randStock,
      price: randPrice
    }))
  })
})
