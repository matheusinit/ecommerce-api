import { describe, it, expect, vitest } from 'vitest'
import { InMemoryUserMessageQueueRepository } from '~/data/repositories/in-memory/in-memory-user-message-queue-repository'
import { EmailConsumer } from './email-consumer'
import { type EmailSender } from '~/infra/email/email-sender'
import { type ConfirmationEmailLink } from '~/usecases/procotols/confirmation-email-link'

interface ConfirmationEmailPayload {
  to: string
  confirmationLink: string
  subject: string
  from: string
}

class FakeEmailSender implements EmailSender {
  async sendConfirmationEmail (payload: ConfirmationEmailPayload) {}
}

const makeSut = () => {
  class FakeConfirmationEmailLink implements ConfirmationEmailLink {
    async create (email: string) {
      return '/confirmation?link=faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'
    }
  }

  const inMemoryMQUserRepository = new InMemoryUserMessageQueueRepository()
  const emailSender = new FakeEmailSender()
  const confirmationEmailLink = new FakeConfirmationEmailLink()
  const sut = new EmailConsumer(inMemoryMQUserRepository, confirmationEmailLink, emailSender)

  return {
    inMemoryMQUserRepository,
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

  // it('when message is valid, then should create a hash with email and current datetime', async () => {
  //   const { sut, hash } = makeSut()
  //
  //   await sut.runAsyncJob('matheus@email.com')
  //
  //   expect(hash).toHaveBeenCalledWith(expect.any(String))
  // })

  it('when message is valid, then should send email confirmation link', async () => {
    const { sut, emailSender } = makeSut()
    const spy = vitest.spyOn(emailSender, 'sendConfirmationEmail')

    await sut.runAsyncJob('matheus@email.com')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmationLink: expect.stringMatching(/\/confirmation\?link=[a-z0-9]{128}/gm)
      })
    )
  })
})
