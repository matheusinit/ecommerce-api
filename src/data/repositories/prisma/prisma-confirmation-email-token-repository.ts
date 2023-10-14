import { type ConfirmationEmailToken } from '@prisma/client'
import { type ConfirmationEmailTokenRepository } from '../protocols/confirmation-email-token'
import { prisma } from '~/infra/db'

export class PrismaConfirmationEmailTokenRepository implements ConfirmationEmailTokenRepository {
  async getByToken (token: string): Promise<(ConfirmationEmailToken & { createdAt: Date }) | null> {
    return prisma.confirmationEmailToken.findFirst({
      where: {
        token
      }
    })
  }

  async storeToken (email: string, token: string): Promise<void> {
    await prisma.confirmationEmailToken.create({
      data: {
        userEmail: email,
        token
      }
    })
  }

  async getByEmail (email: string): Promise<ConfirmationEmailToken | null> {
    return prisma.confirmationEmailToken.findFirst({
      where: {
        userEmail: email
      }
    })
  }
}
