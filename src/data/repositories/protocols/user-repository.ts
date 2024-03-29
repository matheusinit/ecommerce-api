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

export interface FindByIdDtos {
  id: string
}

export abstract class UserRepository {
  abstract store (params: StoreUserProps): Promise<User>
  abstract findByEmail (params: FindByEmailParams): Promise<User & { verified: boolean } | null>
  abstract findById (params: FindByIdDtos): Promise<User | null>
  abstract verify (email: string): Promise<void>
}
