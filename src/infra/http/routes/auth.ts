/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { AuthenticateUserController } from '~/controllers/authenticate-user-controller'
import { AuthenticateUser } from '~/usecases/authenticate-user'
import { expressRouteAdapt } from '~/utils/express-route-adapt'

const makeAuthenticateUserController = () => {
  const userRepository = new PrismaUserRepository()
  const authenticateUser = new AuthenticateUser(userRepository)
  const authenticateUserController = new AuthenticateUserController(authenticateUser)

  return authenticateUserController
}

const authRoutes = Router()

authRoutes.post('/', expressRouteAdapt(makeAuthenticateUserController()))

export default authRoutes
