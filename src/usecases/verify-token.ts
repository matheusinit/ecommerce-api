import { createVerifier } from 'fast-jwt'

export const verifyToken = async (token: string) => {
  const verifierAsync = createVerifier({ key: () => 'secret' })

  const result = await verifierAsync(token)

  console.log(result)

  return result
}
