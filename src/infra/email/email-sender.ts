export interface ConfirmationEmailPayload {
  to: string
  confirmationLink: string
  subject: string
  from: string
}

export abstract class EmailSender {
  abstract sendConfirmationEmail (payload: ConfirmationEmailPayload): Promise<void>
}
