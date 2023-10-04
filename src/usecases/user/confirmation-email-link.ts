import { type ConfirmationEmailLink } from '../procotols/confirmation-email-link'

type Hash = (value: string) => Promise<string>

export class ConfirmationEmailLinkImpl implements ConfirmationEmailLink {
  constructor (
    private readonly hash: Hash
  ) {}

  private getHashKey (hash: string) {
    return hash.split(':')[1]
  }

  private createBuffer (email: string, datetime: string) {
    return Buffer.from(JSON.stringify({
      email,
      datetime
    }))
  }

  async create (email: string) {
    const buffer = this.createBuffer(email, new Date().toISOString())

    const bufferInString = buffer.toString()

    const hash = await this.hash(bufferInString)

    const hashKey = this.getHashKey(hash)

    const confirmationLink = `/confirmation?link=${hashKey}`

    return confirmationLink
  }
}
