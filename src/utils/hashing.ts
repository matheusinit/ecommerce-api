import crypto from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(crypto.scrypt)

export const hash = async (value: string) => {
  const salt = crypto.randomBytes(16).toString('hex')

  const key = await scryptAsync(value, salt, 64)
  return salt + ':' + (key as Buffer).toString('hex')
}

export const verify = async (hashing: string, passphrase: string) => {
  const [salt, key] = hashing.split(':')

  const keyBuffer = Buffer.from(key, 'hex')
  const derivedKey = await scryptAsync(passphrase, salt, 64) as Buffer

  return crypto.timingSafeEqual(keyBuffer, derivedKey)
}
