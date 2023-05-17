import { type User } from '@prisma/client'
import { type FindByIdDtos, type FindByEmailParams, type StoreUserProps, type UserRepository } from '~/data/repositories/protocols/user-repository'
import { prisma } from '~/infra/db'

export class PrismaUserRepository implements UserRepository {
  async findById (params: FindByIdDtos): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: params.id
      }
    })
  }

  async findByEmail (params: FindByEmailParams): Promise<User | null> {
    const { email } = params

    return await prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async store (params: StoreUserProps): Promise<User> {
    const { name, email, type, password } = params

    const user = await prisma.user.create({
      data: {
        name, email, password, type
      }
    })

    return user
  }
}
