import { createVerifier } from 'fast-jwt'

export const verifyToken = async (token: string, secret?: string) => {
  const verifierAsync = createVerifier({ key: async () => secret })

  const result = await verifierAsync(token)

  return result
}
