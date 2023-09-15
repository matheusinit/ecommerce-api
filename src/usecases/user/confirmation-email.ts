import z from 'zod'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'
import { type ConfirmationEmail } from '../procotols/confirmation-email'

// type Hash = (value: string) => Promise<string>

export class ConfirmationEmailImpl implements ConfirmationEmail {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userMessageQueueRepository: UserMessageQueueRepository
  ) {}

  async enqueue (email: string) {
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

    // const hash = await this.hash(email)
    // Use the hash to append to a link to confirm account
    // Send the email content with link to message queue (MQ)

    const result = await this.userMessageQueueRepository.addEmailTaskToQueue(email)

    if (result.error) {
      throw new Error(result.message)
    }

    return {
      message: result.message
    }
  }
}
