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

  it('should throw an error if user is not store admin', async () => {
    const productRepository = new InMemoryProductRepository()
    const userRepository = new InMemoryUserRepository()
    const sut = new CreateProduct(productRepository, userRepository)

    await userRepository.store({
      name: 'not store admin',
      type: 'CUSTOMER',
      email: 'not-store-admin@gmail.com',
      password: 'encrypted-password'
    }, 'not-store-admin-id')

    const userId = 'not-store-admin-id'
    const name = 'random-product-name'
    const price = 1000

    const promise = sut.execute({
      userId,
      name,
      price
    })

    await expect(promise).rejects.toThrowError('User does not have authorization')
  })
})
