import { Router } from 'express'
import userRoutes from './user'
import authRoutes from './auth'
import productRoutes from './product'

const router = Router()

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/products', productRoutes)

export default router
