export abstract class ConfirmationEmailTokenRepository {
  abstract storeToken (email: string, token: string): Promise<void>
}
