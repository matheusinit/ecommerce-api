import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

interface SearchByField {
  value: string
  type: 'fuzzy' | 'startsWith' | 'endsWith'
}

interface ListProductsRequest {
  skipCount: number
  getCount: number
  select?: {
    name?: boolean
    price?: boolean
    userId?: boolean
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }
  search?: {
    name?: SearchByField
  }
}

export class ListProducts {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute ({ skipCount, getCount, select = {}, search = {} }: ListProductsRequest) {
    const products = await this.productRepository.list({
      get: getCount,
      skip: skipCount,
      select,
      search
    })

    const count = await this.productRepository.count()

    return {
      products,
      count
    }
  }
}
