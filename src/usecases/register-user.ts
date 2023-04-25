import { prisma } from '../infra/db'
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
  async execute (request: Request): Promise<Response> {
    const { name, email, password } = request

    const emailRegistered = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (emailRegistered !== null) {
      throw new Error('Email registered')
    }

    const hashedPassword = hash(password)

    const user = await prisma.user.create({
      data: {
        name, email, password: hashedPassword
      }
    })

    return user
  }
}
