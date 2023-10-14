import { describe, it, expect, vitest } from 'vitest'
import { ConfirmationEmailImpl } from './confirmation-email'
import { type ConfirmationEmailLink } from '../procotols/confirmation-email-link'
import { type ConfirmationEmailPayload, type EmailSender } from '~/infra/email/email-sender'

class FakeConfirmationEmailLink implements ConfirmationEmailLink {
  async create (email: string): Promise<string> {
    return 'confirmation-email-link'
  }
}

class FakeEmailSender implements EmailSender {
  async sendConfirmationEmail (payload: ConfirmationEmailPayload): Promise<void> {}
}

const makeSut = () => {
  const confirmationEmailLink = new FakeConfirmationEmailLink()
  const emailSender = new FakeEmailSender()
  const sut = new ConfirmationEmailImpl(confirmationEmailLink, emailSender)

  return {
    confirmationEmailLink,
    emailSender,
    sut
  }
}

describe('Confirmation email', () => {
  it('when email is provided, then should call method to create confirmation email link', async () => {
    const { sut, confirmationEmailLink } = makeSut()
    const spy = vitest.spyOn(confirmationEmailLink, 'create')

    await sut.send('matheus@email.com')

    expect(spy).toHaveBeenCalledWith('matheus@email.com')
  })

  it('when email is provided, then should call method to send email', async () => {
    const { sut, emailSender } = makeSut()
    const spy = vitest.spyOn(emailSender, 'sendConfirmationEmail')

    await sut.send('matheus@email.com')

    expect(spy).toHaveBeenCalledWith({
      to: 'matheus@email.com',
      confirmationLink: 'confirmation-email-link',
      from: 'Ecommerce <ecommerce@api.com>',
      subject: 'Confirmation email - Ecommerce'
    })
  })
})
