import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'
import { type EmailSender } from '~/infra/email/email-sender'
import { type ConfirmationEmailLink } from '~/usecases/procotols/confirmation-email-link'

export class EmailConsumer {
  constructor (
    private readonly repository: UserMessageQueueRepository,
    private readonly confirmationEmailLink: ConfirmationEmailLink,
    private readonly emailSender: EmailSender
  ) {}

  public async runAsyncJob (email: string) {
    console.log('[AMQP] Consumer is running...')
    console.log('[AMQP] Awaiting for messages...')

    // TODO: Route that confirms email with hash passed as link

    const confirmationLink = await this.confirmationEmailLink.create(email)

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
