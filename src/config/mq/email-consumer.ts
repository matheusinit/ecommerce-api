import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'

type Hash = (value: string) => Promise<string>

abstract class EmailSender {
  abstract sendConfirmationEmail (email: string, confirmationLink: string): Promise<void>
}

export class EmailConsumer {
  constructor (
    private readonly repository: UserMessageQueueRepository,
    private readonly hash: Hash,
    private readonly emailSender: EmailSender
  ) {}

  async consume () {
    const email = await this.repository.listen()

    // Get the email
    // Create a hash from email and current datetime
    // Generate a link to confirm account
    // Send a message to the email with the

    if (!email) {
      return null
    }

    const buffer = Buffer.from(JSON.stringify({
      email,
      datetime: new Date().toISOString()
    }))

    const hash = await this.hash(buffer.toString())

    const link = `/confirmation?link=${hash.split(':')[1]}`

    await this.emailSender.sendConfirmationEmail(
      email ?? '',
      link
    )

    return email
  }
}
