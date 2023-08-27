import app from './app'
import { env } from './config/env'

const SERVER_PORT = env.PORT ?? 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
