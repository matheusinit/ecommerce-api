import { EditProductController } from '~/controllers/product/edit-product-controller'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { EditProduct } from '~/usecases/product/edit-product'

export const makeEditProductController = () => {
  const productRepository = new PrismaProductRepository()
  const editProduct = new EditProduct(productRepository)
  return new EditProductController(editProduct)
}
