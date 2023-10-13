import { type ConfirmationEmailQueue } from '~/usecases/procotols/confirmation-email-queue'

interface EnqueueResponse {
  message: string
}

export class FakeConfirmationEmailQueue implements ConfirmationEmailQueue {
  async enqueue (email: string): Promise<EnqueueResponse> {
    throw new Error('Unexpected error')
  }
}
