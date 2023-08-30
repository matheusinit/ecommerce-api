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
    await sut.execute(product.id)

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
})
