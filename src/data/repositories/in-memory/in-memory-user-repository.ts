// import { type User } from '@prisma/client'
import { User as EntityUser } from '~/data/entities/user'
import { type User } from '@prisma/client'
import { type FindByEmailParams, type StoreUserProps, type UserRepository } from '~/data/repositories/protocols/user-repository'

export class InMemoryUserRepository implements UserRepository {
  private readonly users: EntityUser[] = []

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
      password: userEntity.password,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt ?? null,
      deletedAt: userEntity.deletedAt ?? null
    }
  }

  async store (params: StoreUserProps): Promise<User> {
    const { name, email, password } = params

    const userEntity = new EntityUser({
      name,
      email,
      password
    })

    this.users.push(userEntity)

    return {
      id: userEntity.id,
      name: userEntity.name ?? null,
      email: userEntity.email,
      password: userEntity.password,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt ?? null,
      deletedAt: userEntity.deletedAt ?? null
    }
  }
}
