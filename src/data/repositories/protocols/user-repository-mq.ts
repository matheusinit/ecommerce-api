export interface EmailPayload {
  to: string
  hash: string
}

export type MessageQueueResult = {
  error: true
  message: string
} | {
  message: string
}

export abstract class UserMessageQueueRepository {
  abstract addEmailTaskToQueue (email: string): Promise<MessageQueueResult>
  abstract listen (): Promise<EmailPayload | null>
}
