interface AuthenticateUserRequest {
  email: string
  password: string
}

export class AuthenticateUser {
  async execute (request: AuthenticateUserRequest) {
    throw Error()
  }
}
