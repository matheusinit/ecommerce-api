import { type User } from '@prisma/client'
import { type FindByIdDtos, type FindByEmailParams, type StoreUserProps, type UserRepository } from '~/data/repositories/protocols/user-repository'
import { prisma } from '~/infra/db'

export class PrismaUserRepository implements UserRepository {
  async verify (email: string): Promise<void> {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        verified: true
      }
    })
  }

  async findById (params: FindByIdDtos): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id: params.id
      }
    })
  }

  async findByEmail (params: FindByEmailParams): Promise<User | null> {
    const { email } = params

    return prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async store (params: StoreUserProps): Promise<User> {
    const { name, email, type, password } = params

    const user = await prisma.user.create({
      data: {
        name, email, password, type, verified: false
      }
    })

    return user
  }
}
