/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import { RegisterUser } from '../../../usecases/register-user'

const userRoutes = Router()

userRoutes.post('/', async (request: Request, response: Response) => {
  const { name, email, password } = request.body

  const registerUser = new RegisterUser()

  const user = await registerUser.execute({ name, email, password })

  return response.status(201).send(user)
})

export default userRoutes
