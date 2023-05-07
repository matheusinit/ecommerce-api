/* eslint-disable @typescript-eslint/no-misused-promises */
import { RegisterUser } from '../../../usecases/register-user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RegisterUserController } from '~/controllers/register-user-controller'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { Router } from 'express'

const makeRegisterUserController = () => {
  const userRepository = new PrismaUserRepository()
  const registerUser = new RegisterUser(userRepository)
  const registerUserController = new RegisterUserController(registerUser)

  return registerUserController
}

const userRoutes = Router()

userRoutes.post('/', expressRouteAdapt(makeRegisterUserController()))

export default userRoutes
