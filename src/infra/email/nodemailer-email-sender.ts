import { type EmailSender } from './email-sender'
import nodemailer from 'nodemailer'

export class NodeMailerEmailSender implements EmailSender {
  async sendConfirmationEmail (email: string, confirmationLink: string): Promise<void> {
    const mailClient = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'johathan.miller77@ethereal.email',
        pass: 'EUKwwjbS5Qax2ZJDBt'
      }
    })

    await mailClient.sendMail({
      from: 'Ecommerce <johathan.miller77@ethereal.email>',
      to: email,
      subject: 'Confirmation email - Ecommerce',
      html: `
        ${confirmationLink}
      `
    })

    mailClient.close()
  }
}
