/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { AuthenticateUserController } from '~/controllers/authenticate-user-controller'
import { AuthenticateUser } from '~/usecases/authenticate-user'

const authRoutes = Router()

authRoutes.post('/', async (request: Request, response: Response) => {
  const userRepository = new PrismaUserRepository()
  const authenticateUser = new AuthenticateUser(userRepository)
  const authenticateUserController = new AuthenticateUserController(authenticateUser)

  return await authenticateUserController.handle(request, response)
})

export default authRoutes
