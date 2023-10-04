export abstract class ConfirmationEmailLink {
  abstract create (email: string): Promise<string>
}
