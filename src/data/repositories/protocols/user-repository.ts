import { type User } from '@prisma/client'
import { type UserType } from '~/data/dtos/user-type'

export interface StoreUserProps {
  name?: string
  email: string
  type: UserType
  password: string
}

export interface FindByEmailParams {
  email: string
}

export abstract class UserRepository {
  abstract store (params: StoreUserProps): Promise<User>
  abstract findByEmail (params: FindByEmailParams): Promise<User | null>
}
