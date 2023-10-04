import { it, describe, expect, vitest } from 'vitest'
import { ConfirmationEmailQueueImpl } from './confirmation-email-queue'
import { InMemoryUserRepository } from '~/data/repositories/in-memory/in-memory-user-repository'
import { InMemoryUserMessageQueueRepository } from '~/data/repositories/in-memory/in-memory-user-message-queue-repository'

const makeSut = () => {
  const userMessageQueue = new InMemoryUserMessageQueueRepository()
  const userRepository = new InMemoryUserRepository()
  const sut = new ConfirmationEmailQueueImpl(userRepository, userMessageQueue)

  return {
    sut,
    userRepository,
    userMessageQueue
  }
}

describe('Enqueue confirmation email', () => {
  it('when email is not provided, then should get an error', async () => {
    const { sut } = makeSut()

    // @ts-expect-error "Pass email as undefined to test case"
    const promise = sut.enqueue()

    void expect(promise).rejects.toThrowError('Email is required')
  })

  it('when an invalid email is provided, then should get an error', async () => {
    const { sut } = makeSut()

    const promise = sut.enqueue('invalid-email')

    void expect(promise).rejects.toThrowError('Invalid email was provided does not has the format: john.doe@email.com')
  })

  it('when an user is not found with given email, then should get an error', async () => {
    const { sut } = makeSut()

    const promise = sut.enqueue('matheus@email.com')

    void expect(promise).rejects.toThrowError('User not found with given email')
  })

  it('when a valid email is provided, then should send a confirmation email', async () => {
    const { sut, userMessageQueue, userRepository } = makeSut()
    await userRepository.store({
      name: 'Matheus',
      email: 'matheus@email.com',
      type: 'STORE-ADMIN',
      password: 'some-random-password1.'
    })
    const addEmailTaskToQueueSpy = vitest.spyOn(userMessageQueue, 'addEmailTaskToQueue')

    await sut.enqueue('matheus@email.com')

    expect(addEmailTaskToQueueSpy).toBeCalledTimes(1)
  })

  it('when a valid email is provided, then should call Message Queue to send email async', async () => {
    const { sut, userMessageQueue, userRepository } = makeSut()
    await userRepository.store({
      name: 'Matheus',
      email: 'matheus@email.com',
      type: 'STORE-ADMIN',
      password: 'some-random-password1.'
    })
    const addEmailTaskToQueueSpy = vitest.spyOn(userMessageQueue, 'addEmailTaskToQueue')

    await sut.enqueue('matheus@email.com')

    expect(addEmailTaskToQueueSpy).toBeCalledWith('matheus@email.com')
  })

  // it('when a valid email is provided, then should call function to create hash from email', async () => {
  //   const { sut, userRepository, hash } = makeSut()
  //   await userRepository.store({
  //     name: 'Matheus',
  //     email: 'matheus@email.com',
  //     type: 'STORE-ADMIN',
  //     password: 'some-random-password1.'
  //   })

  //   await sut.enqueue('matheus@email.com')

  //   expect(hash).toHaveBeenCalledWith('matheus@email.com')
  // })
})
