interface EnqueueResponse {
  message: string
}

export abstract class ConfirmationEmailQueue {
  abstract enqueue (email: string): Promise<EnqueueResponse>
}
