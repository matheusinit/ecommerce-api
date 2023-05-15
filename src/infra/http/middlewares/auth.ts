import { type NextFunction, type Request, type Response } from 'express'
import { env } from '~/config/env'
import { RedisTokenRepository } from '~/data/repositories/redis/redis-token-repository'
import { verifyToken } from '~/usecases/verify-token'

const tokenRepository = new RedisTokenRepository()

export const isAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
  const accessToken = request.cookies['access-token']

  if (!accessToken ?? !accessToken.trim()) {
    return response.status(401).send({ message: 'Not authenticated' })
  }

  const payload = await verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

  const isTokenBlackListed = await tokenRepository.getBykey(payload.id)

  if (isTokenBlackListed) {
    return response.status(401).send({ message: 'Not authenticated' })
  }

  next()
}
