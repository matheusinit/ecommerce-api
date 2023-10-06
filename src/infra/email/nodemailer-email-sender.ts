import { env } from '~/config/env'
import { type EmailSender } from './email-sender'
import nodemailer from 'nodemailer'
import Email from 'email-templates'

interface ConfirmationEmailPayload {
  to: string
  confirmationLink: string
  subject: string
  from: string
}

export class NodeMailerEmailSender implements EmailSender {
  async sendConfirmationEmail ({
    confirmationLink,
    from,
    subject,
    to
  }: ConfirmationEmailPayload): Promise<void> {
    const mailClient = nodemailer.createTransport({
      host: env.SMTP_PROVIDER ?? 'smtp.ethereal.email',
      port: Number(env.SMTP_PORT) ?? 587,
      auth: {
        user: env.SMTP_USER ?? 'johathan.miller77@ethereal.email',
        pass: env.SMTP_PASSWORD ?? 'EUKwwjbS5Qax2ZJDBt'
      }
    })

    const email = new Email({
      message: {
        from
      },
      send: true,
      transport: mailClient
    })

    await email.send({
      template: 'confirmation-email',
      message: {
        to,
        subject
      },
      locals: {
        name: 'Matheus Oliveira',
        confirmationLink,
        email: to
      }
    })

    mailClient.close()
  }
}
