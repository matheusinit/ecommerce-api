import { describe, it, expect, vitest } from 'vitest'
import { InMemoryUserMessageQueueRepository } from '~/data/repositories/in-memory/in-memory-user-message-queue-repository'
import { EmailConsumer } from './email-consumer'

describe('Email consumer', () => {
  it('when method consume is called, then should call user MQ Repository', async () => {
    const inMemoryMQUserRepository = new InMemoryUserMessageQueueRepository()
    const sut = new EmailConsumer(inMemoryMQUserRepository)
    const repositoryMQListenSpy = vitest.spyOn(inMemoryMQUserRepository, 'listen')

    await sut.consume()

    expect(repositoryMQListenSpy).toHaveBeenCalledOnce()
  })
})
