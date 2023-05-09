import { type NextFunction, type Request, type Response } from 'express'
import { env } from '~/config/env'
import { verifyToken } from '~/usecases/verify-token'

export const isAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
  const accessToken = request.cookies['access-token']

  if (!accessToken ?? !accessToken.trim()) {
    return response.status(401).send({ message: 'Not authenticated' })
  }

  await verifyToken(accessToken, env.ACCESS_TOKEN_SECRET)

  next()
}
