/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { AuthenticateUserController, UpdateSignInTokenController, LogoutUserController } from '~/controllers/auth'
import { DbAuthenticateUser } from '~/usecases/auth/authenticate-user'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { UpdateSignInToken } from '~/usecases/auth/update-sign-in-token'
import { tokenSigner } from '~/utils/jwt-generator'
import { LogoutUser } from '~/usecases/auth/logout-user'
import { RedisTokenRepository } from '~/data/repositories/redis/redis-token-repository'
import { verifyToken } from '~/usecases/auth/verify-token'
import { isAuthenticated } from '../middlewares/auth'

const makeAuthenticateUserController = () => {
  const userRepository = new PrismaUserRepository()
  const tokenRepository = new RedisTokenRepository()
  const authenticateUser = new DbAuthenticateUser(userRepository, tokenSigner, tokenRepository)
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
authRoutes.post('/access-token', isAuthenticated, expressRouteAdapt(makeSignInTokenController()))
authRoutes.post('/logout', isAuthenticated, expressRouteAdapt(makeLogoutUserController()))

export default authRoutes
