/* eslint-disable @typescript-eslint/no-misused-promises */
import { RegisterUser } from '../../../usecases/register-user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RegisterUserController } from '~/controllers/register-user-controller'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { Router, type Request, type Response } from 'express'
import { isAuthenticated } from '../middlewares/auth'

const makeRegisterUserController = () => {
  const userRepository = new PrismaUserRepository()
  const registerUser = new RegisterUser(userRepository)
  const registerUserController = new RegisterUserController(registerUser)

  return registerUserController
}

const userRoutes = Router()

userRoutes.get('/me', isAuthenticated, async (request: Request, response: Response) => {
  return response.status(200).send({
    data: 'Protected resource'
  })
})
userRoutes.post('/', expressRouteAdapt(makeRegisterUserController()))

export default userRoutes
