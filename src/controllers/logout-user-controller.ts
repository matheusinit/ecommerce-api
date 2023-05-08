import { type Request, type Response } from 'express'
import { type LogoutUser } from '~/usecases/logout-user'

export class LogoutUserController {
  constructor (
    private readonly logoutUser: LogoutUser
  ) {}

  async handle (request: Request, response: Response) {
    const accessToken = request.cookies['access-token']
    const { userId } = request.body

    const result = await this.logoutUser.execute({
      accessToken,
      userId
    })

    response.clearCookie('access-token')
    response.clearCookie('refresh-token')

    return response.status(200).send(result)
  }
}
