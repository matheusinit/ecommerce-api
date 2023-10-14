import { describe, expect, it } from 'vitest'
import { SendConfirmationEmailController } from './send-confirmation-email-controller'
import { FakeConfirmationEmailQueue } from 'test/fakes/fake-confirmation-email-queue'

describe('Send Confirmation Email Controller', () => {
  it('when unexpected error is thrown, then should get internal server error', async () => {
    const fakeConfirmationEmailQueue = new FakeConfirmationEmailQueue()
    const controller = new SendConfirmationEmailController(fakeConfirmationEmailQueue)

    const response = await controller.handle({
      body: {
        email: 'valid-email'
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('Internal server error')
  })
})
