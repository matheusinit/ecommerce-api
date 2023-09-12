import { it, expect, describe, vitest } from 'vitest'
import { createId as createCuid } from '@paralleldrive/cuid2'
import { EditProduct } from './edit-product'
import { InMemoryProductRepository } from '~/data/repositories/in-memory/in-memory-product-repository'
import * as falso from '@ngneat/falso'

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

describe('Edit product', () => {
  it('when product id is not provided, should throw an error', async () => {
    // Arrange
    const sut = new EditProduct()

    // Act
    // @ts-expect-error "Pass undefined to product id to test it"
    const promise = sut.execute()

    // Assert
    void expect(promise).rejects.toThrow('product id is required')
  })

  it('when a product id is provided, should check if the product exists', async () => {
    // Arrange
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new EditProduct(inMemoryProductRepository)

    const product = makeProduct()

    void inMemoryProductRepository.create(product, product.id)

    const repositorySpy = vitest.spyOn(inMemoryProductRepository, 'findById')

    // Act
    await sut.execute(product.id, { name: falso.randProductName() })

    // Assert
    expect(repositorySpy).toHaveBeenCalledOnce()
  })

  it('when a product does not exists, then should throw an error', async () => {
    // Arrange
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new EditProduct(inMemoryProductRepository)

    const randCuid = createCuid()

    // Act
    const promise = sut.execute(randCuid)

    // Assert
    void expect(promise).rejects.toThrow('product with given id does not exists')
  })

  it('when a product exists, then should update the product', async () => {
    // Arrange
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new EditProduct(inMemoryProductRepository)

    const product = makeProduct()
    const randProductName = falso.randProductName()
    const randPrice = falso.randNumber({ min: 0, max: 99999 })
    const randStock = falso.randNumber({ min: 0, max: 99999 })

    await inMemoryProductRepository.create(product, product.id)

    // Act
    const productUpdated = await sut.execute(product.id, {
      name: randProductName,
      stock: randStock,
      price: randPrice
    })

    // Assert
    expect(productUpdated).toEqual(expect.objectContaining({
      name: randProductName,
      stock: randStock,
      price: randPrice
    }))
  })

  it('when invalid data changes are provided, should throw an error', async () => {
    // Arrange
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new EditProduct(inMemoryProductRepository)

    const product = makeProduct()
    const randProductName = 'ab'
    const randPrice = falso.randNumber({ min: -99999, max: -1 })
    const randStock = falso.randNumber({ min: -99999, max: -1 })

    await inMemoryProductRepository.create(product, product.id)

    // Act
    const promise = sut.execute(product.id, {
      name: randProductName,
      stock: randStock,
      price: randPrice
    })

    // Assert
    void expect(promise).rejects.toThrowError()
  })

  it('when any change are not provided, then should throw an error', async () => {
    // Arrange
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new EditProduct(inMemoryProductRepository)

    const product = makeProduct()

    await inMemoryProductRepository.create(product, product.id)

    // Act
    // @ts-expect-error "Pass undefined to changes to test it"
    const promise = sut.execute(product.id)

    // Assert
    void expect(promise).rejects.toThrow('must pass a value for fields to edit a product: name, price or stock')
  })

  it('when any field is not provided, then should throw an error', async () => {
    // Arrange
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new EditProduct(inMemoryProductRepository)

    const product = makeProduct()

    await inMemoryProductRepository.create(product, product.id)

    // Act
    const promise = sut.execute(product.id, {})

    // Assert
    void expect(promise).rejects.toThrow('must pass a value for fields to edit a product: name, price or stock')
  })
})
