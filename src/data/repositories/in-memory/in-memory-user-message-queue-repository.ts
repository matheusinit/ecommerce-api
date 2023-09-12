import { type UserMessageQueueRepository } from '../protocols/user-repository-mq'

export class InMemoryUserMessageQueueRepository implements UserMessageQueueRepository {
  private readonly queue: string[] = []

  async addEmailTaskToQueue (email: string): Promise<void> {
    this.queue.push(email)
  }
}
