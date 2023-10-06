export class Email {
  async confirm (token: string) {
    throw new Error('Invalid token')
  }
}
