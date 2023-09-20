import { type MessageQueueResult, type UserMessageQueueRepository } from '../protocols/user-repository-mq'

export class InMemoryUserMessageQueueRepository implements UserMessageQueueRepository {
  private readonly queue: string[] = []

  async addEmailTaskToQueue (email: string): Promise<MessageQueueResult> {
    this.queue.push(email)

    return {
      error: false,
      message: 'Message queue acked'
    }
  }

  async listen (): Promise<string | null> {
    return 'valid-email@email.com'
  }
}
