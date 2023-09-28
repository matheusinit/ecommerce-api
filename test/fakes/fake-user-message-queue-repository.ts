import { type MessageQueueResult, type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'

export class FakeUserMessageQueueRepository implements UserMessageQueueRepository {
  async addEmailTaskToQueue (email: string): Promise<MessageQueueResult> {
    return {
      error: false,
      message: 'Message acked'
    }
  }

  async listen (): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
