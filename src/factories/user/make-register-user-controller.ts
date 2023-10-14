import { RegisterUserController } from '~/controllers/user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RabbitMqUserMessageQueueRepository } from '~/data/repositories/rabbitmq/user-message-queue-repository'
import { ConfirmationEmailQueueImpl } from '~/usecases/confirmation-email/confirmation-email-queue'
import { RegisterUser } from '~/usecases/user/register-user'

export const makeRegisterUserController = () => {
  const userRepository = new PrismaUserRepository()
  const userMessageQueueRepository = new RabbitMqUserMessageQueueRepository()
  const emailQueue = new ConfirmationEmailQueueImpl(userRepository, userMessageQueueRepository)
  const registerUser = new RegisterUser(userRepository, emailQueue)
  const registerUserController = new RegisterUserController(registerUser)

  return registerUserController
}
