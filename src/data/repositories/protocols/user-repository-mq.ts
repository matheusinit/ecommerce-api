export interface EmailPayload {
  to: string
  hash: string
}

export interface MessageQueueResult {
  error: boolean
  message: string
}

export abstract class UserMessageQueueRepository {
  abstract addEmailTaskToQueue (email: string): Promise<MessageQueueResult>
  abstract listen (process: (email: string) => Promise<void>): Promise<void>
}
