import { type UserType } from './user-type'

export interface User {
  name: string
  type: UserType
  email: string
  password: string
}
