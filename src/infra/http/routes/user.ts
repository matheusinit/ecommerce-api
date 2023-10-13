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
import { ConfirmationEmailQueueImpl } from '~/usecases/user/confirmation-email-queue'
import { ConfirmEmailController } from '~/controllers/user/confirm-email-controller'
import { EmailImpl } from '~/usecases/user/email'
import { PrismaConfirmationEmailTokenRepository } from '~/data/repositories/prisma/prisma-confirmation-email-token-repository'
import { SendConfirmationEmailController } from '~/controllers/user/send-confirmation-email-controller'

const makeRegisterUserController = () => {
  const userRepository = new PrismaUserRepository()
  const userMessageQueueRepository = new RabbitMqUserMessageQueueRepository()
  const emailQueue = new ConfirmationEmailQueueImpl(userRepository, userMessageQueueRepository)
  const registerUser = new RegisterUser(userRepository, emailQueue)
  const registerUserController = new RegisterUserController(registerUser)

  return registerUserController
}

const makeConfirmEmailController = () => {
  const userRepository = new PrismaUserRepository()
  const confirmationEmailTokenRepository = new PrismaConfirmationEmailTokenRepository()
  const email = new EmailImpl(confirmationEmailTokenRepository, userRepository)

  return new ConfirmEmailController(email)
}

const makeSendConfirmationEmailController = () => {
  const userRepository = new PrismaUserRepository()
  const userMessageQueueRepository = new RabbitMqUserMessageQueueRepository()
  const confirmationEmailQueue = new ConfirmationEmailQueueImpl(userRepository, userMessageQueueRepository)
  const controller = new SendConfirmationEmailController(confirmationEmailQueue)
  return controller
}

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
