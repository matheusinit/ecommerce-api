/* eslint-disable @typescript-eslint/no-misused-promises */
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { Router, type Request, type Response } from 'express'
import { isAuthenticated } from '../middlewares/auth'
import { verifyToken } from '~/usecases/auth/verify-token'
import { env } from '~/config/env'
import { makeRegisterUserController } from '~/factories/user/make-register-user-controller'
import { makeSendConfirmationEmailController } from '~/factories/confirmation-email/make-send-confirmation-email-controller'
import { makeConfirmEmailController } from '~/factories/confirmation-email/make-confirm-email-controller'

const userRoutes = Router()

userRoutes.get('/me', isAuthenticated, async (request: Request, response: Response) => {
  const accessToken = request.cookies['access-token']

  const payload = await verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

  return response.status(200).send(payload)
})

userRoutes.post('/', expressRouteAdapt(makeRegisterUserController()))
userRoutes.post('/email-confirmation', isAuthenticated, expressRouteAdapt(makeSendConfirmationEmailController()))
userRoutes.patch('/email-confirmation', expressRouteAdapt(makeConfirmEmailController()))

export default userRoutes
