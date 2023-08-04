import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

interface ListProductsRequest {
  skipCount: number
  getCount: number
  selectName?: boolean
  selectPrice?: boolean
  selectUserId?: boolean
  selectId?: boolean
  selectCreatedAt?: boolean
}

export class ListProducts {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute ({ skipCount, getCount, selectName, selectPrice, selectUserId, selectId, selectCreatedAt }: ListProductsRequest) {
    const products = await this.productRepository.list({
      get: getCount,
      skip: skipCount,
      select: {
        id: selectId,
        name: selectName,
        price: selectPrice,
        userId: selectUserId,
        createdAt: selectCreatedAt
      }
    })

    const count = await this.productRepository.count()

    return {
      products,
      count
    }
  }
}
