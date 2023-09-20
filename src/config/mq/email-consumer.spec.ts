import { describe, it, expect, vitest } from 'vitest'
import { InMemoryUserMessageQueueRepository } from '~/data/repositories/in-memory/in-memory-user-message-queue-repository'
import { EmailConsumer } from './email-consumer'

const makeSut = () => {
  const inMemoryMQUserRepository = new InMemoryUserMessageQueueRepository()
  const hash = vitest.fn().mockImplementationOnce(async (value: string) => 'salt:hashedValue')
  const sut = new EmailConsumer(inMemoryMQUserRepository, hash)

  return {
    inMemoryMQUserRepository,
    hash,
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

  it('when payload is null, then should return null', async () => {
    const { sut, inMemoryMQUserRepository } = makeSut()
    vitest.spyOn(inMemoryMQUserRepository, 'listen').mockImplementationOnce(async () => null)

    const result = await sut.consume()

    expect(result).toEqual(null)
  })

  it('when message is valid, then should create a hash with email and current datetime', async () => {
    const { sut, hash } = makeSut()

    await sut.consume()

    expect(hash).toHaveBeenCalledWith(expect.any(String))
  })
})
