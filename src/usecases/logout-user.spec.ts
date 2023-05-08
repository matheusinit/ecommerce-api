import { describe, it, expect } from 'vitest'
import { LogoutUser } from './logout-user'
import { InMemoryTokenRepository } from '~/data/repositories/in-memory/in-memory-token-repository'

describe('Logout user', () => {
  it('should throw an error if the token is invalid', async () => {
    const inMemoryTokenRepository = new InMemoryTokenRepository()
    const verifyTokenMocked = async (token: string, secret?: string) => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    }
    const sut = new LogoutUser(inMemoryTokenRepository, verifyTokenMocked)
    const accessToken = 'invalid-token'

    const result = await sut.execute({ accessToken })

    expect(result.sucess).toBe(false)
  })

  it('should return success as true when a valid token is passed', async () => {
    const inMemoryTokenRepository = new InMemoryTokenRepository()
    const verifyTokenMocked = async (token: string, secret?: string) => {
      return await new Promise((resolve, reject) => {
        resolve({
          id: 'user-id',
          type: 'user-type'
        })
      })
    }
    const sut = new LogoutUser(inMemoryTokenRepository, verifyTokenMocked)
    const accessToken = 'valid-token'

    const result = await sut.execute({ accessToken })

    expect(result.sucess).toBe(true)
  })
})
