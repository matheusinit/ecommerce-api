interface UserProps {
  id: string
  name?: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface UserPropsInput {
  name?: string
  email: string
  password: string
}

export class User {
  private readonly props: UserProps

  constructor ({ name, email, password }: UserPropsInput) {
    this.props = {
      id: 'random-id',
      name,
      email,
      password,
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
