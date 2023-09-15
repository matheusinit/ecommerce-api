import app from './app'
import { env } from './config/env'
import { EmailConsumer } from './config/mq/email-consumer'
import { RabbitMqUserMessageQueueRepository } from './data/repositories/rabbitmq/user-message-queue-repository'

const SERVER_PORT = env.PORT ?? 8080

app.listen(SERVER_PORT, () => {
  const repository = new RabbitMqUserMessageQueueRepository()
  const emailConsumer = new EmailConsumer(repository)

  emailConsumer.consume().then(() => {
    console.log('Email consumer started')
    console.log(`Running server on ${SERVER_PORT}`)
  }).catch(() => {
    console.log('Email consumer could not start. An error occured')
  })
})
