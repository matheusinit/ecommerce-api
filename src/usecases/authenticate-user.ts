import { type PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { verify } from '~/utils/hashing'

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
  }
}
