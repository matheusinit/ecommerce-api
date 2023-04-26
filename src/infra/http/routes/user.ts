/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, type Request, type Response } from 'express'
import { RegisterUser } from '../../../usecases/register-user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'

const userRoutes = Router()

userRoutes.post('/', async (request: Request, response: Response) => {
  const { name, email, type, password } = request.body

  const userRepository = new PrismaUserRepository()
  const registerUser = new RegisterUser(userRepository)

  const user = await registerUser.execute({ name, email, password, type })

  return response.status(201).send(user)
})

export default userRoutes
