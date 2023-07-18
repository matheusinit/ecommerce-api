import { env } from '~/config/env'
import { type TokenRepository } from '~/data/repositories/cache/token-repository'

interface Request {
  accessToken: string
}

type VerifyTokenType = (token: string, secret?: string) => Promise<any>

export class LogoutUser {
  constructor (
    private readonly tokenRepository: TokenRepository,
    private readonly verifyToken: VerifyTokenType
  ) {}

  async execute (request: Request) {
    try {
      const { accessToken } = request

      const payload = await this.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

      // add token into a black list in Redis with expires in 5min
      // and at protected routes check if the token is there, if it is logout user from all devices, if not continue
      await this.tokenRepository.set(payload.id, accessToken)

      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message
      }
    }
  }
}
