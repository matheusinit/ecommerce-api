import { createSigner } from 'fast-jwt'

export const tokenSigner = async <T, R>(secret: T, payload: R, expiresIn: number) => {
  const tokenSignAsync = createSigner({
    key: async () => secret,
    expiresIn
  })

  if (typeof secret !== 'string') {
    throw Error('secret has to be of type string')
  }

  const token = await tokenSignAsync(payload as Record<string, any>)

  return token
}
