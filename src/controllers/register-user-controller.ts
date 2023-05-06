import { type Response, type Request } from 'express'
import { type UserType } from '~/data/dtos/user-type'
import { type RegisterUser } from '~/usecases/register-user'

export class RegisterUserController {
  constructor (
    private readonly registerUser: RegisterUser
  ) {}

  async handle (request: Request, response: Response) {
    try {
      const { name, type, email, password } = request.body

      if (!password || (password && !password.trim())) {
        throw new Error('Password must be specified')
      }

      if (!type || (type && !type.trim())) {
        throw new Error('User type must be specified')
      }

      if (!email || (email && !email.trim())) {
        throw new Error('Email must be specified')
      }

      if (!type || (type && !type.trim())) {
        return response.status(400).json({
          message: 'Type must be specified'
        })
      }

      const user = await this.registerUser.execute({
        name, type, email, password
      })

      return response.status(201).send(user)
    } catch (err) {
      const error = err as Error

      const type = request.body.type as UserType

      if (error.message === `'${type}' is not recognizable. Please use 'STORE-ADMIN' or 'CUSTOMER'`) {
        return response.status(400).json({
          message: error.message
        })
      }

      if (error.message === 'Name need to be at least 3 characters long') {
        return response.status(400).json({
          message: error.message
        })
      }

      if (error.message === 'Password need to be at least 8 characters long and have at least number and one special character') {
        return response.status(400).json({
          message: error.message
        })
      }

      if (error.message === 'Email is invalid') {
        return response.status(400).json({
          message: error.message
        })
      }

      if (error.message === 'Email registered') {
        return response.status(400).json({
          message: error.message
        })
      }

      return response.status(500).json({
        message: 'A internal error happened in our server'
      })
    }
  }
}
