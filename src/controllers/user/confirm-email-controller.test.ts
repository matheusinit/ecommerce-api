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

  it('when provided token is not found is database, then should get not found', async () => {
    const validToken = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'

    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .query({
        token: validToken
      }).send()

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('Token not found')
  })
})
