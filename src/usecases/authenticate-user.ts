interface AuthenticateUserRequest {
  email: string
  password: string
}

export class AuthenticateUser {
  async execute (request: AuthenticateUserRequest) {
    const { email, password } = request

    if (!email) {
      throw Error('\'email\' is not provided')
    }

    if (!password) {
      throw Error('\'password\' is not provided')
    }
  }
}
