import app from './app'
import { env } from './config/env'
import { EmailConsumer } from './config/mq/email-consumer'

const emailConsumer = new EmailConsumer()

emailConsumer.consume().then(() => {
  console.log('Email consumer started')
}).catch(() => {
  console.log('Email consumer could not start. An error occured')
})

const SERVER_PORT = env.PORT ?? 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
