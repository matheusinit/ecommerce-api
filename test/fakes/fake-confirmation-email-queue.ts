import { type ConfirmationEmailQueue } from '~/usecases/procotols/confirmation-email-queue'
import { type EnqueueResponse } from '~/usecases/procotols/dtos/enqueue-response'

export class FakeConfirmationEmailQueue implements ConfirmationEmailQueue {
  async enqueue (email: string): Promise<EnqueueResponse> {
    throw new Error('Unexpected error')
  }
}
