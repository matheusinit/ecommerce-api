import ms from 'ms'
import { type TokenRepository } from '../cache/token-repository'
import redis from '~/infra/cache'

export class RedisTokenRepository implements TokenRepository {
  async getBykey (key: string): Promise<string | null> {
    return await redis.get(key)
  }

  async set (key: string, value: string): Promise<void> {
    await redis.set(key, value, {
      EX: ms('5m') / 1000
    })
  }
}
