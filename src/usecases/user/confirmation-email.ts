import { NodeMailerEmailSender } from '~/infra/email/nodemailer-email-sender'
import { type ConfirmationEmailLink } from '../procotols/confirmation-email-link'
import { type ConfirmationEmail } from '../procotols/confirmation-email'
import { type EmailSender } from '~/infra/email/email-sender'

export class ConfirmationEmailImpl implements ConfirmationEmail {
  constructor (
    private readonly confirmationEmailLink: ConfirmationEmailLink,
    private readonly emailSender: EmailSender
  ) {
    this.send = this.send.bind(this)
  }

  async send (email: string) {
    // TODO: Route that confirms email with hash passed as link
    const confirmationLink = await this.confirmationEmailLink.create(email)

    await this.emailSender.sendConfirmationEmail({
      to: email,
      confirmationLink,
      from: 'Ecommerce <ecommerce@api.com>',
      subject: 'Confirmation email - Ecommerce'
    })
  }
}
