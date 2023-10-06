import { NodeMailerEmailSender } from '~/infra/email/nodemailer-email-sender'
import { type ConfirmationEmailLink } from '../procotols/confirmation-email-link'
import { type ConfirmationEmail } from '../procotols/confirmation-email'

export class ConfirmationEmailImpl implements ConfirmationEmail {
  constructor (
    private readonly confirmationEmailLink: ConfirmationEmailLink
  ) {}

  async send (email: string) {
    const emailSender = new NodeMailerEmailSender()

    // TODO: Route that confirms email with hash passed as link
    const confirmationLink = await this.confirmationEmailLink.create(email)

    await emailSender.sendConfirmationEmail({
      to: email,
      confirmationLink,
      from: 'Ecommerce <ecommerce@api.com>',
      subject: 'Confirmation email - Ecommerce'
    })
  }
}
