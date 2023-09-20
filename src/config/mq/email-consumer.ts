import { type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'

type Hash = (value: string) => Promise<string>

export class EmailConsumer {
  constructor (
    private readonly repository: UserMessageQueueRepository,
    private readonly hash: Hash
  ) {}

  async consume () {
    const email = await this.repository.listen()

    // Get the email
    // Create a hash from email and current datetime
    // Generate a link to confirm account
    // Send a message to the email with the
    //
    //
    const buffer = Buffer.from(JSON.stringify({
      email,
      datetime: new Date().toISOString()
    }))

    await this.hash(buffer.toString())

    return email
  }
}
