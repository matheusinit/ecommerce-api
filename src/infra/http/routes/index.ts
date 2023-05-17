import { Router } from 'express'
import userRoutes from './user'
import authRoutes from './auth'
import productRoutes from './product'

const router = Router()

router.use('/user', userRoutes)
router.use('/auth', authRoutes)
router.use('/product', productRoutes)

export default router
