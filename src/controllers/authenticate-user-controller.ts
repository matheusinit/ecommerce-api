import { type AuthenticateUser } from '~/usecases/authenticate-user'
import { type Request, type Response } from 'express'

export class AuthenticateUserController {
  constructor (
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle (request: Request, response: Response) {
    const { email, password } = request.body

    const { accessToken, refreshToken } = await this.authenticateUser.execute({
      email,
      password
    })

    response.cookie('access-token', accessToken, {
      httpOnly: true,
      maxAge: 60 * 5
    })

    response.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7
    })

    return response.status(200).send({
      accessToken,
      refreshToken
    })
  }
}
