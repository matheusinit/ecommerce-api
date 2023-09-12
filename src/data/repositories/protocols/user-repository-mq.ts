export abstract class UserMessageQueueRepository {
  abstract addEmailTaskToQueue (email: string): Promise<void>
}
