import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { hash } from '../utils/hashing'
import { type UserType } from '~/data/dtos/user-type'

interface Request {
  name: string
  email: string
  type: UserType
  password: string
}

interface Response {
  id: string
  name: string | null
  type: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export class RegisterUser {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async execute (request: Request): Promise<Response> {
    const { name, email, password, type } = request

    const isEmailRegistered = await this.userRepository.findByEmail({ email })

    if (isEmailRegistered !== null) {
      throw new Error('Email registered')
    }

    const hashedPassword = await hash(password)

    const user = await this.userRepository.store({ name, type, email, password: hashedPassword })

    return user
  }
}
