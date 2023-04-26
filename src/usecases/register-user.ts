import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { hash } from '../utils/hashing'

interface Request {
  name: string
  email: string
  password: string
}

interface Response {
  id: string
  name: string | null
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
    const { name, email, password } = request

    const isEmailRegistered = await this.userRepository.findByEmail({ email })

    if (isEmailRegistered !== null) {
      throw new Error('Email registered')
    }

    const hashedPassword = await hash(password)

    const user = await this.userRepository.store({ name, email, password: hashedPassword })

    return user
  }
}
