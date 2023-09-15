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
  abstract addEmailTaskToQueue (payload: EmailPayload): Promise<void>
  abstract listen (): Promise<EmailPayload | null>
}
