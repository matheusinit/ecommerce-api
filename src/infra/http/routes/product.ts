/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { PublishProductController } from '~/controllers/publish-product-controller'
import { ListProductsController } from '~/controllers/list-products-controller'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { DbPublishProduct } from '~/usecases/db-publish-product'
import { ListProducts } from '~/usecases/list-products'
import { expressRouteAdapt } from '~/utils/express-route-adapt'

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

productRoutes.get('/', expressRouteAdapt(makeListProductsController()))
productRoutes.post('/', expressRouteAdapt(makePublishProductController()))

export default productRoutes
