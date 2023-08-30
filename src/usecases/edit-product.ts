import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

export class EditProduct {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute (id: string) {
    if (!id) {
      throw new Error('product id is required')
    }

    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('product with given id does not exists')
    }
  }
}
