import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

export class ListProducts {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute () {
    const products = await this.productRepository.list()

    return products
  }
}
