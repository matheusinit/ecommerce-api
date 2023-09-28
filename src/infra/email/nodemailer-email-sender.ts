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
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'johathan.miller77@ethereal.email',
        pass: 'EUKwwjbS5Qax2ZJDBt'
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
