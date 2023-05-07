import { type Request, type Response } from 'express'
import { type UpdateSignInToken } from '~/usecases/update-sign-in-token'

export class UpdateSignInTokenController {
  constructor (
    private readonly updateSignInToken: UpdateSignInToken
  ) {}

  async handle (request: Request, response: Response) {
    const { refreshToken } = request.body

    const token = await this.updateSignInToken.execute({ refreshToken })

    return response.status(200).send(token)
  }
}
