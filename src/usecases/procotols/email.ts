export abstract class Email {
  abstract confirm (token: string): Promise<void>
}
