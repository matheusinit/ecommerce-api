import { PublishProductController } from '~/controllers/product'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { DbPublishProduct } from '~/usecases/product/db-publish-product'

export const makePublishProductController = () => {
  const userRepository = new PrismaUserRepository()
  const productRepository = new PrismaProductRepository()
  const dbPublishProduct = new DbPublishProduct(productRepository, userRepository)
  const publishProductController = new PublishProductController(dbPublishProduct)

  return publishProductController
}
