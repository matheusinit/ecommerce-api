import { type CreateProduct } from '~/data/protocols/create-product'
import { type ProductRepository } from '~/data/repositories/protocols/product-repository'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'

interface CreateProductParams {
  name: string
  price: number
  userId: string
}

export class DbCreateProduct implements CreateProduct {
  constructor (
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute (params: CreateProductParams) {
    const { name, price, userId } = params

    const user = await this.userRepository.findById({ id: userId })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.type !== 'STORE-ADMIN') {
      throw new Error('User does not have authorization')
    }

    const product = await this.productRepository.create({
      name, price, userId
    })

    return product
  }
}
