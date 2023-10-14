import { type ProductRepository } from '~/data/repositories/protocols/product-repository'
import { EditProductFields } from './edit-product-fields'

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

    if (!changes) {
      throw new Error('must pass a value for fields to edit a product: name, price or stock')
    }

    const editFields = new EditProductFields()

    const productUpdated = await editFields.execute(product, changes)

    await this.productRepository.save(productUpdated)

    return productUpdated
  }
}
