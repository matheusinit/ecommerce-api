import z from 'zod'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'

export class ConfirmationEmail {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async send (email: string) {
    if (!email) {
      throw new Error('Email is required')
    }

    const emailSchema = z.string().email()

    const emailValidation = emailSchema.safeParse(email)

    if (!emailValidation.success) {
      throw new Error('Invalid email was provided does not has the format: john.doe@email.com')
    }

    const user = await this.userRepository.findByEmail({
      email
    })

    if (!user) {
      throw new Error('User not found with given email')
    }
  }
}
