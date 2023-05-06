import { type Response, type Request } from 'express'
import { type RegisterUser } from '~/usecases/register-user'

export class RegisterUserController {
  constructor (
    private readonly registerUser: RegisterUser
  ) {}

  async handle (request: Request, response: Response) {
    const { name, type, email, password } = request.body

    const user = await this.registerUser.execute({
      name, type, email, password
    })

    return response.status(201).send(user)
  }
}
