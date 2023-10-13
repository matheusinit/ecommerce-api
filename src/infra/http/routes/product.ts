/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { isAuthenticated } from '../middlewares/auth'
import { makeListProductsController } from '~/factories/product/make-list-products-controller'
import { makePublishProductController } from '~/factories/product/make-publish-product-controller'
import { makeEditProductController } from '~/factories/product/make-edit-product-controller'

const productRoutes = Router()

productRoutes.get('/', expressRouteAdapt(makeListProductsController()))
productRoutes.post('/', isAuthenticated, expressRouteAdapt(makePublishProductController()))
productRoutes.put('/:id', isAuthenticated, expressRouteAdapt(makeEditProductController()))

export default productRoutes
