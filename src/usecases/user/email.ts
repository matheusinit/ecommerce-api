import { z } from 'zod'
import { type ConfirmationEmailTokenRepository } from '~/data/repositories/protocols/confirmation-email-token'

export class Email {
  constructor (
    private readonly confirmationEmailTokenRepository: ConfirmationEmailTokenRepository
  ) {}

  async confirm (token: string) {
    const tokenSchema = z.string().regex(/^[a-z0-9]{128}$/)
    const result = tokenSchema.safeParse(token)

    if (!result.success) {
      throw new Error('Invalid token')
    }

    throw new Error('Token not found')
  }
}
