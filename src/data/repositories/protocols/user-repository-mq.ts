export interface EmailPayload {
  to: string
  hash: string
}

export abstract class UserMessageQueueRepository {
  abstract addEmailTaskToQueue (payload: EmailPayload): Promise<void>
  abstract listen (): Promise<void>
}
