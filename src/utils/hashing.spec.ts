import { describe, it, expect } from 'vitest'
import { hash } from './hashing'

describe('Hashing', () => {
  it('when buffer string is provided, then should return hash', async () => {
    const sut = hash
    const json = JSON.stringify({
      email: 'matheus@email.com',
      datetime: new Date().toISOString()
    })
    const buffer = Buffer.from(json)

    const hashedValue = await sut(buffer.toString())

    expect(hashedValue).toEqual(expect.any(String))
  })
})
