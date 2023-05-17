// import { type User } from '@prisma/client'
import { User as EntityUser } from '~/data/entities/user'
import { type User } from '@prisma/client'
import { type FindByIdDtos, type FindByEmailParams, type StoreUserProps, type UserRepository } from '~/data/repositories/protocols/user-repository'

export class InMemoryUserRepository implements UserRepository {
  private readonly users: EntityUser[] = []

  async findById (params: FindByIdDtos): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async findByEmail (params: FindByEmailParams): Promise<User | null> {
    const { email } = params

    const userEntity = this.users.find(user => user.email === email)

    if (userEntity === undefined) {
      return null
    }

    return {
      id: userEntity.id,
      name: userEntity.name ?? null,
      email: userEntity.email,
      type: userEntity.type,
      password: userEntity.password,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt ?? null,
      deletedAt: userEntity.deletedAt ?? null
    }
  }

  async store (params: StoreUserProps): Promise<User> {
    const { name, email, password, type } = params

    const userEntity = new EntityUser({
      name,
      email,
      password,
      type
    })

    this.users.push(userEntity)

    return {
      id: userEntity.id,
      name: userEntity.name ?? null,
      email: userEntity.email,
      type: userEntity.type,
      password: userEntity.password,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt ?? null,
      deletedAt: userEntity.deletedAt ?? null
    }
  }
}
