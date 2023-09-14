import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'

export class EmailConsumer {
  constructor (
    private readonly repository: UserMessageQueueRepository
  ) {}

  async consume () {
    await this.repository.listen()
  }
}
