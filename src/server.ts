import express, { type Request, type Response } from 'express'
import { RegisterUser } from './usecases/register-user'

const app = express()

const registerUser = new RegisterUser()

app.use('/v1/', (request: Request, response: Response) => response.json(registerUser.execute()))

const SERVER_PORT = 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
