import { it, expect, describe } from 'vitest'
import { EditProduct } from './edit-product'

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
})
