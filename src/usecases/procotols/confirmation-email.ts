export abstract class ConfirmationEmail {
  abstract send (email: string): Promise<void>
}
