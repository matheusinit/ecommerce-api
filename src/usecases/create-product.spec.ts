import { describe, it, expect } from 'vitest'
import { CreateProduct } from './create-product'
import { InMemoryProductRepository } from '~/data/repositories/in-memory/in-memory-product-repository'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'

describe('Create product', () => {
  it('should throw an error if user is not found', async () => {
    const productRepository = new InMemoryProductRepository()
    const userRepository = new InMemoryUserRepository()
    const sut = new CreateProduct(productRepository, userRepository)

    const userId = 'not-created-user'
    const name = 'random-product-name'
    const price = 1000

    const promise = sut.execute({
      userId,
      name,
      price
    })

    await expect(promise).rejects.toThrowError()
  })
})
