import { describe, it, expect } from 'vitest'
import { LogoutUser } from './logout-user'
import { InMemoryTokenRepository } from '~/data/repositories/in-memory/in-memory-token-repository'

const makeSut = (throwError: boolean = false) => {
  const inMemoryTokenRepository = new InMemoryTokenRepository()

  let verifyTokenMocked

  if (throwError) {
    verifyTokenMocked = async (token: string, secret?: string) => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    }
  } else {
    verifyTokenMocked = async (token: string, secret?: string) => {
      return await new Promise((resolve, reject) => {
        resolve({
          id: 'user-id',
          type: 'user-type'
        })
      })
    }
  }
  const sut = new LogoutUser(inMemoryTokenRepository, verifyTokenMocked)

  return {
    sut, verifyTokenMocked
  }
}

describe('Logout user', () => {
  it('should throw an error if the token is invalid', async () => {
    const { sut } = makeSut(true)
    const accessToken = 'invalid-token'

    const result = await sut.execute({ accessToken })

    expect(result.success).toBe(false)
  })

  it('should return success as true when a valid token is passed', async () => {
    const { sut } = makeSut()
    const accessToken = 'valid-token'

    const result = await sut.execute({ accessToken })

    expect(result.success).toBe(true)
  })
})
