export abstract class ConfirmationEmail {
  abstract enqueue (email: string): Promise<void>
}
