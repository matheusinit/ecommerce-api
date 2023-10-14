import { type UserType } from '../dtos/user-type'

interface UserProps {
  id: string
  name?: string
  email: string
  type: UserType
  verified: boolean
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

  constructor (params: UserPropsInput, id?: string) {
    this.props = {
      ...params,
      id: id ?? 'random-id',
      createdAt: new Date(),
      verified: false
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

  get verified () {
    return this.props.verified
  }

  set verified (value: boolean) {
    if (!value) return

    this.props.verified = value
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
