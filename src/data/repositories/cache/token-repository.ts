export abstract class TokenRepository {
  abstract set (key: string, value: string): Promise<void>
  abstract getBykey (key: string): Promise<string | null>
}
