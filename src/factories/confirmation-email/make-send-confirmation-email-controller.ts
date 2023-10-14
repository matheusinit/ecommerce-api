import { SendConfirmationEmailController } from '~/controllers/confirmation-email/send-confirmation-email-controller'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RabbitMqUserMessageQueueRepository } from '~/data/repositories/rabbitmq/user-message-queue-repository'
import { ConfirmationEmailQueueImpl } from '~/usecases/confirmation-email/confirmation-email-queue'

export const makeSendConfirmationEmailController = () => {
  const userRepository = new PrismaUserRepository()
  const userMessageQueueRepository = new RabbitMqUserMessageQueueRepository()
  const confirmationEmailQueue = new ConfirmationEmailQueueImpl(userRepository, userMessageQueueRepository)
  const controller = new SendConfirmationEmailController(confirmationEmailQueue)
  return controller
}
