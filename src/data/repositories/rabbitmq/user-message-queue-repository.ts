import { env } from '~/config/env'
import { type MessageQueueResult, type UserMessageQueueRepository } from '../protocols/user-repository-mq'
import amqp from 'amqplib'

export class RabbitMqUserMessageQueueRepository implements UserMessageQueueRepository {
  async addEmailTaskToQueue (email: string): Promise<MessageQueueResult> {
    const connection = await amqp.connect(env.MQ_URL)

    const channel = await connection.createConfirmChannel()
    await channel.assertQueue('confirmation-email')

    channel.sendToQueue('confirmation-email', Buffer.from(JSON.stringify(email)), {}, (err, ok) => {
      if (err) {
        return {
          error: true,
          message: 'Message queue nacked'
        }
      }

      return {
        error: false,
        message: 'Message queue acked'
      }
    })

    return {
      error: false,
      message: 'Message queue acked'
    }
  }

  async listen (process: (email: string) => Promise<void>): Promise<void> {
    const connection = await amqp.connect(env.MQ_URL)

    const channel = await connection.createChannel()
    await channel.assertQueue('confirmation-email')

    await channel.consume('confirmation-email', (message) => {
      if (!message) {
        return null
      }

      const email = JSON.parse(message.content.toString()) as string
      channel.ack(message)

      process(email).then().catch(() => {})
    })
  }
}
