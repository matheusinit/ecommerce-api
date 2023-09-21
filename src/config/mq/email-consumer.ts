import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'
import { type EmailSender } from '~/infra/email/email-sender'

type Hash = (value: string) => Promise<string>

export class EmailConsumer {
  constructor (
    private readonly repository: UserMessageQueueRepository,
    private readonly hash: Hash,
    private readonly emailSender: EmailSender
  ) {}

  async consume () {
    const email = await this.repository.listen()

    if (!email) {
      return null
    }

    const buffer = Buffer.from(JSON.stringify({
      email,
      datetime: new Date().toISOString()
    }))

    const hash = await this.hash(buffer.toString())

    const link = `/confirmation?link=${hash.split(':')[1]}`

    await this.emailSender.sendConfirmationEmail(email, link)

    return email
  }
}
