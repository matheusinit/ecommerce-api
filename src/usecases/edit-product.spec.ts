import { it, expect, describe, vitest } from 'vitest'
import { createId as createCuid } from '@paralleldrive/cuid2'
import { EditProduct } from './edit-product'
import { InMemoryProductRepository } from '~/data/repositories/in-memory/in-memory-product-repository'

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

    const repositorySpy = vitest.spyOn(inMemoryProductRepository, 'findById')

    const randCuid = createCuid()

    // Act
    await sut.execute(randCuid)

    // Assert
    expect(repositorySpy).toHaveBeenCalledOnce()
  })
})
