import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'
import { type ConfirmationEmail } from '~/usecases/user/confirmation-email'

export abstract class EmailConsumerAbstract {
  abstract consume (): Promise<void>
}

export class EmailConsumer implements EmailConsumerAbstract {
  constructor (
    private readonly repository: UserMessageQueueRepository,
    private readonly confirmationEmail: ConfirmationEmail
  ) {}

  async consume () {
    await this.repository.listen(this.confirmationEmail.send)
  }
}
