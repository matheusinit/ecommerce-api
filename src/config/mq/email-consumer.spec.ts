import { describe, it, expect, vitest } from 'vitest'
import { InMemoryUserMessageQueueRepository } from '~/data/repositories/in-memory/in-memory-user-message-queue-repository'
import { EmailConsumer } from './email-consumer'
import { type ConfirmationEmail } from '~/usecases/procotols/confirmation-email'

class FakeConfirmationEmail implements ConfirmationEmail {
  async send (email: string): Promise<void> {}
}

const makeSut = () => {
  const inMemoryMQUserRepository = new InMemoryUserMessageQueueRepository()
  const confirmationEmail = new FakeConfirmationEmail()
  const sut = new EmailConsumer(inMemoryMQUserRepository, confirmationEmail)

  return {
    inMemoryMQUserRepository,
    confirmationEmail,
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

  // it('when message is valid, then should send email confirmation link', async () => {
  //   const { sut, emailSender } = makeSut()
  //   const spy = vitest.spyOn(emailSender, 'sendConfirmationEmail')
  //
  //   await sut.runAsyncJob('matheus@email.com')
  //
  //   expect(spy).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       confirmationLink: expect.stringMatching(/\/confirmation\?link=[a-z0-9]{128}/gm)
  //     })
  //   )
  // })
})
