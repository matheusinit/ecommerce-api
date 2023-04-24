import express, { type Request, type Response } from 'express'

const app = express()

app.get('/', (request: Request, response: Response) => {
  return response.json({ message: 'Hello World' })
})

const SERVER_PORT = 8080

app.listen(SERVER_PORT, () => {
  console.log(`Running server on ${SERVER_PORT}`)
})
