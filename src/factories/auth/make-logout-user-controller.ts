import { LogoutUserController } from '~/controllers/auth'
import { RedisTokenRepository } from '~/data/repositories/redis/redis-token-repository'
import { LogoutUser } from '~/usecases/auth/logout-user'
import { verifyToken } from '~/usecases/auth/verify-token'

export const makeLogoutUserController = () => {
  const tokenRepository = new RedisTokenRepository()
  const logoutUser = new LogoutUser(tokenRepository, verifyToken)
  const logoutUserController = new LogoutUserController(logoutUser)

  return logoutUserController
}
