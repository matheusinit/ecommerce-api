/* eslint-disable @typescript-eslint/no-misused-promises */
import { RegisterUser } from '~/usecases/user/register-user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RegisterUserController } from '~/controllers/user'
import { expressRouteAdapt } from '~/utils/express-route-adapt'
import { Router, type Request, type Response } from 'express'
import { isAuthenticated } from '../middlewares/auth'
import { verifyToken } from '~/usecases/auth/verify-token'
import { env } from '~/config/env'
import { RabbitMqUserMessageQueueRepository } from '~/data/repositories/rabbitmq/user-message-queue-repository'
import { ConfirmationEmail } from '~/usecases/user/confirmation-email'
import { hash } from '~/utils/hashing'

const makeRegisterUserController = () => {
  const userRepository = new PrismaUserRepository()
  const userMessageQueueRepository = new RabbitMqUserMessageQueueRepository()
  const confirmationEmail = new ConfirmationEmail(userRepository, userMessageQueueRepository, hash)
  const registerUser = new RegisterUser(userRepository, confirmationEmail)
  const registerUserController = new RegisterUserController(registerUser)

  return registerUserController
}

const userRoutes = Router()

userRoutes.get('/me', isAuthenticated, async (request: Request, response: Response) => {
  const accessToken = request.cookies['access-token']

  const payload = await verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

  return response.status(200).send(payload)
})

userRoutes.post('/', expressRouteAdapt(makeRegisterUserController()))

export default userRoutes
