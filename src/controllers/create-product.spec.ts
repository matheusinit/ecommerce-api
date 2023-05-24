import { describe, it, expect, vitest } from 'vitest'
import { CreateProductController } from './create-product-controller'
import { type ProductData, type CreateProduct } from '~/data/protocols/create-product'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { httpError } from '~/utils/http'

const makeSut = () => {
  class CreateProductStub implements CreateProduct {
    async execute (productData: ProductData) {
      return {
        id: 'random-id',
        name: productData.name,
        price: productData.price,
        userId: productData.userId,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null
      }
    }
  }

  const createProduct = new CreateProductStub()
  const sut = new CreateProductController(createProduct)

  return {
    sut,
    createProduct
  }
}

describe('Create product controller', () => {
  it('should return unauthorized if user is not of type store owner', async () => {
    const { sut, createProduct } = makeSut()

    vitest.spyOn(createProduct, 'execute').mockReturnValueOnce(Promise.reject(new Error('User does not have authorization')))

    const httpRequest: HttpRequest = {
      body: {
        name: 'Teclado TKL',
        price: 1000,
        userId: 'random-user-id'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(httpError('User does not have authorization'))
  })
})
