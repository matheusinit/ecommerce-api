import { createVerifier } from 'fast-jwt'
import { env } from '~/config/env'

export const verifyToken = async (token: string) => {
  const verifierAsync = createVerifier({ key: async () => env.ACCESS_TOKEN_SECRET })

  const result = await verifierAsync(token)

  return result
}
