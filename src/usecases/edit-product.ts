import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

export class EditProduct {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute (id: string) {
    if (!id) {
      throw new Error('product id is required')
    }

    await this.productRepository.findById(id)
  }
}
