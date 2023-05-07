/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { AuthenticateUserController } from '~/controllers/authenticate-user-controller'
import { AuthenticateUser } from '~/usecases/authenticate-user'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { UpdateSignInToken } from '~/usecases/update-sign-in-token'
import { UpdateSignInTokenController } from '~/controllers/update-sign-in-token-controller'

const makeAuthenticateUserController = () => {
  const userRepository = new PrismaUserRepository()
  const authenticateUser = new AuthenticateUser(userRepository)
  const authenticateUserController = new AuthenticateUserController(authenticateUser)

  return authenticateUserController
}

const makeSignInTokenController = () => {
  const updateSignInToken = new UpdateSignInToken()
  const updateSignInTokenController = new UpdateSignInTokenController(updateSignInToken)

  return updateSignInTokenController
}

const authRoutes = Router()

authRoutes.post('/', expressRouteAdapt(makeAuthenticateUserController()))
authRoutes.post('/access-token', expressRouteAdapt(makeSignInTokenController()))

export default authRoutes
