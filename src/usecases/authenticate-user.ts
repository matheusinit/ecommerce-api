import { type PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { verify } from '~/utils/hashing'

import { createSigner } from 'fast-jwt'
import ms from 'ms'

// 1. Authenticate - refresh token (5min) and access token (1d)
// 2. Refresh token - access token (5min)
// 3. Logout - Put the jwt in a black list in Redis

interface AuthenticateUserRequest {
  email: string
  password: string
}

export class AuthenticateUser {
  constructor (
    private readonly userRepository: PrismaUserRepository
  ) {}

  async execute (request: AuthenticateUserRequest) {
    const { email, password } = request

    if (!email) {
      throw Error('\'email\' is not provided')
    }

    if (!password) {
      throw Error('\'password\' is not provided')
    }

    const isUserRegistered = await this.userRepository.findByEmail({
      email
    })

    if (!isUserRegistered) {
      throw Error('Email not registered or password is wrong')
    }

    const passwordMatches = await verify(isUserRegistered.password, password)

    if (!passwordMatches) {
      throw Error('Email not registered or password is wrong')
    }

    const accessTokenSignAsync = createSigner({
      key: async () => 'secret',
      expiresIn: 300000
    })

    const refreshTokenSignAsync = createSigner({
      key: async () => 'secret',
      expiresIn: ms('1d')
    })

    const accessToken = await accessTokenSignAsync({
      id: isUserRegistered.id,
      type: isUserRegistered.type
    })

    /*
    * How can log out all devices when the user change password?
    * - Assign to user a unique id, and use this id in jwt payload, if the unique id is not the same in database, so its old jwt (need of auth)
    * */
    const refreshToken = await refreshTokenSignAsync({
      id: isUserRegistered.id
    })

    return {
      accessToken,
      refreshToken
    }
  }
}
