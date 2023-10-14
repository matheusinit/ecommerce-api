import { ListProductsController } from '~/controllers/product'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { ListProducts } from '~/usecases/product/list-products'

export const makeListProductsController = () => {
  const productRepository = new PrismaProductRepository()
  const listProducts = new ListProducts(productRepository)
  return new ListProductsController(listProducts)
}
