import { type UserType } from '../dtos/user-type'

interface UserProps {
  id: string
  name?: string
  email: string
  type: UserType
  password: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface UserPropsInput {
  name?: string
  email: string
  type: UserType
  password: string
}

export class User {
  private readonly props: UserProps

  constructor (params: UserPropsInput) {
    this.props = {
      ...params,
      id: 'random-id',
      createdAt: new Date()
    }
  }

  get id () {
    return this.props.id
  }

  get name () {
    return this.props.name
  }

  set name (newName: string | undefined) {
    this.props.name = newName
  }

  get email () {
    return this.props.email
  }

  set email (newEmail: string) {
    this.email = newEmail
  }

  get type () {
    return this.props.type
  }

  set type (type: UserType) {
    this.props.type = type
  }

  get password () {
    return this.props.password
  }

  set password (newPassword: string) {
    this.props.password = newPassword
  }

  get createdAt () {
    return this.props.createdAt
  }

  get updatedAt () {
    return this.props.updatedAt
  }

  get deletedAt () {
    return this.props.deletedAt
  }

  set deletedAt (datetimeIso: Date | undefined) {
    this.props.deletedAt = datetimeIso
  }
}
