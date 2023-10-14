import { describe, it, expect } from 'vitest'
import { ConfirmEmailController } from './confirm-email-controller'
import { type HttpRequest } from '~/infra/protocols/http-request'
import { FakeEmail } from 'test/fakes/fake-email'

describe('Confirm Email Controller', () => {
  it('when unexpected error is thrown, then should get internal server error', async () => {
    const email = new FakeEmail()
    const confirmEmailController = new ConfirmEmailController(email)
    const token = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'

    const httpRequest: HttpRequest = {
      body: {},
      query: {
        token
      }
    }

    const httpResponse = await confirmEmailController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe('Internal server error')
  })
})
