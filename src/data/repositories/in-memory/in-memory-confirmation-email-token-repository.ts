import { type ConfirmationEmailToken } from '@prisma/client'
import { type ConfirmationEmailTokenRepository } from '../protocols/confirmation-email-token'

export class InMemoryConfirmationEmailTokenRepository implements ConfirmationEmailTokenRepository {
  private readonly repository: ConfirmationEmailToken[] = []

  async storeToken (email: string, token: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getByToken (token: string): Promise<ConfirmationEmailToken | null> {
    return this.repository.find(t => t.token === token) ?? null
  }
}
