import { type EnqueueResponse } from './dtos/enqueue-response'

export abstract class ConfirmationEmailQueue {
  abstract enqueue (email: string): Promise<EnqueueResponse>
}
