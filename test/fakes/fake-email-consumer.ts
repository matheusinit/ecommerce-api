import { type EmailConsumerAbstract } from '~/config/mq/email-consumer'

export class FakeEmailConsumer implements EmailConsumerAbstract {
  async consume (): Promise<void> {}
}
