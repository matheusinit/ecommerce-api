import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

interface ListProductsRequest {
  skipCount: number
  getCount: number
}

export class ListProducts {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute ({ skipCount, getCount }: ListProductsRequest) {
    const products = await this.productRepository.list({
      get: getCount,
      skip: skipCount
    })

    return products
  }
}
