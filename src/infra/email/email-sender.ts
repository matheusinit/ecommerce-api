export abstract class EmailSender {
  abstract sendConfirmationEmail (email: string, confirmationLink: string): Promise<void>
}
