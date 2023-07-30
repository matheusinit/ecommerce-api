import { describe, it, expect } from 'vitest'
import { ListProducts } from './list-products'
import { InMemoryProductRepository } from '~/data/repositories/in-memory/in-memory-product-repository'

describe('List products', () => {
  it('should return a list', async () => {
    const inMemoryProductRepository = new InMemoryProductRepository()
    const sut = new ListProducts(inMemoryProductRepository)

    const output = await sut.execute({
      getCount: 5,
      skipCount: 0
    })

    expect(Array.isArray(output)).toBeTruthy()
  })
})
