import app from './app'
import { env } from './config/env'
import { EmailConsumer } from './config/mq/email-consumer'
import { PrismaConfirmationEmailTokenRepository } from './data/repositories/prisma/prisma-confirmation-email-token-repository'
import { RabbitMqUserMessageQueueRepository } from './data/repositories/rabbitmq/user-message-queue-repository'
import { NodeMailerEmailSender } from './infra/email/nodemailer-email-sender'
import { ConfirmationEmailImpl } from './usecases/user/confirmation-email'
import { ConfirmationEmailLinkImpl } from './usecases/user/confirmation-email-link'
import { hash } from './utils/hashing'

const userRepositoryQueue = new RabbitMqUserMessageQueueRepository()
const confirmationEmailTokenRepository = new PrismaConfirmationEmailTokenRepository()
const confirmationLink = new ConfirmationEmailLinkImpl(hash, confirmationEmailTokenRepository)
const emailSender = new NodeMailerEmailSender()
const confirmationEmail = new ConfirmationEmailImpl(confirmationLink, emailSender)
const emailConsumer = new EmailConsumer(userRepositoryQueue, confirmationEmail)

emailConsumer.consume().then(() => {
  console.log('Email consumer started')
}).catch(() => {
  console.log('Email consumer could not start. An error occured')
})

const SERVER_PORT = env.PORT ?? 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
