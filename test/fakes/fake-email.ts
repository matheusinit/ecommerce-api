export class FakeEmail {
  async confirm (token: string): Promise<void> {
    throw Error('Unexpected error')
  }
}
