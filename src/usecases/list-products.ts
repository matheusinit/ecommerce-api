import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

interface ListProductsRequest {
  skipCount: number
  getCount: number
  selectName?: boolean
  selectPrice?: boolean
}

export class ListProducts {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute ({ skipCount, getCount, selectName, selectPrice }: ListProductsRequest) {
    const products = await this.productRepository.list({
      get: getCount,
      skip: skipCount,
      select: {
        name: selectName,
        price: selectPrice
      }
    })

    const count = await this.productRepository.count()

    return {
      products,
      count
    }
  }
}
