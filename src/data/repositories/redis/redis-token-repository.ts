import { type TokenRepository } from '../cache/token-repository'
import redis from '~/infra/cache'

export class RedisTokenRepository implements TokenRepository {
  async set (key: string, value: string): Promise<void> {
    await redis.set(key, value)
  }
}
