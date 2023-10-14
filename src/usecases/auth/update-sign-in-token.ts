import { tokenSigner } from '~/utils/jwt-generator'
import { verifyToken } from './verify-token'
import { env } from '~/config/env'
import ms from 'ms'

interface Request {
  refreshToken: string
}

// generate a new access token only if current one is invalid

export class UpdateSignInToken {
  async execute (request: Request) {
    const { refreshToken } = request

    const isTokenValid = await verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET)

    if (!isTokenValid) {
      throw new Error('refresh token is invalid')
    }

    const accessToken = await tokenSigner(env.ACCESS_TOKEN_SECRET, { id: 'id', type: 'type' }, ms('5m'))

    return {
      accessToken
    }
  }
}
