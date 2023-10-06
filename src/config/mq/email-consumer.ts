import { RabbitMqUserMessageQueueRepository } from '~/data/repositories/rabbitmq/user-message-queue-repository'
import { ConfirmationEmail } from '~/usecases/user/confirmation-email'

export abstract class EmailConsumerAbstract {
  abstract consume (): Promise<void>
}

export class EmailConsumer implements EmailConsumerAbstract {
  async consume () {
    const repository = new RabbitMqUserMessageQueueRepository()
    const confirmationEmail = new ConfirmationEmail()

    await repository.listen(confirmationEmail.send)
  }
}
