/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { PublishProductController, ListProductsController } from '~/controllers/product'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { DbPublishProduct } from '~/usecases/db-publish-product'
import { ListProducts } from '~/usecases/list-products'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { isAuthenticated } from '../middlewares/auth'
import { EditProductController } from '~/controllers/product/edit-product-controller'
import { EditProduct } from '~/usecases/edit-product'

const productRoutes = Router()

const makePublishProductController = () => {
  const userRepository = new PrismaUserRepository()
  const productRepository = new PrismaProductRepository()
  const dbPublishProduct = new DbPublishProduct(productRepository, userRepository)
  const publishProductController = new PublishProductController(dbPublishProduct)

  return publishProductController
}

const makeListProductsController = () => {
  const productRepository = new PrismaProductRepository()
  const listProducts = new ListProducts(productRepository)
  return new ListProductsController(listProducts)
}

const makeEditProductController = () => {
  const productRepository = new PrismaProductRepository()
  const editProduct = new EditProduct(productRepository)
  return new EditProductController(editProduct)
}

productRoutes.get('/', expressRouteAdapt(makeListProductsController()))
productRoutes.post('/', isAuthenticated, expressRouteAdapt(makePublishProductController()))
productRoutes.put('/:id', isAuthenticated, expressRouteAdapt(makeEditProductController()))

export default productRoutes
