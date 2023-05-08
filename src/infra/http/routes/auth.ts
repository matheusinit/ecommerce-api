/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { AuthenticateUserController } from '~/controllers/authenticate-user-controller'
import { AuthenticateUser } from '~/usecases/authenticate-user'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { UpdateSignInToken } from '~/usecases/update-sign-in-token'
import { UpdateSignInTokenController } from '~/controllers/update-sign-in-token-controller'
import { tokenSigner } from '~/utils/jwt-generator'
import { LogoutUserController } from '~/controllers/logout-user-controller'
import { LogoutUser } from '~/usecases/logout-user'
import { RedisTokenRepository } from '~/data/repositories/redis/redis-token-repository'
import { verifyToken } from '~/usecases/verify-token'

const makeAuthenticateUserController = () => {
  const userRepository = new PrismaUserRepository()
  const authenticateUser = new AuthenticateUser(userRepository, tokenSigner)
  const authenticateUserController = new AuthenticateUserController(authenticateUser)

  return authenticateUserController
}

const makeSignInTokenController = () => {
  const updateSignInToken = new UpdateSignInToken()
  const updateSignInTokenController = new UpdateSignInTokenController(updateSignInToken)

  return updateSignInTokenController
}

const makeLogoutUserController = () => {
  const tokenRepository = new RedisTokenRepository()
  const logoutUser = new LogoutUser(tokenRepository, verifyToken)
  const logoutUserController = new LogoutUserController(logoutUser)

  return logoutUserController
}

const authRoutes = Router()

authRoutes.post('/', expressRouteAdapt(makeAuthenticateUserController()))
authRoutes.post('/access-token', expressRouteAdapt(makeSignInTokenController()))
authRoutes.post('/logout', expressRouteAdapt(makeLogoutUserController()))

export default authRoutes
