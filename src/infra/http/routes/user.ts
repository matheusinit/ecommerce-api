/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import { RegisterUser } from '../../../usecases/register-user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RegisterUserController } from '~/controllers/register-user-controller'

const userRoutes = Router()

userRoutes.post('/', async (request: Request, response: Response) => {
  const userRepository = new PrismaUserRepository()
  const registerUser = new RegisterUser(userRepository)
  const registerUserController = new RegisterUserController(registerUser)

  return await registerUserController.handle(request, response)
})

export default userRoutes
