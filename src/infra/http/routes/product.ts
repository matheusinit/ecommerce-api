/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { CreateProductController } from '~/controllers/create-product'
import { PrismaProductRepository } from '~/data/repositories/prisma/prisma-product-repository'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { CreateProduct } from '~/usecases/create-product'
import { expressRouteAdapt } from '~/utils/express-route-adapt'

const productRoutes = Router()

const makeCreateProductController = () => {
  const userRepository = new PrismaUserRepository()
  const productRepository = new PrismaProductRepository()
  const createProduct = new CreateProduct(productRepository, userRepository)
  const createProductController = new CreateProductController(createProduct)

  return createProductController
}

productRoutes.post('/', expressRouteAdapt(makeCreateProductController()))

export default productRoutes
