import { verify } from '~/utils/hashing'

import ms from 'ms'
import { env } from '~/config/env'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { tokenSigner } from '~/utils/jwt-generator'

// 3. Logout - Put the jwt in a black list in Redis

interface AuthenticateUserRequest {
  email: string
  password: string
}

export class AuthenticateUser {
  constructor (
    private readonly userRepository: UserRepository
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

    const accessToken = await tokenSigner(env.ACCESS_TOKEN_SECRET, {
      id: isUserRegistered.id,
      type: isUserRegistered.type
    }, ms('5m'))

    /*
    * How can log out all devices when the user change password?
    * - Assign to user a unique id, and use this id in jwt payload, if the unique id is not the same in database, so its old jwt (need of auth)
    * */
    const refreshToken = await tokenSigner(env.REFRESH_TOKEN_SECRET, {
      id: isUserRegistered.id
    }, ms('1w'))

    return {
      accessToken,
      refreshToken
    }
  }
}
