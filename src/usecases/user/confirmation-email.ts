import { NodeMailerEmailSender } from '~/infra/email/nodemailer-email-sender'
import { ConfirmationEmailLinkImpl } from '~/usecases/user/confirmation-email-link'
import { hash } from '~/utils/hashing'
import { PrismaConfirmationEmailTokenRepository } from '~/data/repositories/prisma/prisma-confirmation-email-token-repository'

export class ConfirmationEmail {
  async send (email: string) {
    const confirmationEmailTokenRepository = new PrismaConfirmationEmailTokenRepository()
    const confirmationEmailLink = new ConfirmationEmailLinkImpl(hash, confirmationEmailTokenRepository)

    const emailSender = new NodeMailerEmailSender()

    // TODO: Route that confirms email with hash passed as link
    const confirmationLink = await confirmationEmailLink.create(email)

    await emailSender.sendConfirmationEmail({
      to: email,
      confirmationLink,
      from: 'Ecommerce <ecommerce@api.com>',
      subject: 'Confirmation email - Ecommerce'
    })
  }
}
