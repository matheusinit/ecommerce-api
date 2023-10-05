import { describe, it, expect, vitest } from 'vitest'
import { ConfirmationEmailLinkImpl } from './confirmation-email-link'

const makeSut = () => {
  const hash = vitest.fn().mockImplementationOnce(async (value: string) => 'salt:faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26')
  const sut = new ConfirmationEmailLinkImpl(hash)

  return {
    hash,
    sut
  }
}

describe('Confirmation Email Link', () => {
  it('when email is provided, then should create a hash with email and current datetime', async () => {
    const { sut, hash } = makeSut()

    await sut.create('matheus@email.com')

    expect(hash).toHaveBeenCalledWith(expect.any(String))
  })

  it('when email is provided, then should return confirmation link with hash', async () => {
    const { sut } = makeSut()

    const link = await sut.create('matheus@email.com')

    expect(link).toMatch(/\/confirmation\?link=[a-z0-9]{128}/gm)
  })
})
