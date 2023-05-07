import express from 'express'
import router from './infra/http/routes'

import './infra/cache/'

const app = express()

app.use(express.json())
app.use('/v1', router)

const SERVER_PORT = 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
