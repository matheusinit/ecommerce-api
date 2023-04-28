import { z } from 'zod'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { hash } from '../utils/hashing'
import { type UserType } from '~/data/dtos/user-type'

interface Request {
  name: string
  email: string
  type: UserType
  password: string
}

export class RegisterUser {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async execute (request: Request) {
    const { name, email, password, type } = request
    const userTypeSchema = z.enum(['STORE-ADMIN', 'CUSTOMER'])

    const typeParse = userTypeSchema.safeParse(type)

    if (!typeParse.success) {
      throw new Error(`'${type}' is not recognizable. Please use 'STORE-ADMIN' or 'CUSTOMER'`)
    }

    const emailSchema = z.string().email()

    const isEmailValidation = emailSchema.safeParse(email)

    if (!isEmailValidation.success) {
      throw new Error('Email is invalid')
    }

    const isEmailRegistered = await this.userRepository.findByEmail({ email })

    if (isEmailRegistered !== null) {
      throw new Error('Email registered')
    }

    const hashedPassword = await hash(password)

    const user = await this.userRepository.store({ name, type, email, password: hashedPassword })

    return user
  }
}
