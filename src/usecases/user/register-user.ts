import { z } from 'zod'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { hash } from '~/utils/hashing'
import { type UserType } from '~/data/dtos/user-type'
import { type ConfirmationEmailQueue } from '../procotols/confirmation-email-queue'

interface Request {
  name: string
  email: string
  type: UserType
  password: string
}

export class RegisterUser {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly emailQueue: ConfirmationEmailQueue
  ) {}

  async execute (request: Request) {
    const { name, email, password, type } = request

    const userTypeSchema = z.enum(['STORE-ADMIN', 'CUSTOMER'])

    const typeParse = userTypeSchema.safeParse(type)

    if (!typeParse.success) {
      throw new Error(`'${type}' is not recognizable. Please use 'STORE-ADMIN' or 'CUSTOMER'`)
    }

    const nameSchema = z.string().min(3).optional()

    const nameValidation = nameSchema.safeParse(name)

    if (!nameValidation.success) {
      throw new Error('Name need to be at least 3 characters long')
    }

    const passwordSchema = z.string().min(8).regex(/[0-9][.,:$#!@&*]/)

    const passwordValidation = passwordSchema.safeParse(password)

    if (!passwordValidation.success) {
      throw new Error('Password need to be at least 8 characters long, has at least one number and one special character')
    }

    const emailSchema = z.string().email()

    const emailValidation = emailSchema.safeParse(email)

    if (!emailValidation.success) {
      throw new Error('Email is invalid')
    }

    const isEmailRegistered = await this.userRepository.findByEmail({ email })

    if (isEmailRegistered !== null) {
      throw new Error('Email registered')
    }

    const hashedPassword = await hash(password)

    const user = await this.userRepository.store({ name, type, email, password: hashedPassword })

    await this.emailQueue.enqueue(email)

    return user
  }
}
