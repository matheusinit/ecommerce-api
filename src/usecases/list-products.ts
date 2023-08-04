import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

interface ListProductsRequest {
  skipCount: number
  getCount: number
  select: {
    name?: boolean
    price?: boolean
    userId?: boolean
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }
}

export class ListProducts {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute ({ skipCount, getCount, select }: ListProductsRequest) {
    const products = await this.productRepository.list({
      get: getCount,
      skip: skipCount,
      select
    })

    const count = await this.productRepository.count()

    return {
      products,
      count
    }
  }
}
