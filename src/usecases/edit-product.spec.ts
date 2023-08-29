import { describe, it, expect } from 'vitest'
import { EditProduct } from './edit-product'
import falso from '@ngneat/falso'

describe('Edit product', () => {
  it('when a price is provided, then should change the price of a product', async () => {
    // Arrange
    const sut = new EditProduct()

    const uuid = falso.randUuid()

    // Act
    const product = await sut.execute(10000, uuid)

    // Assert
    expect(product.price).toBe(10000)
  })
})
