import { describe, it, expect, vitest } from 'vitest'
import { InMemoryUserMessageQueueRepository } from '~/data/repositories/in-memory/in-memory-user-message-queue-repository'
import { EmailConsumer } from './email-consumer'

class FakeEmailSender {
  async sendConfirmationEmail (email: string, confirmationLink: string) {}
}

const makeSut = () => {
  const inMemoryMQUserRepository = new InMemoryUserMessageQueueRepository()
  const hash = vitest.fn().mockImplementationOnce(async (value: string) => 'salt:faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26')
  const emailSender = new FakeEmailSender()
  const sut = new EmailConsumer(inMemoryMQUserRepository, hash, emailSender)

  return {
    inMemoryMQUserRepository,
    hash,
    emailSender,
    sut
  }
}

describe('Email consumer', () => {
  it('when method consume is called, then should call user MQ Repository', async () => {
    const { sut, inMemoryMQUserRepository } = makeSut()
    const repositoryMQListenSpy = vitest.spyOn(inMemoryMQUserRepository, 'listen')

    await sut.consume()

    expect(repositoryMQListenSpy).toHaveBeenCalledOnce()
  })

  it('when message is null, then should return null', async () => {
    const { sut, inMemoryMQUserRepository } = makeSut()
    vitest.spyOn(inMemoryMQUserRepository, 'listen').mockImplementationOnce(async () => null)

    const result = await sut.consume()

    expect(result).toEqual(null)
  })

  it('when message is null, then should not hash the message', async () => {
    const { sut, hash, inMemoryMQUserRepository } = makeSut()
    vitest.spyOn(inMemoryMQUserRepository, 'listen').mockImplementationOnce(async () => null)

    await sut.consume()

    expect(hash).not.toHaveBeenCalled()
  })

  it('when message is valid, then should create a hash with email and current datetime', async () => {
    const { sut, hash } = makeSut()

    await sut.consume()

    expect(hash).toHaveBeenCalledWith(expect.any(String))
  })

  it('when message is valid, then should send email confirmation link', async () => {
    const { sut, emailSender } = makeSut()
    const spy = vitest.spyOn(emailSender, 'sendConfirmationEmail')

    await sut.consume()

    expect(spy).toHaveBeenCalledWith(
      'valid-email@email.com',
      expect.stringMatching(/\/confirmation\?link=[a-z0-9]{128}/gm)
    )
  })
})
