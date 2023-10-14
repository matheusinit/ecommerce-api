import { ConfirmEmailController } from '~/controllers/confirmation-email/confirm-email-controller'
import { PrismaConfirmationEmailTokenRepository } from '~/data/repositories/prisma/prisma-confirmation-email-token-repository'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { EmailImpl } from '~/usecases/confirmation-email/email'

export const makeConfirmEmailController = () => {
  const userRepository = new PrismaUserRepository()
  const confirmationEmailTokenRepository = new PrismaConfirmationEmailTokenRepository()
  const email = new EmailImpl(confirmationEmailTokenRepository, userRepository)

  return new ConfirmEmailController(email)
}
