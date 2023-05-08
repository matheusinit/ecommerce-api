import { describe, it, expect } from 'vitest'
import { LogoutUser } from './logout-user'
import { InMemoryTokenRepository } from '~/data/repositories/in-memory/in-memory-token-repository'

describe('Logout user', () => {
  it('should throw an error if the token is invalid', async () => {
    const inMemoryTokenRepository = new InMemoryTokenRepository()
    const sut = new LogoutUser(inMemoryTokenRepository)
    const accessToken = 'invalid-token'

    const result = await sut.execute({ accessToken })

    expect(result.sucess).toBe(false)
  })
})
