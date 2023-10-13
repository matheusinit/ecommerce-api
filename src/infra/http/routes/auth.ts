/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { isAuthenticated } from '../middlewares/auth'
import { makeAuthenticateUserController } from '~/factories/auth/make-authenticate-user-controller'
import { makeSignInTokenController } from '~/factories/auth/make-sign-in-token-controller'
import { makeLogoutUserController } from '~/factories/auth/make-logout-user-controller'

const authRoutes = Router()

authRoutes.post('/', expressRouteAdapt(makeAuthenticateUserController()))
authRoutes.post('/access-token', isAuthenticated, expressRouteAdapt(makeSignInTokenController()))
authRoutes.post('/logout', isAuthenticated, expressRouteAdapt(makeLogoutUserController()))

export default authRoutes
