export class ConfirmationEmail {
  async send (email: string) {
    throw new Error('Email is required')
  }
}
