import { env } from '~/config/env'
import { type EmailSender } from './email-sender'
import nodemailer from 'nodemailer'

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
      port: env.SMTP_PORT ?? 587,
      auth: {
        user: env.SMTP_USER ?? 'johathan.miller77@ethereal.email',
        pass: env.SMTP_PASSWORD ?? 'EUKwwjbS5Qax2ZJDBt'
      }
    })

    await mailClient.sendMail({
      from,
      to,
      subject,
      html: `
        ${confirmationLink}
      `
    })

    mailClient.close()
  }
}
