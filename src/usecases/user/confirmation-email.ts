import z from 'zod'
import { type UserRepository } from '~/data/repositories/protocols/user-repository'
import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'

type Hash = (value: string) => Promise<string>

export class ConfirmationEmail {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userMessageQueueRepository: UserMessageQueueRepository,
    private readonly hash: Hash
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

    await this.hash(email)
    // Use the hash to append to a link to confirm account
    // Send the email content with link to message queue (MQ)

    await this.userMessageQueueRepository.addEmailTaskToQueue(email)
  }
}
