import { type TokenRepository } from '../cache/token-repository'

export class InMemoryTokenRepository implements TokenRepository {
  private readonly cache: Record<string, any> = {}

  async set (key: string, value: string): Promise<void> {
    this.cache[key] = value
  }

  async getBykey (key: string): Promise<string | null> {
    return this.cache[key]
  }
}
