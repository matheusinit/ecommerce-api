interface EnqueueResponse {
  message: string
}

export abstract class ConfirmationEmail {
  abstract enqueue (email: string): Promise<EnqueueResponse>
}
