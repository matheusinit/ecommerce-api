export interface UserCredentials {
  email: string
  password: string
}

export interface JwtTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthenticateUser {
  execute: (request: UserCredentials) => Promise<JwtTokens>
}
