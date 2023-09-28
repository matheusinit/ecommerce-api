import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'
import { type EmailSender } from '~/infra/email/email-sender'

type Hash = (value: string) => Promise<string>

export class EmailConsumer {
  constructor (
    private readonly repository: UserMessageQueueRepository,
    private readonly hash: Hash,
    private readonly emailSender: EmailSender
  ) {}

  private getHashKey (hash: string) {
    return hash.split(':')[1]
  }

  private createBuffer (email: string, datetime: string) {
    return Buffer.from(JSON.stringify({
      email,
      datetime
    }))
  }

  public async runAsyncJob (email: string) {
    console.log('[AMQP] Consumer is running...')
    console.log('[AMQP] Awaiting for messages...')

    const buffer = this.createBuffer(email, new Date().toISOString())

    const bufferInString = buffer.toString()

    const hash = await this.hash(bufferInString)

    const hashKey = this.getHashKey(hash)

    const confirmationLink = `/confirmation?link=${hashKey}`

    await this.emailSender.sendConfirmationEmail({
      to: email,
      confirmationLink,
      from: 'Ecommerce <johathan.miller77@ethereal.email>',
      subject: 'Confirmation email - Ecommerce'
    })
  }

  async consume () {
    await this.repository.listen(this.runAsyncJob)
  }
}
