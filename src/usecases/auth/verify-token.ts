import { createVerifier } from 'fast-jwt'
import { type UserType } from '~/data/dtos/user-type'

interface JwtPayload {
  id: string
  type: UserType
  iat: number
  exp: number
}

export const verifyToken = async (token: string, secret?: string) => {
  const verifierAsync = createVerifier({ key: async () => secret })

  const result: JwtPayload = await verifierAsync(token)

  return result
}
