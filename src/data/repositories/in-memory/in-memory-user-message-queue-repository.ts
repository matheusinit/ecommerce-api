import { type EmailPayload, type UserMessageQueueRepository } from '../protocols/user-repository-mq'

export class InMemoryUserMessageQueueRepository implements UserMessageQueueRepository {
  private readonly queue: EmailPayload[] = []

  async addEmailTaskToQueue (payload: EmailPayload): Promise<void> {
    this.queue.push(payload)
  }

  async listen (): Promise<void> {

  }
}
