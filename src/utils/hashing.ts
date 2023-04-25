import crypto from 'crypto'

export const hash = (value: string) => {
  const salt = crypto.randomBytes(8).toString('hex')

  const result = crypto.scryptSync(value, salt, 64)

  return `${salt}:${result.toString('hex')}`
}
