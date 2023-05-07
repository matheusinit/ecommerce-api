import { env } from '~/config/env'
import { verifyToken } from './verify-token'

interface Request {
  accessToken: string
}

export class LogoutUser {
  async execute (request: Request) {
    try {
      await verifyToken(request.accessToken, env.ACCESS_TOKEN_SECRET)

      // add token into a black list in Redis with expires in 5min
      // and at protected routes check if the token is there, if it is logout user from all devices, if not continue

      return {
        sucess: true
      }
    } catch (err) {
      return {
        sucess: false,
        error: err
      }
    }
  }
}
