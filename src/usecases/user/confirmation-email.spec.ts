import { describe, it, expect, vitest } from 'vitest'
import { ConfirmationEmailImpl } from './confirmation-email'
import { type ConfirmationEmailLink } from '../procotols/confirmation-email-link'

class FakeConfirmationEmailLink implements ConfirmationEmailLink {
  async create (email: string): Promise<string> {
    return 'confirmation-email-link'
  }
}

describe('Confirmation email', () => {
  it('when email is provided, then should call method to create confirmation email link', async () => {
    const confirmationEmailLink = new FakeConfirmationEmailLink()
    const sut = new ConfirmationEmailImpl(confirmationEmailLink)
    const spy = vitest.spyOn(confirmationEmailLink, 'create')

    await sut.send('matheus@email.com')

    expect(spy).toHaveBeenCalledWith('matheus@email.com')
  })
})
