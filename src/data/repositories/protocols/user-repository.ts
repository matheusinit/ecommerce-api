import { type User } from '@prisma/client'

export interface StoreUserProps {
  name?: string
  email: string
  password: string
}

export interface FindByEmailParams {
  email: string
}

export abstract class UserRepository {
  abstract store (params: StoreUserProps): Promise<User>
  abstract findByEmail (params: FindByEmailParams): Promise<User | null>
}
