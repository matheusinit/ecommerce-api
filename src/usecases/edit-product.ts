import { type ProductRepository } from '~/data/repositories/protocols/product-repository'

interface ChangesRequest {
  name?: string
  stock?: number
  price?: number
}

export class EditProduct {
  constructor (
    private readonly productRepository: ProductRepository
  ) {}

  async execute (id: string, changes: ChangesRequest) {
    if (!id) {
      throw new Error('product id is required')
    }

    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('product with given id does not exists')
    }

    const productUpdated = await this.productRepository.update(id, changes)

    return productUpdated
  }
}
