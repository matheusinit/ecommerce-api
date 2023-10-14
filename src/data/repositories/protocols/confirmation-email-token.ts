import { type ConfirmationEmailToken } from '@prisma/client'

export abstract class ConfirmationEmailTokenRepository {
  abstract storeToken (email: string, token: string): Promise<void>
  abstract getByToken (token: string): Promise<ConfirmationEmailToken & { createdAt: Date } | null>
}
