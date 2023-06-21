/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { CreateProductController } from '~/controllers/create-product-controller'
import { ListProductsController } from '~/controllers/list-products-controller'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { DbCreateProduct } from '~/usecases/create-product'
import { ListProducts } from '~/usecases/list-products'
import { expressRouteAdapt } from '~/utils/express-route-adapt'

const productRoutes = Router()

const makeCreateProductController = () => {
  const userRepository = new PrismaUserRepository()
  const productRepository = new PrismaProductRepository()
  const createProduct = new DbCreateProduct(productRepository, userRepository)
  const createProductController = new CreateProductController(createProduct)

  return createProductController
}

const makeListProductsController = () => {
  const listProducts = new ListProducts()
  return new ListProductsController(listProducts)
}

productRoutes.get('/', expressRouteAdapt(makeListProductsController()))
productRoutes.post('/', expressRouteAdapt(makeCreateProductController()))

export default productRoutes
