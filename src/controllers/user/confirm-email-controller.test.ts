import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '~/app'

describe('Confirm Email Controller', () => {
  it('when invalid token is provided, then should get bad request', async () => {
    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .query({
        token: 'invalid-token'
      }).send()

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Invalid token')
  })
})
