import app from './app'
import { env } from './config/env'
import { EmailConsumer } from './config/mq/email-consumer'
import { RabbitMqUserMessageQueueRepository } from './data/repositories/rabbitmq/user-message-queue-repository'
import { NodeMailerEmailSender } from './infra/email/nodemailer-email-sender'
import { ConfirmationEmailLinkImpl } from './usecases/user/confirmation-email-link'
import { hash } from './utils/hashing'

const repository = new RabbitMqUserMessageQueueRepository()
const emailSender = new NodeMailerEmailSender()
const confirmationEmailLink = new ConfirmationEmailLinkImpl(hash)
const emailConsumer = new EmailConsumer(repository, confirmationEmailLink, emailSender)

emailConsumer.consume().then(() => {
  console.log('Email consumer started')
}).catch(() => {
  console.log('Email consumer could not start. An error occured')
})

const SERVER_PORT = env.PORT ?? 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
