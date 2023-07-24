import { type UserType } from '~/data/dtos/user-type'
import { type Controller } from '~/infra/protocols/controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { type RegisterUser } from '~/usecases/register-user'
import { badRequest, created, httpError, internalServerError } from '~/utils/http'

export class RegisterUserController implements Controller {
  constructor (
    private readonly registerUser: RegisterUser
  ) {}

  async handle (request: HttpRequest) {
    try {
      const { name, type, email, password } = request.body

      if (!name) {
        return badRequest(httpError('Name must be a valid value'))
      }

      if (!password || (password && !password.trim())) {
        throw new Error('Password must be specified')
      }

      if (!type || (type && !type.trim())) {
        return badRequest(httpError('User type must be specified. Use \'STORE-ADMIN\' or \'CUSTOMER\''))
      }

      if (!email || (email && !email.trim())) {
        return badRequest(httpError('Email must be specified'))
      }

      const user = await this.registerUser.execute({
        name, type, email, password
      })

      return created(user)
    } catch (err) {
      const error = err as Error

      const type = request.body.type as UserType

      if (error.message === `'${type}' is not recognizable. Please use 'STORE-ADMIN' or 'CUSTOMER'`) {
        return badRequest({
          message: error.message
        })
      }

      if (error.message === 'Name need to be at least 3 characters long') {
        return badRequest({
          message: error.message
        })
      }

      if (error.message === 'Password need to be at least 8 characters long and have at least number and one special character') {
        return badRequest({
          message: error.message
        })
      }

      if (error.message === 'Email is invalid') {
        return badRequest({
          message: error.message
        })
      }

      if (error.message === 'Email registered') {
        return badRequest({
          message: error.message
        })
      }

      return internalServerError({
        message: 'A internal error happened in our server'
      })
    }
  }
}
