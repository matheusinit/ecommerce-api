import { AuthenticateUserController } from '~/controllers/auth'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { RedisTokenRepository } from '~/data/repositories/redis/redis-token-repository'
import { DbAuthenticateUser } from '~/usecases/auth/authenticate-user'
import { tokenSigner } from '~/utils/jwt-generator'

export const makeAuthenticateUserController = () => {
  const userRepository = new PrismaUserRepository()
  const tokenRepository = new RedisTokenRepository()
  const authenticateUser = new DbAuthenticateUser(userRepository, tokenSigner, tokenRepository)
  const authenticateUserController = new AuthenticateUserController(authenticateUser)

  return authenticateUserController
}
