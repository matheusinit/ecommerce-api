interface EnqueueResponse {
  message: string
}

export abstract class EmailQueue {
  abstract enqueue (email: string): Promise<EnqueueResponse>
}
