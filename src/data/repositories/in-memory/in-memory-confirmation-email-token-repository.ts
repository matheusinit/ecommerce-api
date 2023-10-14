import { type ConfirmationEmailToken } from '@prisma/client'
import { type ConfirmationEmailTokenRepository } from '../protocols/confirmation-email-token'

export class InMemoryConfirmationEmailTokenRepository implements ConfirmationEmailTokenRepository {
  private readonly repository: Array<ConfirmationEmailToken & { createdAt: Date }> = []

  async storeToken (email: string, token: string): Promise<void> {
    this.repository.push({
      token,
      userEmail: email,
      createdAt: new Date()
    })
  }

  async getByToken (token: string): Promise<ConfirmationEmailToken & { createdAt: Date } | null> {
    return this.repository.find(t => t.token === token) ?? null
  }

  changeCreatedAt (email: string, newDate: Date): void {
    const index = this.repository.findIndex(t => t.userEmail === email)

    this.repository[index].createdAt = newDate
  }
}
