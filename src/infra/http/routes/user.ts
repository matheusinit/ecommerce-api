/* eslint-disable @typescript-eslint/no-misused-promises */
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { Router } from 'express'
import { isAuthenticated } from '../middlewares/auth'
import { makeRegisterUserController } from '~/factories/user/make-register-user-controller'
import { makeSendConfirmationEmailController } from '~/factories/confirmation-email/make-send-confirmation-email-controller'
import { makeConfirmEmailController } from '~/factories/confirmation-email/make-confirm-email-controller'
import { MeController } from '~/controllers/user/me-controller'

const userRoutes = Router()

userRoutes.get('/me', isAuthenticated, expressRouteAdapt(new MeController()))

userRoutes.post('/', expressRouteAdapt(makeRegisterUserController()))
userRoutes.post('/email-confirmation', isAuthenticated, expressRouteAdapt(makeSendConfirmationEmailController()))
userRoutes.patch('/email-confirmation', expressRouteAdapt(makeConfirmEmailController()))

export default userRoutes
