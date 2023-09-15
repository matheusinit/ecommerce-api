import { env } from '~/config/env'
import { type EmailPayload, type UserMessageQueueRepository } from '../protocols/user-repository-mq'
import amqp from 'amqplib'

export class RabbitMqUserMessageQueueRepository implements UserMessageQueueRepository {
  async addEmailTaskToQueue (payload: EmailPayload): Promise<void> {
    const connection = await amqp.connect(env.MQ_URL)

    const channel = await connection.createChannel()
    await channel.assertQueue('confirmation-email')

    channel.sendToQueue('confirmation-email', Buffer.from(JSON.stringify(payload)))
  }

  async listen (): Promise<EmailPayload | null> {
    const connection = await amqp.connect(env.MQ_URL)

    const channel = await connection.createChannel()
    await channel.assertQueue('confirmation-email')

    await channel.consume('confirmation-email', (message) => {
      if (!message) {
        return null
      }

      const payload = JSON.parse(message.content.toString())

      return payload
    })

    return null
  }
}
