import dayjs from 'dayjs'
import { z } from 'zod'
import { type ConfirmationEmailTokenRepository } from '~/data/repositories/protocols/confirmation-email-token'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'

export class Email {
  constructor (
    private readonly confirmationEmailTokenRepository: ConfirmationEmailTokenRepository,
    private readonly userRepository: UserRepository
  ) {}

  private tokenIsExpired (tokenDate: Date) {
    const expirationDate = dayjs(tokenDate).add(24, 'h')
    const isExpired = dayjs().isAfter(expirationDate)
    return isExpired
  }

  async confirm (token: string) {
    const tokenSchema = z.string().regex(/^[a-z0-9]{128}$/)
    const result = tokenSchema.safeParse(token)

    if (!result.success) {
      throw new Error('Invalid token')
    }

    const tokenFromDatabase = await this.confirmationEmailTokenRepository.getByToken(token)

    if (tokenFromDatabase === null) {
      throw new Error('Token not found')
    }

    const tokenIsExpired = this.tokenIsExpired(tokenFromDatabase?.createdAt)

    if (tokenIsExpired) {
      throw new Error('Token expired')
    }

    const user = await this.userRepository.findByEmail({
      email: tokenFromDatabase.userEmail
    })

    if (user?.verified) {
      throw new Error('User is already verified')
    }

    await this.userRepository.verify(tokenFromDatabase.userEmail)
  }
}
